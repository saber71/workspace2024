import { IoC } from "ioc";
import {
  computed,
  effectScope,
  onActivated,
  onBeforeMount,
  onBeforeUnmount,
  onDeactivated,
  onErrorCaptured,
  onMounted,
  onRenderTracked,
  onRenderTriggered,
  onServerPrefetch,
  onUnmounted,
  onUpdated,
  ref,
  watch,
  watchEffect,
  type WatchOptions,
} from "vue";
import type { Class, VueComponentClass } from "./types";
import { VueComponent } from "./vue-component";

type WatcherTarget = string | ((instance: VueComponent | object) => any);

class Metadata {
  readonly mutts: string[] = [];

  readonly links: string[] = [];

  readonly hooks: { methodName: string; type: HookType }[] = [];

  readonly watchers: {
    methodName: string;
    source?: WatcherTarget | WatcherTarget[];
    option?: WatchOptions;
  }[] = [];

  readonly propsWatchers: { methodName: string; option?: WatchOptions }[] = [];

  readonly computers: string[] = [];

  handleWatchers(instance: object) {
    for (let metadata of this.watchers) {
      let fn = (instance as any)[metadata.methodName];
      if (typeof fn !== "function")
        throw new Error("Decorator Watcher can only be used on methods");
      fn = fn.bind(instance);
      if (!metadata.source) watchEffect(fn, metadata.option);
      else {
        if (!(metadata.source instanceof Array))
          metadata.source = [metadata.source];
        const source: any = metadata.source.map((item) => {
          if (typeof item === "string") return () => (instance as any)[item];
          else return () => item(instance);
        });
        watch(source, fn, metadata.option);
      }
    }
  }

  handlePropsWatchers(instance: VueComponent) {
    for (let data of this.propsWatchers) {
      let fn = (instance as any)[data.methodName];
      if (typeof fn !== "function")
        throw new Error("Decorator PropsWatcher can only be used on methods");
      fn = fn.bind(instance);
      watch(instance.props, fn, data.option);
    }
  }

  handleHook(instance: VueComponent) {
    for (let hookData of this.hooks) {
      let fn = (instance as any)[hookData.methodName];
      if (typeof fn !== "function")
        throw new Error("Decorator Hook can only be used for methods");
      fn = fn.bind(instance);
      switch (hookData.type) {
        case "onMounted":
          onMounted(fn);
          break;
        case "onUnmounted":
          onUnmounted(fn);
          break;
        case "onBeforeMount":
          onBeforeMount(fn);
          break;
        case "onBeforeUnmount":
          onBeforeUnmount(fn);
          break;
        case "onUpdated":
          onUpdated(fn);
          break;
        case "onActivated":
          onActivated(fn);
          break;
        case "onDeactivated":
          onDeactivated(fn);
          break;
        case "onErrorCaptured":
          onErrorCaptured(fn);
          break;
        case "onRenderTracked":
          onRenderTracked(fn);
          break;
        case "onRenderTriggered":
          onRenderTriggered(fn);
          break;
        case "onServerPrefetch":
          onServerPrefetch(fn);
          break;
        default:
          throw new Error("Unknown Hook Type " + hookData.type);
      }
    }
  }

  handleMut(instance: object) {
    for (let propName of this.mutts) {
      const ref$ = ref((instance as any)[propName]);
      Object.defineProperty(instance, propName, {
        configurable: true,
        enumerable: true,
        set(v: any) {
          ref$.value = v;
        },
        get(): any {
          return ref$.value;
        },
      });
    }
  }

  handleLink(instance: VueComponent) {
    for (let propName of this.links) {
      Object.defineProperty(instance, propName, {
        configurable: true,
        enumerable: true,
        get(): any {
          return instance.vueInstance.refs?.[propName];
        },
      });
    }
  }

  handleComputer(instance: object) {
    if (!this.computers.length) return;
    const prototypeOf = Object.getPrototypeOf(instance);
    for (let computerName of this.computers) {
      const target = (instance as any)[computerName];
      if (typeof target === "function") {
        const fn = target.bind(instance);
        const computer = computed(fn);
        (instance as any)[computerName] = () => computer.value;
      } else {
        const getter = Object.getOwnPropertyDescriptor(
          prototypeOf,
          computerName,
        )?.get;
        if (!getter)
          throw new Error(
            "Computer can only be used on getters or no parameter methods",
          );
        const computer = computed(() => getter.call(instance));
        Object.defineProperty(instance, computerName, {
          configurable: true,
          get: () => computer.value,
        });
      }
    }
  }
}

const metadataMap = new Map<any, Metadata>();

export function getMetadata(clazz: any) {
  const metadata = metadataMap.get(clazz);
  if (!metadata)
    throw new Error("Unable to find corresponding Metadata instance");
  return metadata;
}

export function applyMetadata(clazz: any, instance: VueComponent | object) {
  const metadata = getMetadata(clazz);
  metadata.handleMut(instance);
  metadata.handleComputer(instance);
  metadata.handleWatchers(instance);
  if (instance instanceof VueComponent) {
    metadata.handleLink(instance);
    metadata.handleHook(instance);
    metadata.handlePropsWatchers(instance);
  }
}

function getOrCreateMetadata(clazz: Class | object) {
  if (typeof clazz === "object") clazz = clazz.constructor as Class;
  let metadata = metadataMap.get(clazz);
  if (!metadata) metadataMap.set(clazz, (metadata = new Metadata()));
  return metadata;
}

export function Component() {
  const fn = IoC.Injectable({
    singleton: false,
    createOnLoad: false,
  });
  return (clazz: VueComponentClass) => {
    fn(clazz);
    getOrCreateMetadata(clazz);
  };
}

export function Service(option?: Parameters<typeof IoC.Injectable>[0]) {
  const fn = IoC.Injectable(
    Object.assign(
      {
        singleton: false,
        createOnLoad: false,
      },
      option,
    ),
  );
  return (clazz: Class) => {
    fn(clazz);
    getOrCreateMetadata(clazz);
  };
}

export function Mut() {
  return (target: object, propName: string) => {
    const metadata = getOrCreateMetadata(target);
    metadata.mutts.push(propName);
  };
}

export function Link() {
  return (target: VueComponent, propName: string) => {
    getOrCreateMetadata(target).links.push(propName);
  };
}

export function Computed() {
  return (target: any, name: string) => {
    getOrCreateMetadata(target).computers.push(name);
  };
}

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

export function Hook(type: HookType) {
  return (clazz: VueComponentClass, methodName: string) => {
    getOrCreateMetadata(clazz).hooks.push({ methodName, type });
  };
}

export function PropsWatcher(option?: WatchOptions) {
  return (clazz: VueComponentClass, methodName: string) => {
    getOrCreateMetadata(clazz).propsWatchers.push({ methodName, option });
  };
}

export function Watcher(option?: {
  source?: WatcherTarget | WatcherTarget[];
  option?: WatchOptions;
}) {
  return (clazz: Class, methodName: string) => {
    getOrCreateMetadata(clazz).watchers.push({
      methodName,
      ...option,
    });
  };
}

class A extends VueComponent {
  @Mut()
  a: string = "";
}
