import { LoadableContainer, Injectable } from 'dependency-injection';
export * from 'dependency-injection';
import { provide, inject, getCurrentInstance, defineComponent, onMounted, onBeforeUnmount, onUnmounted, watchEffect, watch, onServerPrefetch, onRenderTriggered, onRenderTracked, onErrorCaptured, onDeactivated, onActivated, onUpdated, onBeforeMount, shallowRef, ref, shallowReadonly, readonly, computed } from 'vue';
import { onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router';

const ModuleName = "vue-class";
const ROUTER = "router";

function isTypedArray(arr) {
    return arr instanceof Uint8Array || arr instanceof Uint8ClampedArray || arr instanceof Uint16Array || arr instanceof Uint32Array || arr instanceof Int8Array || arr instanceof Int16Array || arr instanceof Int32Array || arr instanceof Float32Array || arr instanceof Float64Array;
}
function deepClone(obj, options = {}) {
    if (typeof obj !== "object" || obj === undefined || obj === null) return obj;
    if (obj instanceof RegExp) return obj;
    if (obj instanceof Set) {
        const result = new Set();
        obj.forEach((value)=>result.add(deepClone(value)));
        return result;
    } else if (obj instanceof Date) {
        return new Date(obj);
    } else if (obj instanceof Map) {
        const result = new Map();
        obj.forEach((value, key)=>{
            if (options.cloneMapKey) key = deepClone(key, options);
            result.set(key, deepClone(value));
        });
        return result;
    } else if (isTypedArray(obj)) {
        //@ts-ignore
        return new obj.constructor(obj);
    } else {
        //@ts-ignore
        const result = new (obj.constructor || Object)();
        Object.assign(result, obj);
        for(let objKey in obj){
            const value = obj[objKey];
            result[objKey] = deepClone(value, options);
        }
        return result;
    }
}

class VueDirective {
    el;
    name;
    static _elMapVueDirective = new Map();
    static _directiveNameMapVueDirective = new Map();
    static install(app) {
        const directives = getAllMetadata().filter((item)=>item[1].isDirective).map((item)=>[
                item[1].directiveName,
                item
            ]);
        VueDirective._directiveNameMapVueDirective = new Map(directives);
        for (let directive of directives){
            const directiveName = directive[1][1].directiveName;
            const clazz = directive[1][0];
            app.directive(directiveName, {
                created (el, binding) {
                    VueDirective.getInstance(el, directiveName, clazz).created(binding);
                },
                mounted (el, binding) {
                    const directive = VueDirective.getInstance(el, directiveName, clazz);
                    directive.mounted(binding);
                    directive.mountedAndUpdated(binding);
                },
                updated (el, binding) {
                    const directive = VueDirective.getInstance(el, directiveName, clazz);
                    directive.updated(binding);
                    directive.mountedAndUpdated(binding);
                },
                beforeUnmount (el, binding) {
                    VueDirective.getInstance(el, directiveName, clazz).beforeUnmount(binding);
                },
                beforeUpdate (el, binding) {
                    VueDirective.getInstance(el, directiveName, clazz).beforeUpdate(binding);
                },
                beforeMount (el, binding) {
                    VueDirective.getInstance(el, directiveName, clazz).beforeMount(binding);
                },
                unmounted (el, binding) {
                    VueDirective.getInstance(el, directiveName, clazz).unmounted(binding);
                }
            });
        }
    }
    static getInstance(el, directiveName, clazz) {
        if (!clazz) {
            clazz = this._directiveNameMapVueDirective.get(directiveName);
            if (!clazz) throw new Error("Unable to find the VueDirective class corresponding to the directive name");
        }
        let map = this._elMapVueDirective.get(el);
        if (!map) this._elMapVueDirective.set(el, map = new Map());
        let instance = map.get(directiveName);
        if (!instance) map.set(directiveName, instance = new clazz(el, directiveName));
        return instance;
    }
    constructor(el, name){
        this.el = el;
        this.name = name;
    }
    mountedAndUpdated(binding) {}
    created(binding) {}
    beforeMount(binding) {}
    mounted(binding) {}
    beforeUpdate(binding) {}
    updated(binding) {}
    beforeUnmount(binding) {}
    unmounted(binding) {
        const map = VueDirective._elMapVueDirective.get(this.el);
        if (map) {
            map.delete(this.name);
            if (!map.size) VueDirective._elMapVueDirective.delete(this.el);
        }
    }
}

class VueRouterGuard {
    static install(router) {
        const guards = getAllMetadata().filter((item)=>item[1].isRouterGuard);
        for (let guard of guards){
            const guardInstance = VueClass.getInstance(guard[0]);
            const metadata = guard[1];
            const beforeEach = guardInstance.beforeEach.bind(guardInstance);
            const afterEach = guardInstance.afterEach.bind(guardInstance);
            const beforeResolve = guardInstance.beforeResolve.bind(guardInstance);
            const onError = guardInstance.onError.bind(guardInstance);
            router.onError((error, to, from)=>{
                if (match(to, from, metadata.routerGuardMatchTo, metadata.routerGuardMatchFrom)) onError(error, to, from);
            });
            router.beforeEach(async (to, from, next)=>{
                if (match(to, from, metadata.routerGuardMatchTo, metadata.routerGuardMatchFrom)) await beforeEach(to, from, next);
                else next();
            });
            router.afterEach(async (to, from)=>{
                if (match(to, from, metadata.routerGuardMatchTo, metadata.routerGuardMatchFrom)) await afterEach(to, from);
            });
            router.beforeResolve(async (to, from, next)=>{
                if (match(to, from, metadata.routerGuardMatchTo, metadata.routerGuardMatchFrom)) await beforeResolve(to, from, next);
                else next();
            });
        }
        function match(to, from, matchTo, matchFrom) {
            if (!matchFrom && !matchTo) return true;
            else if (matchTo && matchFrom) return match(matchFrom, from) && match(matchTo, to);
            else return match(matchTo, to) || match(matchFrom, from);
            function match(item, path) {
                if (!item) return false;
                if (item instanceof RegExp) return item.test(path.path);
                return item(path);
            }
        }
    }
    beforeEach(to, from, next) {
        next();
    }
    beforeResolve(to, from, next) {
        next();
    }
    afterEach(to, from) {}
    onError(error, to, from) {}
}

const customContainerLabel = Symbol("__vue_class__:custom-container");
class VueClass {
    static dependencyInjection = new LoadableContainer();
    static getInstance(clazz) {
        return this.getContainer().getValue(clazz);
    }
    static setCustomContainer(container) {
        provide(customContainerLabel, container);
    }
    static getContainer() {
        return inject(customContainerLabel) || this.dependencyInjection;
    }
    static async install(app, router) {
        this.dependencyInjection.load({
            moduleName: ModuleName
        });
        this.dependencyInjection.bindValue(ROUTER, router);
        VueDirective.install(app);
        VueRouterGuard.install(router);
    }
}

class VueService {
    setup() {}
    reset() {
        const initMut = this[initMutKey];
        if (initMut) {
            for(let key in initMut){
                this[key] = initMut[key];
            }
        }
    }
}

class VueComponent extends VueService {
    static __test__ = false;
    static defineProps = [
        "inst"
    ];
    constructor(){
        super();
        let curInstance = getCurrentInstance();
        if (!curInstance) {
            if (VueComponent.__test__) curInstance = {
                appContext: {}
            };
            else throw new Error("Cannot directly create VueComponent instance");
        }
        this.vueInstance = curInstance;
        this.context = curInstance.appContext;
    }
    vueInstance;
    context;
    childInstMap = {};
    get props() {
        return this.vueInstance.props;
    }
    get router() {
        return VueClass.getContainer().getValue(ROUTER);
    }
    get route() {
        return this.router.currentRoute.value;
    }
    render() {}
    onMounted() {}
    onBeforeUnmounted() {}
    onUnmounted() {}
}
function toNative(componentClass, genInstance) {
    return defineComponent(()=>{
        const instance = genInstance ? genInstance() : VueClass.getInstance(componentClass);
        const metadata = applyMetadata(componentClass, instance);
        onMounted(instance.onMounted.bind(instance));
        onBeforeUnmount(instance.onBeforeUnmounted.bind(instance));
        onBeforeUnmount(()=>{
            for (let { propName, methodName } of metadata.disposables){
                instance[propName]?.[methodName ?? "dispose"]?.();
            }
        });
        onUnmounted(instance.onUnmounted.bind(instance));
        return instance.render.bind(instance);
    }, {
        name: componentClass.name,
        props: componentClass.defineProps
    });
}

const childInstMapKey = Symbol("childInstMap");
const initMutKey = Symbol("init-mut");
class Metadata {
    isComponent = false;
    componentOption;
    isService = false;
    isDirective = false;
    isRouterGuard = false;
    directiveName = "";
    routerGuardMatchTo;
    routerGuardMatchFrom;
    mutts = [];
    disposables = [];
    readonlys = [];
    links = [];
    vueInject = [];
    bindThis = [];
    hooks = [];
    watchers = [];
    propsWatchers = [];
    computers = [];
    clone() {
        return deepClone(this);
    }
    handleComponentOption(instance) {
        if (instance.props.inst) {
            const instMap = inject(childInstMapKey);
            if (instMap) instMap[instance.props.inst] = instance;
        }
        provide(childInstMapKey, instance.childInstMap);
        if (this.componentOption) {
            const { provideThis } = this.componentOption;
            if (provideThis) {
                const key = typeof provideThis === "boolean" ? instance.constructor.name : provideThis;
                provide(key, instance);
            }
        }
    }
    handleBindThis(instance) {
        for (let methodName of this.bindThis){
            const method = instance[methodName];
            instance[methodName] = method.bind(instance);
        }
    }
    handleWatchers(instance) {
        for (let metadata of this.watchers){
            let fn = instance[metadata.methodName];
            if (typeof fn !== "function") throw new Error("Decorator Watcher can only be used on methods");
            fn = fn.bind(instance);
            if (!metadata.source) watchEffect(fn, metadata.option);
            else {
                if (!(metadata.source instanceof Array)) metadata.source = [
                    metadata.source
                ];
                const source = metadata.source.map((item)=>{
                    if (typeof item === "string") {
                        const $ = instance[Symbol.for(item)];
                        return $ ?? (()=>instance[item]);
                    } else return ()=>item(instance);
                });
                watch(source, fn, metadata.option);
            }
        }
    }
    handlePropsWatchers(instance) {
        for (let data of this.propsWatchers){
            let fn = instance[data.methodName];
            if (typeof fn !== "function") throw new Error("Decorator PropsWatcher can only be used on methods");
            fn = fn.bind(instance);
            watch(instance.props, fn, data.option);
        }
    }
    handleHook(instance) {
        for (let hookData of this.hooks){
            let fn = instance[hookData.methodName];
            if (typeof fn !== "function") throw new Error("Decorator Hook can only be used for methods");
            fn = fn.bind(instance);
            switch(hookData.type){
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
                case "onBeforeRouteLeave":
                    onBeforeRouteLeave(fn);
                    break;
                case "onBeforeRouteUpdate":
                    onBeforeRouteUpdate(fn);
                    break;
                default:
                    throw new Error("Unknown Hook Type " + hookData.type);
            }
        }
    }
    handleVueInject(instance) {
        for (let item of this.vueInject){
            const val = inject(item.provideKey);
            Object.defineProperty(instance, item.propName, {
                configurable: true,
                enumerable: true,
                get: ()=>val
            });
        }
    }
    handleMut(instance) {
        let initMut = instance[initMutKey];
        if (!initMut) initMut = instance[initMutKey] = {};
        for (let data of this.mutts){
            const value = instance[data.propName];
            initMut[data.propName] = deepClone(value);
            const ref$ = data.shallow ? shallowRef(value) : ref(value);
            instance[Symbol.for(data.propName)] = ref$;
            Object.defineProperty(instance, data.propName, {
                configurable: true,
                enumerable: true,
                set (v) {
                    ref$.value = v;
                },
                get () {
                    return ref$.value;
                }
            });
        }
    }
    handleReadonly(instance) {
        for (let data of this.readonlys){
            const value = instance[data.propName];
            const $ = data.shallow ? shallowReadonly(value) : readonly(value);
            instance[Symbol.for(data.propName)] = $;
            Object.defineProperty(instance, data.propName, {
                configurable: true,
                enumerable: true,
                get () {
                    return $;
                }
            });
        }
    }
    handleLink(instance) {
        for (let data of this.links){
            let refName = data.propName;
            let directiveName = "";
            if (data.refName) {
                refName = data.refName;
            } else if (data.isDirective) {
                refName = refName.replace(/Directive$/, "");
            }
            if (data.isDirective) {
                directiveName = data.directiveName ?? "";
                if (!directiveName) directiveName = refName;
            }
            Object.defineProperty(instance, data.propName, {
                configurable: true,
                enumerable: true,
                get () {
                    const el = instance.childInstMap[refName] ?? instance.vueInstance.refs?.[refName];
                    if (data.isDirective) {
                        if (!el) throw new Error("There is no ref named " + refName);
                        return VueDirective.getInstance(el, directiveName);
                    }
                    return el;
                }
            });
        }
    }
    handleComputer(instance) {
        if (!this.computers.length) return;
        const prototypeOf = Object.getPrototypeOf(instance);
        for (let computerName of this.computers){
            const target = instance[computerName];
            if (typeof target === "function") {
                const fn = target.bind(instance);
                const computer = computed(fn);
                instance[Symbol.for(computerName)] = computer;
                instance[computerName] = ()=>computer.value;
            } else {
                const getter = Object.getOwnPropertyDescriptor(prototypeOf, computerName)?.get;
                if (!getter) throw new Error("Computer can only be used on getters or no parameter methods");
                const computer = computed(()=>getter.call(instance));
                instance[Symbol.for(computerName)] = computer;
                Object.defineProperty(instance, computerName, {
                    configurable: true,
                    get: ()=>computer.value
                });
            }
        }
    }
}
const metadataMap = new Map();
function getAllMetadata() {
    return Array.from(metadataMap.entries());
}
function getMetadata(clazz) {
    const metadata = metadataMap.get(clazz);
    if (!metadata) throw new Error("Unable to find corresponding Metadata instance");
    return metadata;
}
const appliedSymbol = Symbol("__appliedMetadata__");
function applyMetadata(clazz, instance) {
    const metadata = getMetadata(clazz);
    if (instance[appliedSymbol]) return metadata;
    instance[appliedSymbol] = true;
    metadata.handleMut(instance);
    metadata.handleReadonly(instance);
    metadata.handleVueInject(instance);
    metadata.handleComputer(instance);
    metadata.handleWatchers(instance);
    metadata.handleBindThis(instance);
    if (instance instanceof VueComponent) {
        metadata.handleLink(instance);
        metadata.handleHook(instance);
        metadata.handlePropsWatchers(instance);
        metadata.handleComponentOption(instance);
    }
    if (instance instanceof VueService) {
        instance.setup();
    }
    return metadata;
}
function getOrCreateMetadata(clazz, ctx) {
    if (!ctx || typeof ctx === "string") {
        if (typeof clazz === "object") clazz = clazz.constructor;
        let metadata = metadataMap.get(clazz);
        if (!metadata) {
            const parentClass = Object.getPrototypeOf(clazz);
            const parentMetadata = metadataMap.get(parentClass);
            if (parentMetadata) metadataMap.set(clazz, metadata = parentMetadata.clone());
            else metadataMap.set(clazz, metadata = new Metadata());
        }
        return metadata;
    } else {
        let metadata = ctx.metadata.metadata;
        if (!metadata) metadata = ctx.metadata.metadata = new Metadata();
        if (ctx.kind === "class") metadataMap.set(clazz, metadata);
        return metadata;
    }
}

/* 适用于类 */ function Component(option) {
    const fn = Injectable({
        moduleName: ModuleName
    });
    return (clazz, ctx)=>{
        fn(clazz, ctx);
        const metadata = getOrCreateMetadata(clazz, ctx);
        metadata.isComponent = true;
        metadata.componentOption = option;
    };
}
/* 适用于类 */ function Service(option) {
    const fn = Injectable(Object.assign({
        moduleName: ModuleName,
        singleton: true,
        onCreate: (instance)=>applyMetadata(instance.constructor, instance)
    }, option));
    return (clazz, ctx)=>{
        fn(clazz, ctx);
        getOrCreateMetadata(clazz, ctx).isService = true;
    };
}
/* 适用于类 */ function RouterGuard(option) {
    const fn = Injectable(Object.assign({
        moduleName: ModuleName,
        singleton: true,
        onCreate: (instance)=>applyMetadata(instance.constructor, instance)
    }, option));
    return (clazz, ctx)=>{
        fn(clazz, ctx);
        const metadata = getOrCreateMetadata(clazz, ctx);
        metadata.isRouterGuard = true;
        metadata.routerGuardMatchTo = option?.matchTo;
        metadata.routerGuardMatchFrom = option?.matchFrom;
    };
}
/* 适用于类 */ function Directive(name) {
    const fn = Injectable({
        moduleName: ModuleName
    });
    return (clazz, ctx)=>{
        fn(clazz, ctx);
        const metadata = getOrCreateMetadata(clazz, ctx);
        metadata.isDirective = true;
        if (!name) {
            name = clazz.name.replace(/Directive$/, "");
            name = name[0].toLowerCase() + name.slice(1);
        }
        metadata.directiveName = name;
    };
}
/* 适用于属性 */ function Disposable(methodName) {
    return (target, arg)=>{
        const metadata = getOrCreateMetadata(target, arg);
        metadata.disposables.push({
            propName: getName(arg),
            methodName
        });
    };
}
/* 适用于属性 */ function Mut(shallow) {
    return (target, arg)=>{
        const metadata = getOrCreateMetadata(target, arg);
        metadata.mutts.push({
            propName: getName(arg),
            shallow
        });
    };
}
/* 适用于属性 */ function Readonly(shallow) {
    return (target, arg)=>{
        const metadata = getOrCreateMetadata(target, arg);
        metadata.readonlys.push({
            propName: getName(arg),
            shallow
        });
    };
}
/* 适用于属性 */ function Link(option) {
    return (target, arg)=>{
        getOrCreateMetadata(target, arg).links.push({
            propName: getName(arg),
            refName: option?.refName,
            isDirective: !!(option?.isDirective || option?.directiveName),
            directiveName: option?.directiveName
        });
    };
}
/* 适用于属性 */ function VueInject(key) {
    return (target, arg)=>{
        if (!key) key = Reflect.getMetadata("design:type", target, arg)?.name;
        getOrCreateMetadata(target, arg).vueInject.push({
            propName: getName(arg),
            provideKey: key
        });
    };
}
/*
 * 适用于方法和getter
 * 初始时会调用两次getter
 */ function Computed() {
    return (target, arg)=>{
        getOrCreateMetadata(target, arg).computers.push(getName(arg));
    };
}
/* 适用于方法 */ function Hook(type) {
    return (target, arg)=>{
        getOrCreateMetadata(target, arg).hooks.push({
            methodName: getName(arg),
            type
        });
    };
}
/* 适用于方法 */ function PropsWatcher(option) {
    return (target, arg)=>{
        getOrCreateMetadata(target, arg).propsWatchers.push({
            methodName: getName(arg),
            option
        });
    };
}
/* 适用于方法 */ function Watcher(option) {
    return (target, arg)=>{
        getOrCreateMetadata(target, arg).watchers.push({
            methodName: getName(arg),
            ...option
        });
    };
}
/* 适用于方法 */ function BindThis() {
    return (target, arg)=>{
        getOrCreateMetadata(target, arg).bindThis.push(getName(arg));
    };
}
function getName(arg) {
    if (typeof arg === "string") return arg;
    return arg.name;
}

export { BindThis, Component, Computed, Directive, Disposable, Hook, Link, ModuleName, Mut, PropsWatcher, ROUTER, Readonly, RouterGuard, Service, VueClass, VueComponent, VueDirective, VueInject, VueRouterGuard, VueService, Watcher, toNative };
