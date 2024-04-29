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

let id = 0, selectorId = 0;
const selectorMapId = {};
function getSelectorId(selector) {
    let id = selectorMapId[selector];
    if (typeof id === "undefined") selectorMapId[selector] = id = selectorId++;
    return id;
}
class Styles {
    constructor(){
        this.classNames = new Proxy({}, {
            get (target, p) {
                return target[p] ?? (target[p] = p + "-" + v4());
            }
        });
    }
    _id = id++;
    _effectScope = effectScope();
    _selectorMapCSS = new Map();
    _styleEL;
    _timeoutHandler;
    classNames;
    inject(selector, properties) {
        this._handleCSSProperties(selector, properties, []);
        return this;
    }
    add(className, properties, pseudoClasses) {
        this._handleCSSPropertiesByClassName(className, getPseudoClasses(pseudoClasses), properties);
        return this;
    }
    addDynamic(className, callback, options = {}) {
        setTimeout(()=>{
            this._effectScope.run(()=>{
                const watchCallback = ()=>{
                    this._handleCSSPropertiesByClassName(className, getPseudoClasses(options.pseudoClasses), callback());
                };
                const { source } = options;
                if (source) watch(source, watchCallback, {
                    immediate: true
                });
                else watchEffect(watchCallback);
            });
        });
        return this;
    }
    injectDynamic(selector, callback, options = {}) {
        setTimeout(()=>{
            this._effectScope.run(()=>{
                const watchCallback = ()=>{
                    this._handleCSSProperties(selector, callback(), []);
                };
                const { source } = options;
                if (source) watch(source, watchCallback, {
                    immediate: true
                });
                else watchEffect(watchCallback);
            });
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
    _handleCSSPropertiesByClassName(className, pseudoClasses, properties) {
        className = this.classNames[className];
        let selector;
        if (pseudoClasses.length) selector = pseudoClasses.map((val)=>`.${className}:${val}`).join(",");
        else selector = `.${className}`;
        this._handleCSSProperties(selector, properties, pseudoClasses);
    }
    _handleCSSProperties(selector, properties, pseudoClasses) {
        let css = "";
        for(let property in properties){
            const value = properties[property];
            if (typeof value === "object") {
                if (isDynamicValue(value)) {
                    const name = this._createCSSPropertyName(selector, property, pseudoClasses);
                    document.documentElement.style.setProperty(name, value.value + "");
                    css += `${transformProperty(property)}:var(${name});`;
                }
            } else {
                css += `${transformProperty(property)}:${value};`;
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
            this._timeoutHandler = undefined;
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
    _createCSSPropertyName(selector, propertyName, pseudoClasses) {
        return `--${getSelectorId(selector)}-${pseudoClasses.join("-")}-${propertyName}-${this._id}`;
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
function transformProperty(property) {
    let result = "";
    for(let i = 0; i < property.length; i++){
        const char = property[i];
        if (/[A-Z]/.test(char)) result += "-" + char.toLowerCase();
        else result += char;
    }
    return result;
}

export { Styles, dynamic, isDynamicValue };
