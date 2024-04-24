import { v4 } from "uuid";
import { type CSSProperties, effectScope, watch, watchEffect } from "vue";
import { isDynamicValue } from "./dynamic";

let id = 0;

export class Styles<Class extends string> {
  constructor() {
    this.classNames = new Proxy(
      {},
      {
        get(target: any, p: string): any {
          return target[p] ?? (target[p] = p + "-" + v4());
        },
      },
    ) as any;
  }

  private readonly _id = id++;
  private readonly _effectScope = effectScope();
  private readonly _cssPropertyNames = new Set<string>();
  private readonly _selectorMapCSS = new Map<string, string>();
  private _styleEL?: HTMLStyleElement;
  private _timeoutHandler?: any;
  readonly classNames: Readonly<Record<Class, string>>;

  add(
    className: Class,
    properties: CSSStyle,
    pseudoClasses?: DynamicOptions["pseudoClasses"],
  ) {
    this._handleCSSProperties(
      className,
      getPseudoClasses(pseudoClasses),
      properties,
    );
    return this;
  }

  addDynamic(
    className: Class,
    callback: () => CSSStyle,
    options: DynamicOptions = {},
  ): this {
    this._effectScope.run(() => {
      const watchCallback = () => {
        this._handleCSSProperties(
          className,
          getPseudoClasses(options.pseudoClasses),
          callback(),
        );
      };
      const { source } = options;
      if (source) watch(source, watchCallback, { immediate: true });
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

  private _handleCSSProperties(
    className: string,
    pseudoClasses: PseudoClassType[],
    properties: CSSStyle,
  ) {
    className = (this.classNames as any)[className];
    let selector: string;
    if (pseudoClasses.length)
      selector = pseudoClasses.map((val) => `.${className}:${val}`).join(",");
    else selector = `.${className}`;
    let css = "";
    for (let property in properties) {
      const value = (properties as any)[property];
      if (typeof value === "object") {
        if (isDynamicValue(value)) {
          const name = this._createCSSPropertyName(
            className,
            property,
            pseudoClasses,
          );
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

  private _updateStyleElement() {
    if (this._timeoutHandler) return;
    this._timeoutHandler = setTimeout(() => {
      let output = "";
      for (let css of this._selectorMapCSS.values()) {
        output += css + "\n";
      }
      if (!this._styleEL) {
        this._styleEL = document.createElement("style");
        document.head.appendChild(this._styleEL);
      }
      this._styleEL.innerHTML = output;
    });
  }

  private _createCSSPropertyName(
    className: string,
    propertyName: string,
    pseudoClasses: PseudoClassType[],
  ) {
    const name = `--${className}-${pseudoClasses.join("-")}-${propertyName}-${this._id}`;
    if (!this._cssPropertyNames.has(name)) {
      this._cssPropertyNames.add(name);
      document.documentElement.style.setProperty(name, "");
    }
    return name;
  }
}

function getPseudoClasses(data?: DynamicOptions["pseudoClasses"]) {
  let pseudoClasses: PseudoClassType[];
  if (data) {
    if (data instanceof Array) pseudoClasses = data;
    else pseudoClasses = [data];
  } else pseudoClasses = [];
  return pseudoClasses;
}

function transformProperty(property: string) {
  let result = "";
  for (let i = 0; i < property.length; i++) {
    const char = property[i];
    if (/[A-Z]/.test(char)) result += "-" + char.toLowerCase();
    else result += char;
  }
  return result;
}

export type CSSStyle = {
  [P in keyof CSSProperties]: CSSProperties[P] | DynamicValue<CSSProperties[P]>;
};
