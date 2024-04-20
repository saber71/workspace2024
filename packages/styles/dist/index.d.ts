/// <reference types="../types.d.ts" />

import { CSSProperties } from 'vue';

export declare type CSSStyle = {
    [P in keyof CSSProperties]: CSSProperties[P] | DynamicValue<CSSProperties[P]>;
};

export declare function dynamic<Value>(value: Value): DynamicValue<Value>;

export declare function isDynamicValue(arg: any): arg is DynamicValue;

export declare class Styles<Class extends string> {
    constructor();
    private readonly _id;
    private readonly _effectScope;
    private readonly _cssPropertyNames;
    private readonly _selectorMapCSS;
    private _styleEL?;
    private _timeoutHandler?;
    readonly classNames: Readonly<Record<Class, string>>;
    add(className: string, properties: CSSStyle, pseudoClasses: DynamicOptions["pseudoClasses"]): this;
    addDynamic(className: string, callback: () => CSSStyle, options?: DynamicOptions): this;
    dispose(): void;
    private _handleCSSProperties;
    private _updateStyleElement;
    private _createCSSPropertyName;
}

export { }
