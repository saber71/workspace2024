import { App } from 'vue';
import { Class } from 'dependency-injection';
import { ComponentCustomProps } from 'vue';
import { ComponentPublicInstance } from 'vue';
import { Container } from 'dependency-injection';
import { DefineSetupFnComponent } from 'vue';
import { DirectiveBinding } from 'vue';
import { EmitsOptions } from 'vue';
import { getCurrentInstance } from 'vue';
import { HTMLAttributes } from 'vue';
import { Injectable } from 'dependency-injection';
import { LoadableContainer } from 'dependency-injection';
import { NavigationGuardNext } from 'vue-router';
import { ObjectEmitsOptions } from 'vue';
import { Prop } from 'vue';
import { PublicProps } from 'vue';
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

export declare function BindThis(): (target: object, arg: any) => void;

export declare function Component<Props extends VueComponentBaseProps>(option?: ComponentOption): (clazz: VueComponentClass<Props>, ctx?: ClassDecoratorContext) => void;

declare interface ComponentOption {
    provideThis?: string | boolean;
}

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

declare function Disposable_2(methodName?: string): (target: object, arg: any) => void;
export { Disposable_2 as Disposable }

export declare type DistributiveOmit<T, K extends keyof any> = T extends T ? Omit<T, K> : never;

declare type DistributiveVModel<T extends {}> = T extends T ? WithVModel<T> : never;

declare type DistributiveVSlots<T extends {}> = T extends T ? WithVSlots<T> : never;

export declare function Hook(type: HookType): (target: object, arg: any) => void;

export declare type HookType = "onMounted" | "onUpdated" | "onUnmounted" | "onBeforeMount" | "onBeforeUnmount" | "onErrorCaptured" | "onRenderTracked" | "onRenderTriggered" | "onActivated" | "onDeactivated" | "onServerPrefetch" | "onBeforeRouteUpdate" | "onBeforeRouteLeave";

declare type KeysOfUnion<T> = T extends T ? keyof T : never;

export declare function Link(option?: {
    refName?: string;
    isDirective?: boolean;
    directiveName?: string;
}): (target: VueComponent, arg: any) => void;

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

export declare const ROUTER = "router";

export declare function RouterGuard(option?: {
    matchTo?: RegExp | ((path: RouteLocationNormalized) => boolean);
    matchFrom?: RegExp | ((path: RouteLocationNormalized) => boolean);
}): (clazz: Class<VueRouterGuard>, ctx?: any) => void;

export declare function Service(option?: Parameters<typeof Injectable>[0]): (clazz: Class, ctx?: any) => void;

export declare function toNative<Props extends VueComponentBaseProps, Emit extends EmitsOptions = {}>(componentClass: VueComponentClass<Props, Emit>, genInstance?: () => VueComponent<Props, Emit>): DefineSetupFnComponent<Props, Emit, {}, Props & (Emit extends string[] ? { [K in `on${Capitalize<Emit[number]>}`]?: ((...args: any[]) => any) | undefined; } : Emit extends ObjectEmitsOptions ? { [K in `on${Capitalize<string & keyof Emit>}`]?: (K extends `on${infer C}` ? (...args: Emit[Uncapitalize<C>] extends (...args: infer P) => any ? P : Emit[Uncapitalize<C>] extends null ? any[] : never) => any : never) | undefined; } : {}), PublicProps>;

export declare type TransformModelValue<T extends {}> = "v-model:modelValue" extends keyof T ? Omit<T, "v-model:modelValue"> & {
    ["v-model"]?: T["v-model:modelValue"];
} : T;

export declare class VueClass {
    static readonly dependencyInjection: LoadableContainer;
    static getInstance<T>(clazz: Class<T>): T;
    static setCustomContainer(container: Container): void;
    static getContainer(): Container;
    static install(app: App, router: Router): Promise<void>;
}

export declare class VueComponent<Props extends VueComponentBaseProps = VueComponentBaseProps, Emit extends EmitsOptions = {}> extends VueService {
    static __test__: boolean;
    static readonly defineProps: ComponentProps<VueComponentBaseProps & any>;
    constructor();
    readonly vueInstance: NonNullable<ReturnType<typeof getCurrentInstance>>;
    readonly context: WithSlotTypes<Emit, Props>;
    readonly childInstMap: Record<string, VueComponent>;
    get props(): Props;
    get router(): Router;
    get route(): RouteLocationNormalizedLoaded;
    render(): VNodeChild;
    onMounted(): void;
    onBeforeUnmounted(): void;
    onUnmounted(): void;
    getLinkElement(refName: string): HTMLElement;
    getLinkInst<Inst extends VueComponent = VueComponent>(name: string): Inst;
}

export declare interface VueComponentBaseProps extends Partial<HTMLAttributes> {
    inst?: string;
}

export declare type VueComponentClass<Props extends VueComponentBaseProps = VueComponentBaseProps, Emit extends EmitsOptions = {}> = {
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

export declare function VueInject(key?: string | symbol): (target: object, arg: any) => void;

export declare class VueRouterGuard {
    static install(router: Router): void;
    beforeEach(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void;
    beforeResolve(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void;
    afterEach(to: RouteLocationNormalized, from: RouteLocationNormalized): void;
    onError(error: Error, to: RouteLocationNormalized, from: RouteLocationNormalizedLoaded): void;
}

export declare class VueService {
    setup(): void;
    reset(): void;
}

export declare function Watcher<T extends VueService>(option?: {
    source?: WatcherTarget<T> | WatcherTarget<T>[];
    option?: WatchOptions;
}): (target: object, arg: any) => void;

export declare type WatcherTarget<T extends VueService> = string | keyof T | ((instance: T) => any);

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


export * from "dependency-injection";

export { }
