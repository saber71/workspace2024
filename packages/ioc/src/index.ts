import "reflect-metadata";
import { Container, inject, injectable } from "inversify";

type Class<T = any> = { new (...args: any[]): T };

export namespace IoC {
  export interface InjectableOption {
    createOnLoad: boolean;
    moduleName?: string;
    prototypeNames: string[];
    singleton: boolean;
    targetClass: Class;
    onCreate?: (instance: any) => void;
  }

  const classNameMapInjectableOption = new Map<string, InjectableOption>();
  const moduleNameMapContainer = new Map<string, Container>();

  export function getContainer(moduleName: string = ""): Container {
    let container = moduleNameMapContainer.get(moduleName);
    if (!container)
      moduleNameMapContainer.set(
        moduleName,
        (container = new Container({ skipBaseClassChecks: true })),
      );
    return container;
  }

  function getInjectableOptionOrCreate(clazz: Class): InjectableOption {
    let result = classNameMapInjectableOption.get(clazz.name);
    if (!result) {
      const prototypeNames: string[] = [];
      let p: any = clazz;
      while (p?.name) {
        prototypeNames.push(p.name);
        p = Object.getPrototypeOf(p);
      }
      classNameMapInjectableOption.set(
        clazz.name,
        (result = {
          singleton: false,
          createOnLoad: false,
          targetClass: clazz,
          prototypeNames,
        }),
      );
    }
    return result;
  }

  export function Injectable(option?: Partial<InjectableOption>) {
    const fn = injectable();
    return (clazz: Class, _: any) => {
      fn(clazz);
      Object.assign(getInjectableOptionOrCreate(clazz), option);
    };
  }

  export function Inject<Label extends string = string>(label: Label) {
    return inject(label);
  }

  export const Initializer = Symbol("initializer");
  const Initialized = Symbol("initialized");

  export function load(moduleName: string = "") {
    const container = getContainer(moduleName);
    const map = new Map(classNameMapInjectableOption);
    for (let [name, option] of classNameMapInjectableOption.entries()) {
      if (option.moduleName && moduleName !== option.moduleName)
        map.delete(name);
      else option.prototypeNames.slice(1).forEach((name) => map.delete(name));
    }
    const needCreates: InjectableOption[] = [];
    for (let option of map.values()) {
      if (option.createOnLoad) needCreates.push(option);
      for (let i = 0; i < option.prototypeNames.length; i++) {
        const name = option.prototypeNames[i];
        let result;
        if (option.singleton) {
          if (i === 0)
            result = container
              .bind(name)
              .to(option.targetClass)
              .inSingletonScope();
          else
            result = container
              .bind(name)
              .toDynamicValue(() => container.get(option.targetClass.name));
        } else result = container.bind(name).to(option.targetClass);
        result.onActivation((_, instance) => {
          if (!(instance as any)[Initialized]) {
            (instance as any)[Initialized] = true;
            (instance as any)[Initializer]?.();
          }
          option.onCreate?.(instance);
          return instance;
        });
      }
    }
    for (let option of needCreates) {
      container.get(option.targetClass.name);
    }
  }

  export function unload(moduleName: string = "") {
    const container = moduleNameMapContainer.get(moduleName);
    if (container) {
      container.unbindAll();
      moduleNameMapContainer.delete(moduleName);
    }
  }

  export function getInstance<T>(clazz: Class<T>, moduleName?: string): T {
    const result = getContainer(moduleName).get<T>(clazz.name);
    if (!result)
      throw new Error(`Unable to find instance of class ${clazz.name}`);
    return result;
  }

  export async function importAll(
    importMethod: () => Record<
      string,
      (() => Promise<any> | any) | Promise<any> | any
    >,
  ) {
    const result = importMethod();
    const promises: Promise<any>[] = [];
    for (let relativePath in result) {
      const item = result[relativePath];
      if (typeof item === "function") {
        const res = item();
        if (res instanceof Promise) promises.push(res);
      } else if (item instanceof Promise) {
        promises.push(item);
      }
    }
    await Promise.all(promises);
  }
}
