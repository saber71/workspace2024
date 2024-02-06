import type { ComponentCustomProps } from 'vue';
import { EmitsOptions } from 'vue';
import { getCurrentInstance } from 'vue';
import { IoC } from 'ioc';
import { ObjectEmitsOptions } from 'vue';
import type { Prop } from 'vue';
import type { SetupContext } from 'vue';
import type { StyleValue } from 'vue';
import { VNodeChild } from 'vue';
import type { VNodeProps } from 'vue';
import { WatchOptions } from 'vue';

export declare type AllowedComponentProps = {
    class?: any;
    style?: StyleValue;
    [name: string]: any;
};

export declare function applyMetadata(clazz: any, instance: VueComponent | object): void;

export declare type Class<T = any> = {
    new (): T;
};

export declare function Component(): (clazz: VueComponentClass) => void;

export declare type ComponentProps<T extends {}> = ComponentPropsObject<T> | Array<KeysOfUnion<DistributiveOmit<T, "slots">>>;

export declare type ComponentPropsObject<T extends {}> = {
    [U in KeysOfUnion<DistributiveOmit<T, "slots">>]-?: Prop<any>;
};

export declare type ComponentSlots<T extends {
    props: any;
}> = NonNullable<T["props"]["v-slots"]>;

export declare function Computed(): (target: any, name: string) => void;

declare type DefaultSlots = {
    default(): VNodeChild;
};

export declare type DefineEmits<Emit extends EmitsOptions> = Array<keyof Emit>;

export declare type DistributiveOmit<T, K extends keyof any> = T extends T ? Omit<T, K> : never;

declare type DistributiveVModel<T extends {}> = T extends T ? WithVModel<T> : never;

declare type DistributiveVSlots<T extends {}> = T extends T ? WithVSlots<T> : never;

export declare function getMetadata(clazz: any): Metadata;

export declare function Hook(type: HookType): (clazz: VueComponentClass, methodName: string) => void;

export declare type HookType = "onMounted" | "onUpdated" | "onUnmounted" | "onBeforeMount" | "onBeforeUnmount" | "onErrorCaptured" | "onRenderTracked" | "onRenderTriggered" | "onActivated" | "onDeactivated" | "onServerPrefetch";

declare type KeysOfUnion<T> = T extends T ? keyof T : never;

export declare function Link(): (target: VueComponent, propName: string) => void;

declare class Metadata {
    readonly mutts: string[];
    readonly links: string[];
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
    handleWatchers(instance: object): void;
    handlePropsWatchers(instance: VueComponent): void;
    handleHook(instance: VueComponent): void;
    handleMut(instance: object): void;
    handleLink(instance: VueComponent): void;
    handleComputer(instance: object): void;
}

declare type MixDefaultSlots<T extends {}> = "default" extends keyof T ? {} : DefaultSlots;

declare type ModelProps<T extends {}> = Exclude<{
    [Prop in keyof T]: T extends {
        [k in Prop as `onUpdate:${k & string}`]?: any;
    } ? Prop : never;
}[keyof T], undefined>;

export declare function Mut(): (target: object, propName: string) => void;

export declare function PropsWatcher(option?: WatchOptions): (clazz: VueComponentClass, methodName: string) => void;

export declare function Service(option?: Parameters<typeof IoC.Injectable>[0]): (clazz: Class) => void;

export declare function toNative<Props extends {}, Emit extends EmitsOptions>(componentClass: VueComponentClass<Props, Emit>): (props: ComponentPropsObject<Props> & (Emit extends string[] ? { [K in `on${Capitalize<Emit[number]>}`]?: ((...args: any[]) => any) | undefined; } : Emit extends ObjectEmitsOptions ? { [K_1 in `on${Capitalize<string & keyof Emit>}`]?: (K_1 extends `on${infer C}` ? (...args: Emit[Uncapitalize<C>] extends (...args: infer P) => any ? P : Emit[Uncapitalize<C>] extends null ? any[] : never) => any : never) | undefined; } : {})) => any;

export declare type TransformModelValue<T extends {}> = "v-model:modelValue" extends keyof T ? Omit<T, "v-model:modelValue"> & {
    ["v-model"]?: T["v-model:modelValue"];
} : T;

export declare class VueComponent<Props extends {} = {}, Emit extends EmitsOptions = {}> {
    static defineProps: ComponentProps<any>;
    static defineEmits: DefineEmits<any>;
    constructor();
    readonly vueInstance: NonNullable<ReturnType<typeof getCurrentInstance>>;
    readonly context: WithSlotTypes<Emit, Props>;
    get props(): Props;
    render(): VNodeChild;
}

export declare type VueComponentClass<Props extends {} = {}, Emit extends EmitsOptions = {}> = {
    new (...args: any[]): VueComponent<Props>;
    defineProps: ComponentProps<Props>;
    defineEmits: DefineEmits<Emit>;
};

export declare type VueComponentProps<T extends {}> = DistributiveOmit<T, "slots"> & DistributiveVModel<T> & DistributiveVSlots<T> & VNodeProps & AllowedComponentProps & ComponentCustomProps;

export declare function Watcher(option?: {
    source?: WatcherTarget | WatcherTarget[];
    option?: WatchOptions;
}): (clazz: Class, methodName: string) => void;

declare type WatcherTarget = string | ((instance: VueComponent | object) => any);

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
