import type { App } from 'vue';
import { ComponentCustomProps } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import type { DirectiveBinding } from 'vue';
import { EmitsOptions } from 'vue';
import { getCurrentInstance } from 'vue';
import { HTMLAttributes } from 'vue';
import { IoC } from 'ioc';
import { NavigationGuardNext } from 'vue-router';
import { ObjectEmitsOptions } from 'vue';
import { Prop } from 'vue';
import { RouteLocationNormalized } from 'vue-router';
import { RouteLocationNormalizedLoaded } from 'vue-router';
import { Router } from 'vue-router';
import { SetupContext } from 'vue';
import { StyleValue } from 'vue';
import { VNodeChild } from 'vue';
import { VNodeProps } from 'vue';
import { WatchOptions } from 'vue';

export declare type AllowedComponentProps = {
    class?: any;
    style?: StyleValue;
    [name: string]: any;
};

export declare function applyMetadata(clazz: any, instance: VueComponent | object): void;

export declare function BindThis(): (target: object, arg: any) => void;

export declare type Class<T = any> = {
    new (...args: any[]): T;
};

export declare function Component<Props extends Partial<HTMLAttributes>>(): (clazz: VueComponentClass<Props>, ctx?: ClassDecoratorContext) => void;

export declare type ComponentProps<T extends {}> = ComponentPropsObject<T> | Array<KeysOfUnion<DistributiveOmit<T, "slots">>>;

export declare type ComponentPropsObject<T extends {}> = {
    [U in KeysOfUnion<DistributiveOmit<T, "slots">>]-?: Prop<any>;
};

export declare type ComponentSlots<T extends {
    props: any;
}> = NonNullable<T["props"]["v-slots"]>;

export declare function Computed(): (target: any, arg: any) => void;

declare type DefaultSlots = {
    default(): VNodeChild;
};

export declare type DefineEmits<Emit extends EmitsOptions> = Array<keyof Emit>;

export declare function Directive(name?: string): (clazz: Class<VueDirective>, ctx?: any) => void;

export declare type DistributiveOmit<T, K extends keyof any> = T extends T ? Omit<T, K> : never;

declare type DistributiveVModel<T extends {}> = T extends T ? WithVModel<T> : never;

declare type DistributiveVSlots<T extends {}> = T extends T ? WithVSlots<T> : never;

export declare function getAllMetadata(): [Class, Metadata][];

export declare function getMetadata(clazz: any): Metadata;

export declare function getOrCreateMetadata(clazz: Class | object | any, ctx?: ClassDecoratorContext | {
    kind: string;
    metadata: Record<string, any>;
} | string): Metadata;

export declare function Hook(type: HookType): (target: object, arg: any) => void;

export declare type HookType = "onMounted" | "onUpdated" | "onUnmounted" | "onBeforeMount" | "onBeforeUnmount" | "onErrorCaptured" | "onRenderTracked" | "onRenderTriggered" | "onActivated" | "onDeactivated" | "onServerPrefetch" | "onBeforeRouteUpdate" | "onBeforeRouteLeave";

declare type KeysOfUnion<T> = T extends T ? keyof T : never;

export declare function Link(option?: {
    refName?: string;
    isDirective?: boolean;
    directiveName?: string;
}): (target: VueComponent, arg: any) => void;

export declare class Metadata {
    isComponent: boolean;
    isService: boolean;
    isDirective: boolean;
    isRouterGuard: boolean;
    directiveName: string;
    routerGuardMatchTo?: RegExp;
    routerGuardMatchFrom?: RegExp;
    readonly mutts: {
        propName: string;
        shallow?: boolean;
    }[];
    readonly readonlys: {
        propName: string;
        shallow?: boolean;
    }[];
    readonly links: {
        refName?: string;
        propName: string;
        isDirective?: boolean;
        directiveName?: string;
    }[];
    readonly bindThis: string[];
    readonly hooks: {
        methodName: string;
        type: HookType;
    }[];
    readonly watchers: {
        methodName: string;
        source?: WatcherTarget | WatcherTarget[];
        option?: WatchOptions;
    }[];
    readonly propsWatchers: {
        methodName: string;
        option?: WatchOptions;
    }[];
    readonly computers: string[];
    handleBindThis(instance: object): void;
    handleWatchers(instance: object): void;
    handlePropsWatchers(instance: VueComponent): void;
    handleHook(instance: VueComponent): void;
    handleMut(instance: object): void;
    handleReadonly(instance: object): void;
    handleLink(instance: VueComponent): void;
    handleComputer(instance: object): void;
}

declare type MixDefaultSlots<T extends {}> = "default" extends keyof T ? {} : DefaultSlots;

declare type ModelProps<T extends {}> = Exclude<{
    [Prop in keyof T]: T extends {
        [k in Prop as `onUpdate:${k & string}`]?: any;
    } ? Prop : never;
}[keyof T], undefined>;

export declare const ModuleName = "vue-class";

export declare function Mut(shallow?: boolean): (target: object, arg: any) => void;

export declare function PropsWatcher(option?: WatchOptions): (target: object, arg: string) => void;

declare function Readonly_2(shallow?: boolean): (target: object, arg: any) => void;
export { Readonly_2 as Readonly }

export declare function RouterGuard(option?: {
    matchTo?: RegExp;
    matchFrom?: RegExp;
}): (clazz: Class<VueRouterGuard>, ctx?: any) => void;

export declare function Service(option?: Parameters<typeof IoC.Injectable>[0]): (clazz: Class, ctx?: any) => void;

export declare function toNative<Props extends Partial<HTMLAttributes>, Emit extends EmitsOptions = {}>(componentClass: VueComponentClass<Props, Emit>): (props: Props & (Emit extends string[] ? { [K in `on${Capitalize<Emit[number]>}`]?: ((...args: any[]) => any) | undefined; } : Emit extends ObjectEmitsOptions ? { [K_1 in `on${Capitalize<string & keyof Emit>}`]?: (K_1 extends `on${infer C}` ? (...args: Emit[Uncapitalize<C>] extends (...args: infer P) => any ? P : Emit[Uncapitalize<C>] extends null ? any[] : never) => any : never) | undefined; } : {})) => any;

export declare type TransformModelValue<T extends {}> = "v-model:modelValue" extends keyof T ? Omit<T, "v-model:modelValue"> & {
    ["v-model"]?: T["v-model:modelValue"];
} : T;

export declare class VueClass {
    static getInstance<T>(clazz: Class<T>): T;
    static install(app: App, router: Router, imports: Record<string, () => Promise<any>> | any): Promise<void>;
}

export declare class VueComponent<Props extends Partial<HTMLAttributes> = Partial<HTMLAttributes>, Emit extends EmitsOptions = {}> {
    static __test__: boolean;
    static readonly defineProps: ComponentProps<Partial<HTMLAttributes> & any>;
    constructor();
    readonly vueInstance: NonNullable<ReturnType<typeof getCurrentInstance>>;
    readonly context: WithSlotTypes<Emit, Props>;
    get props(): Props;
    render(): VNodeChild;
}

export declare type VueComponentClass<Props extends Partial<HTMLAttributes> = Partial<HTMLAttributes>, Emit extends EmitsOptions = {}> = {
    new (...args: any[]): VueComponent<Props>;
    defineProps: ComponentProps<Props>;
};

export declare type VueComponentProps<T extends {}> = DistributiveOmit<T, "slots"> & DistributiveVModel<T> & DistributiveVSlots<T> & VNodeProps & AllowedComponentProps & ComponentCustomProps;

export declare class VueDirective<El extends HTMLElement | ComponentPublicInstance = HTMLElement, Value = any> {
    readonly el: El;
    readonly name: string;
    private static readonly _elMapVueDirective;
    private static readonly _directiveNameMapVueDirective;
    static install(app: App): void;
    static getInstance<T extends VueDirective>(el: any, directiveName: string, clazz?: Class<T>): T;
    constructor(el: El, name: string);
    mountedAndUpdated(binding: DirectiveBinding<Value>): void;
    created(binding: DirectiveBinding<Value>): void;
    beforeMount(binding: DirectiveBinding<Value>): void;
    mounted(binding: DirectiveBinding<Value>): void;
    beforeUpdate(binding: DirectiveBinding<Value>): void;
    updated(binding: DirectiveBinding<Value>): void;
    beforeUnmount(binding: DirectiveBinding<Value>): void;
    unmounted(binding: DirectiveBinding<Value>): void;
}

export declare class VueRouterGuard {
    static install(router: Router): void;
    beforeEach(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void;
    beforeResolve(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void;
    afterEach(to: RouteLocationNormalized, from: RouteLocationNormalized): void;
    onError(error: Error, to: RouteLocationNormalized, from: RouteLocationNormalizedLoaded): void;
}

export declare function Watcher(option?: {
    source?: WatcherTarget | WatcherTarget[];
    option?: WatchOptions;
}): (target: object, arg: any) => void;

export declare type WatcherTarget = string | ((instance: VueComponent | object) => any);

export declare type WithSlotTypes<Emit extends EmitsOptions, T extends {}> = Omit<SetupContext<Emit>, "slots"> & {
    slots: NonNullable<VueComponentProps<T>["v-slots"]>;
};

export declare type WithVModel<T extends {}, U extends keyof T = ModelProps<T>> = TransformModelValue<{
    [k in U as `v-model:${k & string}`]?: T[k] | [T[k], string[]];
}>;

export declare type WithVSlots<T extends Record<string, any>> = {
    "v-slots"?: "slots" extends keyof T ? Partial<T["slots"] & {
        $stable: boolean;
    } & MixDefaultSlots<T["slots"]>> : Partial<{
        $stable: boolean;
        default(): VNodeChild;
    }>;
};

export { }
