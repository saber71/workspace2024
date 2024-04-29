/// <reference types="../types.d.ts" />

import { CSSProperties } from 'vue';
import { WatchSource } from 'vue';

export declare type CSSStyle = {
    [P in keyof CSSProperties]: CSSProperties[P] | DynamicValue<CSSProperties[P]>;
};

export declare function dynamic<Value>(value: Value): DynamicValue<Value>;

export declare interface DynamicOptions {
    source?: WatchSource | WatchSource[];
    pseudoClasses?: PseudoClassType | PseudoClassType[];
}

export declare function isDynamicValue(arg: any): arg is DynamicValue;

export declare class Styles<Class extends string> {
    constructor();
    private readonly _id;
    private readonly _effectScope;
    private readonly _selectorMapCSS;
    private _styleEL?;
    private _timeoutHandler?;
    readonly classNames: Readonly<Record<Class, string>>;
    inject(selector: string, properties: CSSStyle): this;
    add(className: Class, properties: CSSStyle, pseudoClasses?: DynamicOptions["pseudoClasses"]): this;
    addDynamic(className: Class, callback: () => CSSStyle, options?: DynamicOptions): this;
    injectDynamic(selector: Class, callback: () => CSSStyle, options?: Omit<DynamicOptions, "pseudoClasses">): this;
    dispose(): void;
    private _handleCSSPropertiesByClassName;
    private _handleCSSProperties;
    private _updateStyleElement;
    private _createCSSPropertyName;
}

export { }
