import { LoadableContainer, Injectable } from 'dependency-injection';
export * from 'dependency-injection';
import { getCurrentInstance, defineComponent, inject, provide, watchEffect, watch, onServerPrefetch, onRenderTriggered, onRenderTracked, onErrorCaptured, onDeactivated, onActivated, onUpdated, onBeforeUnmount, onBeforeMount, onUnmounted, onMounted, shallowRef, ref, shallowReadonly, readonly, computed } from 'vue';
import { onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router';

const ModuleName = "vue-class";

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
            else if (matchTo && matchFrom) return matchFrom.test(from.path) && matchTo.test(to.path);
            else return matchTo?.test(to.path) || matchFrom?.test(from.path);
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

class VueClass {
    static dependencyInjection = new LoadableContainer();
    static getInstance(clazz) {
        return this.dependencyInjection.getValue(clazz, ModuleName);
    }
    static async install(app, router) {
        this.dependencyInjection.load({
            moduleName: ModuleName
        });
        VueDirective.install(app);
        VueRouterGuard.install(router);
    }
}

class VueComponent {
    static __test__ = false;
    static defineProps = [
        "inst"
    ];
    constructor(){
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
    render() {}
    setup() {}
}
function toNative(componentClass) {
    return defineComponent(()=>{
        const instance = VueClass.getInstance(componentClass);
        applyMetadata(componentClass, instance);
        instance.setup();
        return instance.render.bind(instance);
    }, {
        name: componentClass.name,
        props: componentClass.defineProps
    });
}

const childInstMapKey = Symbol("childInstMap");
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
    readonlys = [];
    links = [];
    vueInject = [];
    bindThis = [];
    hooks = [];
    watchers = [];
    propsWatchers = [];
    computers = [];
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
        for (let data of this.mutts){
            const value = instance[data.propName];
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
    if (instance[appliedSymbol]) return;
    instance[appliedSymbol] = true;
    const metadata = getMetadata(clazz);
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
}
function getOrCreateMetadata(clazz, ctx) {
    if (!ctx || typeof ctx === "string") {
        if (typeof clazz === "object") clazz = clazz.constructor;
        let metadata = metadataMap.get(clazz);
        if (!metadata) metadataMap.set(clazz, metadata = new Metadata());
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

export { BindThis, Component, Computed, Directive, Hook, Link, ModuleName, Mut, PropsWatcher, Readonly, RouterGuard, Service, VueClass, VueComponent, VueDirective, VueInject, VueRouterGuard, Watcher, toNative };
