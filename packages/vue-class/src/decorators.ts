import { IoC } from "ioc";
import { type WatchOptions } from "vue";
import { IoCModuleName } from "./constants";
import { applyMetadata, getOrCreateMetadata } from "./metadata";
import type { Class, VueComponentClass } from "./types";
import { VueComponent } from "./vue-component";

export type WatcherTarget = string | ((instance: VueComponent | object) => any);

export type HookType =
  | "onMounted"
  | "onUpdated"
  | "onUnmounted"
  | "onBeforeMount"
  | "onBeforeUnmount"
  | "onErrorCaptured"
  | "onRenderTracked"
  | "onRenderTriggered"
  | "onActivated"
  | "onDeactivated"
  | "onServerPrefetch";

/* 适用于类 */
export function Component() {
  const fn = IoC.Injectable({ moduleName: IoCModuleName });
  return (clazz: VueComponentClass, _?: any) => {
    fn(clazz, _);
    getOrCreateMetadata(clazz);
  };
}

/* 适用于类 */
export function Service(option?: Parameters<typeof IoC.Injectable>[0]) {
  const fn = IoC.Injectable(
    Object.assign(
      {
        moduleName: IoCModuleName,
        onCreate: (instance: object) =>
          applyMetadata(instance.constructor, instance),
      },
      option,
    ),
  );
  return (clazz: Class, _?: any) => {
    fn(clazz, _);
    getOrCreateMetadata(clazz);
  };
}

/* 适用于属性 */
export function Mut(shallow?: boolean) {
  return (target: object, arg: any) => {
    const metadata = getOrCreateMetadata(target);
    metadata.mutts.push({ propName: getName(arg), shallow });
  };
}

/* 适用于属性 */
export function Readonly(shallow?: boolean) {
  return (target: object, arg: any) => {
    const metadata = getOrCreateMetadata(target);
    metadata.readonlys.push({ propName: getName(arg), shallow });
  };
}

/* 适用于属性 */
export function Link() {
  return (target: VueComponent, arg: any) => {
    getOrCreateMetadata(target).links.push(getName(arg));
  };
}

/*
 * 适用于方法和getter
 * 初始时会调用两次getter
 */
export function Computed() {
  return (target: any, arg: any) => {
    getOrCreateMetadata(target).computers.push(getName(arg));
  };
}

/* 适用于方法 */
export function Hook(type: HookType) {
  return (target: object, arg: any) => {
    getOrCreateMetadata(target).hooks.push({
      methodName: getName(arg),
      type,
    });
  };
}

/* 适用于方法 */
export function PropsWatcher(option?: WatchOptions) {
  return (target: object, arg: string) => {
    getOrCreateMetadata(target).propsWatchers.push({
      methodName: getName(arg),
      option,
    });
  };
}

/* 适用于方法 */
export function Watcher(option?: {
  source?: WatcherTarget | WatcherTarget[];
  option?: WatchOptions;
}) {
  return (target: object, arg: any) => {
    getOrCreateMetadata(target).watchers.push({
      methodName: getName(arg),
      ...option,
    });
  };
}

/* 适用于方法 */
export function BindThis() {
  return (target: object, arg: string) => {
    getOrCreateMetadata(target).bindThis.push(getName(arg));
  };
}

function getName(arg: string | { name: string }) {
  if (typeof arg === "string") return arg;
  return arg.name;
}
