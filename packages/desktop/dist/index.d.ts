import { ComponentProps } from 'vue-class';
import { ComputedRef } from 'vue';
import { default as default_2 } from 'eventemitter3';
import { DefineSetupFnComponent } from 'vue';
import { PublicProps } from 'vue';
import { Ref } from 'vue';
import { RemovableRef } from '@vueuse/core';
import { ShallowRef } from 'vue';
import { StoreDefinition } from 'pinia';
import { Styles } from 'styles';
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
    wrapperEl: HTMLElement;
    readonly styles: Styles<"container" | "wrapper">;
    setup(): void;
    render(): VNodeChild;
}

declare interface DesktopProps extends VueComponentBaseProps {
}

export declare const MainArea: DefineSetupFnComponent<MainAreaProps, {}, {}, MainAreaProps & {}, PublicProps>;

declare class MainAreaInst extends VueComponent<MainAreaProps> {
    static readonly defineProps: ComponentProps<MainAreaProps>;
    readonly styles: Styles<"container">;
    setup(): void;
    render(): VNodeChild;
}

declare interface MainAreaProps extends VueComponentBaseProps {
}

export declare function rem(px: number): string;

export declare const Taskbar: DefineSetupFnComponent<TaskbarProps, {}, {}, TaskbarProps & {}, PublicProps>;

declare class TaskbarInst extends VueComponent<TaskbarProps> {
    static readonly defineProps: ComponentProps<TaskbarProps>;
    el: HTMLElement;
    readonly styles: Styles<"taskbar">;
    setup(): void;
    onUnmounted(): void;
    render(): VNodeChild;
}

declare interface TaskbarProps extends VueComponentBaseProps {
}

export declare const useBehavior: StoreDefinition<"desktop.behavior", _UnwrapAll<Pick<{
curBehavior: Ref<BehaviorType>;
wrapEventTarget: (eventTarget: EventTarget) => Behavior;
}, "curBehavior">>, Pick<{
curBehavior: Ref<BehaviorType>;
wrapEventTarget: (eventTarget: EventTarget) => Behavior;
}, never>, Pick<{
curBehavior: Ref<BehaviorType>;
wrapEventTarget: (eventTarget: EventTarget) => Behavior;
}, "wrapEventTarget">>;

export declare const useDesktop: StoreDefinition<"desktop", _UnwrapAll<Pick<{
opened: RemovableRef<number[]>;
id: number;
scale: Ref<number>;
eventBus: default_2<DesktopEvents, any>;
desktopInst: ShallowRef<DesktopInst>;
mainAreaInst: ShallowRef<MainAreaInst>;
taskbarInst: ShallowRef<TaskbarInst>;
timestamp: ShallowRef<Date>;
cursor: Ref<string>;
resetCursor: () => void;
}, "id" | "cursor" | "scale" | "opened" | "eventBus" | "desktopInst" | "mainAreaInst" | "taskbarInst" | "timestamp">>, Pick<{
opened: RemovableRef<number[]>;
id: number;
scale: Ref<number>;
eventBus: default_2<DesktopEvents, any>;
desktopInst: ShallowRef<DesktopInst>;
mainAreaInst: ShallowRef<MainAreaInst>;
taskbarInst: ShallowRef<TaskbarInst>;
timestamp: ShallowRef<Date>;
cursor: Ref<string>;
resetCursor: () => void;
}, never>, Pick<{
opened: RemovableRef<number[]>;
id: number;
scale: Ref<number>;
eventBus: default_2<DesktopEvents, any>;
desktopInst: ShallowRef<DesktopInst>;
mainAreaInst: ShallowRef<MainAreaInst>;
taskbarInst: ShallowRef<TaskbarInst>;
timestamp: ShallowRef<Date>;
cursor: Ref<string>;
resetCursor: () => void;
}, "resetCursor">>;

export declare const useTaskbarSetting: StoreDefinition<"desktop.taskbar.setting", _UnwrapAll<Pick<{
value: Ref<    {
lock: boolean;
deputySize: string | number;
autoHide: {
enabled: boolean;
forceShow: boolean;
};
small: boolean;
position: "bottom" | "left" | "right" | "top";
}>;
deputySizeValue: ComputedRef<string | number>;
isHorizon: ComputedRef<boolean>;
principalSizeProp: ComputedRef<"height" | "width">;
deputySizeProp: ComputedRef<"height" | "width">;
deputyMinSizeProp: ComputedRef<"minWidth" | "minHeight">;
promptLinePositions: Ref<string[]>;
}, "value" | "promptLinePositions">>, Pick<{
value: Ref<    {
lock: boolean;
deputySize: string | number;
autoHide: {
enabled: boolean;
forceShow: boolean;
};
small: boolean;
position: "bottom" | "left" | "right" | "top";
}>;
deputySizeValue: ComputedRef<string | number>;
isHorizon: ComputedRef<boolean>;
principalSizeProp: ComputedRef<"height" | "width">;
deputySizeProp: ComputedRef<"height" | "width">;
deputyMinSizeProp: ComputedRef<"minWidth" | "minHeight">;
promptLinePositions: Ref<string[]>;
}, "deputySizeValue" | "isHorizon" | "principalSizeProp" | "deputySizeProp" | "deputyMinSizeProp">, Pick<{
value: Ref<    {
lock: boolean;
deputySize: string | number;
autoHide: {
enabled: boolean;
forceShow: boolean;
};
small: boolean;
position: "bottom" | "left" | "right" | "top";
}>;
deputySizeValue: ComputedRef<string | number>;
isHorizon: ComputedRef<boolean>;
principalSizeProp: ComputedRef<"height" | "width">;
deputySizeProp: ComputedRef<"height" | "width">;
deputyMinSizeProp: ComputedRef<"minWidth" | "minHeight">;
promptLinePositions: Ref<string[]>;
}, never>>;

export { }
