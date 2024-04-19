import { ComponentProps } from 'vue-class';
import { default as default_2 } from 'eventemitter3';
import { DefineSetupFnComponent } from 'vue';
import { PublicProps } from 'vue';
import { RemovableRef } from '@vueuse/core';
import { ShallowRef } from 'vue';
import { StoreDefinition } from 'pinia';
import { StyleValue } from 'vue';
import { _UnwrapAll } from 'pinia';
import { VNodeChild } from 'vue';
import { VueComponent } from 'vue-class';
import { VueComponentBaseProps } from 'vue-class';

export declare const Desktop: DefineSetupFnComponent<DesktopProps, {}, {}, DesktopProps & {}, PublicProps>;

declare interface DesktopEvents {
    close: () => void;
}

declare class DesktopInst extends VueComponent<DesktopProps> {
    static readonly defineProps: ComponentProps<DesktopProps>;
    readonly styles: {
        [x: string]: StyleValue;
    };
    setup(): void;
    render(): VNodeChild;
}

declare interface DesktopProps extends VueComponentBaseProps {
}

export declare const MainArea: DefineSetupFnComponent<MainAreaProps, {}, {}, MainAreaProps & {}, PublicProps>;

declare class MainAreaInst extends VueComponent<MainAreaProps> {
    static readonly defineProps: ComponentProps<MainAreaProps>;
    setup(): void;
    render(): VNodeChild;
}

declare interface MainAreaProps extends VueComponentBaseProps {
}

export declare function rem(px: number): string;

declare type Styles<Keys extends string> = Record<string | Keys, StyleValue>;

export declare const Taskbar: DefineSetupFnComponent<TaskbarProps, {}, {}, TaskbarProps & {}, PublicProps>;

declare class TaskbarInst extends VueComponent<TaskbarProps> {
    static readonly defineProps: ComponentProps<TaskbarProps>;
    readonly styles: {
        [x: string]: StyleValue;
    };
    setup(): void;
    render(): VNodeChild;
}

declare interface TaskbarProps extends VueComponentBaseProps {
}

export declare const useDesktop: StoreDefinition<"desktop", _UnwrapAll<Pick<{
opened: RemovableRef<number[]>;
id: number;
eventBus: default_2<DesktopEvents, any>;
desktopInst: ShallowRef<DesktopInst>;
mainAreaInst: ShallowRef<MainAreaInst>;
taskbarInst: ShallowRef<TaskbarInst>;
}, "id" | "opened" | "eventBus" | "desktopInst" | "mainAreaInst" | "taskbarInst">>, Pick<{
opened: RemovableRef<number[]>;
id: number;
eventBus: default_2<DesktopEvents, any>;
desktopInst: ShallowRef<DesktopInst>;
mainAreaInst: ShallowRef<MainAreaInst>;
taskbarInst: ShallowRef<TaskbarInst>;
}, never>, Pick<{
opened: RemovableRef<number[]>;
id: number;
eventBus: default_2<DesktopEvents, any>;
desktopInst: ShallowRef<DesktopInst>;
mainAreaInst: ShallowRef<MainAreaInst>;
taskbarInst: ShallowRef<TaskbarInst>;
}, never>>;

export declare const useDesktopStyles: StoreDefinition<"desktop.styles", _UnwrapAll<Pick<{
desktopStyles: RemovableRef<Styles<"container" | "wrapper">>;
taskbarStyles: RemovableRef<Styles<"container">>;
}, "desktopStyles" | "taskbarStyles">>, Pick<{
desktopStyles: RemovableRef<Styles<"container" | "wrapper">>;
taskbarStyles: RemovableRef<Styles<"container">>;
}, never>, Pick<{
desktopStyles: RemovableRef<Styles<"container" | "wrapper">>;
taskbarStyles: RemovableRef<Styles<"container">>;
}, never>>;

export { }
