import { v4 } from 'uuid';
import { effectScope, watch, watchEffect } from 'vue';

function dynamic(value) {
    return {
        type: "dynamic-value",
        value
    };
}
function isDynamicValue(arg) {
    return arg?.type === "dynamic-value";
}

let id = 0;
class Styles {
    constructor(){
        this.classNames = new Proxy({}, {
            get (target, p) {
                return target[p] ?? (target[p] = v4());
            }
        });
    }
    _id = id++;
    _effectScope = effectScope();
    _cssPropertyNames = new Set();
    _selectorMapCSS = new Map();
    _styleEL;
    _timeoutHandler;
    classNames;
    add(className, properties, pseudoClasses) {
        this._handleCSSProperties(className, getPseudoClasses(pseudoClasses), properties);
        return this;
    }
    addDynamic(className, callback, options = {}) {
        this._effectScope.run(()=>{
            const watchCallback = ()=>{
                this._handleCSSProperties(className, getPseudoClasses(options.pseudoClasses), callback());
            };
            const { source } = options;
            if (source) watch(source, watchCallback, {
                immediate: true
            });
            else watchEffect(watchCallback);
        });
        return this;
    }
    dispose() {
        this._effectScope.stop();
        if (this._timeoutHandler) {
            clearTimeout(this._timeoutHandler);
            this._timeoutHandler = undefined;
        }
        if (this._styleEL) {
            document.head.removeChild(this._styleEL);
            this._styleEL = undefined;
        }
    }
    _handleCSSProperties(className, pseudoClasses, properties) {
        let selector;
        if (pseudoClasses.length) selector = pseudoClasses.map((val)=>`.${className}:${val}`).join(",");
        else selector = `.${className}`;
        let css = "";
        for(let property in properties){
            const value = properties[property];
            if (typeof value === "object") {
                if (isDynamicValue(value)) {
                    const name = this._createCSSPropertyName(className, property, pseudoClasses);
                    document.documentElement.style.setProperty(name, value.value + "");
                    css += `${property}:var(${name});`;
                }
            } else {
                css += `${property}:${value};`;
            }
        }
        css = `${selector}{${css}}`;
        if (this._selectorMapCSS.get(selector) !== css) {
            this._selectorMapCSS.set(selector, css);
            this._updateStyleElement();
        }
    }
    _updateStyleElement() {
        if (this._timeoutHandler) return;
        this._timeoutHandler = setTimeout(()=>{
            let output = "";
            for (let css of this._selectorMapCSS.values()){
                output += css + "\n";
            }
            if (!this._styleEL) {
                this._styleEL = document.createElement("style");
                document.head.appendChild(this._styleEL);
            }
            this._styleEL.innerHTML = output;
        });
    }
    _createCSSPropertyName(className, propertyName, pseudoClasses) {
        const name = `--${className}-${pseudoClasses.join("-")}-${propertyName}-${this._id}`;
        if (!this._cssPropertyNames.has(name)) {
            this._cssPropertyNames.add(name);
            document.documentElement.style.setProperty(name, "");
        }
        return name;
    }
}
function getPseudoClasses(data) {
    let pseudoClasses;
    if (data) {
        if (data instanceof Array) pseudoClasses = data;
        else pseudoClasses = [
            data
        ];
    } else pseudoClasses = [];
    return pseudoClasses;
}

export { Styles, dynamic, isDynamicValue };
