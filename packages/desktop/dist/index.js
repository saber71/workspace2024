import { ref, shallowRef, watch, computed, watchEffect, createVNode, createTextVNode } from 'vue';
import { Styles, dynamic } from 'styles';
import { Component, toNative, VueComponent, Link } from 'vue-class';
import { useLocalStorage } from '@vueuse/core';
import { remove } from 'common';
import EventEmitter from 'eventemitter3';
import { defineStore } from 'pinia';
import { WindowsFilled } from '@ant-design/icons-vue';

const TASKBAR_INIT_HEIGHT = 40;
const TASKBAR_INIT_WIDTH = 70;
const BASE_FONT_SIZE = 16;

const useDesktop = defineStore("desktop", ()=>{
    const initCursor = document.documentElement.style.cursor;
    const cursor = ref(initCursor);
    const opened = useLocalStorage("desktop.opened", []);
    const desktopInst = shallowRef(0);
    const mainAreaInst = shallowRef(0);
    const taskbarInst = shallowRef(0);
    const id = opened.value.reduce((previousValue, currentValue)=>Math.max(previousValue, currentValue), -1) + 1;
    const scale = useLocalStorage("desktop.scale", 1);
    const timestamp = shallowRef(new Date());
    const formatTime = ref("");
    const formatDate = ref("");
    let raqHandler = requestAnimationFrame(updateTimestamp);
    const eventBus = new EventEmitter().on("close", ()=>{
        remove(opened.value, id);
        document.documentElement.style.fontSize = oldFontSize;
        cancelAnimationFrame(raqHandler);
    });
    opened.value.push(id);
    let oldFontSize = document.documentElement.style.fontSize;
    watch(scale, ()=>{
        document.documentElement.style.fontSize = scale.value * BASE_FONT_SIZE + "px";
    }, {
        immediate: true
    });
    watch(cursor, ()=>{
        document.documentElement.style.cursor = cursor.value;
    });
    return {
        opened,
        id,
        eventBus,
        desktopInst,
        mainAreaInst,
        taskbarInst,
        timestamp,
        formatDate,
        formatTime,
        cursor,
        resetCursor
    };
    function resetCursor() {
        cursor.value = initCursor;
    }
    function updateTimestamp() {
        timestamp.value = new Date();
        updateTime();
        updateDate();
        raqHandler = requestAnimationFrame(updateTimestamp);
    }
    function updateTime() {
        const date = timestamp.value;
        formatTime.value = `${formatNumber(date.getHours())}:${formatNumber(date.getMinutes())}`;
    }
    function updateDate() {
        const date = timestamp.value;
        formatDate.value = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    }
    function formatNumber(num) {
        return num <= 9 ? "0" + num : num;
    }
});
function rem(px) {
    return px / BASE_FONT_SIZE + "rem";
}

const useTaskbarSetting = defineStore("desktop.taskbar.setting", ()=>{
    const value = ref({
        deputySize: "",
        autoHide: {
            enabled: true,
            forceShow: false
        },
        position: "bottom",
        small: false,
        lock: false
    });
    const deputySizeValue = computed(()=>value.value.deputySize || rem(TASKBAR_INIT_HEIGHT));
    const isHorizon = computed(()=>value.value.position === "left" || value.value.position === "right");
    const principalSizeProp = computed(()=>isHorizon.value ? "height" : "width");
    const deputySizeProp = computed(()=>isHorizon.value ? "width" : "height");
    const deputyMinSizeProp = computed(()=>isHorizon.value ? "minWidth" : "minHeight");
    const promptLinePositions = ref([
        "top",
        "left"
    ]);
    watchEffect(()=>{
        const array = [
            "top",
            "left"
        ];
        if (value.value.position === "top") array[0] = "bottom";
        else if (value.value.position === "left") array[1] = "right";
        else if (value.value.position === "right") array[1] = "left";
        Object.assign(promptLinePositions.value, array);
    });
    return {
        value,
        deputySizeValue,
        isHorizon,
        principalSizeProp,
        deputySizeProp,
        deputyMinSizeProp,
        promptLinePositions
    };
});

const useBehavior = defineStore("desktop.behavior", ()=>{
    const curBehavior = ref("");
    const eventTargetMap = new WeakMap();
    return {
        curBehavior,
        wrapEventTarget
    };
    function wrapEventTarget(eventTarget) {
        let behavior = eventTargetMap.get(eventTarget);
        if (!behavior) {
            behavior = {
                listenerMapKeyBehaviorTypes: new Map(),
                addEventListener (event, listener, options) {
                    let behaviorTypes, key, firedOnLeave;
                    if (typeof options === "object") {
                        key = options.key;
                        behaviorTypes = toBehaviorTypes(options.behaviorTypes, "");
                        firedOnLeave = options.firedOnLeave ?? false;
                    } else {
                        behaviorTypes = toBehaviorTypes(undefined, "");
                        firedOnLeave = false;
                    }
                    const behaviorListener = (...args)=>{
                        if (behaviorTypes.includes(curBehavior.value)) return listener(...args);
                    };
                    eventTarget.addEventListener(event, behaviorListener, options);
                    this.listenerMapKeyBehaviorTypes.set(listener, {
                        key,
                        behaviorListener,
                        behaviorTypes,
                        event
                    });
                    if (firedOnLeave) this.addEventListener("mouseleave", listener, {
                        ...typeof options === "boolean" ? {} : options,
                        firedOnLeave: false
                    });
                    return this;
                },
                removeEventListener (event, listenerOrOption, options) {
                    if (typeof listenerOrOption === "function") {
                        const data = this.listenerMapKeyBehaviorTypes.get(listenerOrOption);
                        if (data) {
                            this.listenerMapKeyBehaviorTypes.delete(listenerOrOption);
                            eventTarget.removeEventListener(event, data.behaviorListener, options);
                        } else {
                            eventTarget.removeEventListener(event, listenerOrOption, options);
                        }
                    } else {
                        const key = listenerOrOption.key;
                        const behaviorTypes = toBehaviorTypes(listenerOrOption.behaviorTypes);
                        for (let [listener, data] of this.listenerMapKeyBehaviorTypes.entries()){
                            if (key === data.key && (!behaviorTypes.length || behaviorTypes.some((value)=>data.behaviorTypes.includes(value)))) {
                                this.listenerMapKeyBehaviorTypes.delete(listener);
                                eventTarget.removeEventListener(event, data.behaviorListener, options);
                            }
                        }
                    }
                    return this;
                },
                dispose (options) {
                    if (options) {
                        const behaviorTypes = toBehaviorTypes(options.behaviorTypes);
                        const array = Array.from(this.listenerMapKeyBehaviorTypes);
                        for (let entry of array){
                            if (entry[1] === options.key && (!behaviorTypes.length || behaviorTypes.some((value)=>entry[1].behaviorTypes.includes(value)))) this.removeEventListener(entry[1].event, entry[0], entry[1]);
                        }
                    } else {
                        const array = Array.from(this.listenerMapKeyBehaviorTypes);
                        for (let entry of array){
                            this.removeEventListener(entry[1].event, entry[0], entry[1]);
                        }
                        this.listenerMapKeyBehaviorTypes.clear();
                        eventTargetMap.delete(eventTarget);
                    }
                }
            };
            eventTargetMap.set(eventTarget, behavior);
        }
        return behavior;
    }
});
function toBehaviorTypes(types, defaultType) {
    if (!types) {
        if (typeof defaultType === "string") return [
            defaultType
        ];
        else return [];
    }
    if (!(types instanceof Array)) return [
        types
    ];
    return types;
}

var _dec$6, _class$6, _MainAreaInst;
function _defineProperty$6(obj, key, value) {
    key = _toPropertyKey$6(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _toPropertyKey$6(t) {
    var i = _toPrimitive$6(t, "string");
    return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$6(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
        var i = e.call(t, r );
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (String )(t);
}
let MainAreaInst = (_dec$6 = Component(), _dec$6(_class$6 = (_MainAreaInst = class MainAreaInst extends VueComponent {
    constructor(...args){
        super(...args);
        _defineProperty$6(this, "styles", new Styles().addDynamic("container", ()=>{
            const { deputySizeProp } = useTaskbarSetting();
            return {
                position: "relative",
                flexGrow: "1",
                [deputySizeProp]: "100%"
            };
        }));
    }
    setup() {
        useDesktop().mainAreaInst = this;
    }
    render() {
        return createVNode("div", {
            "class": this.styles.classNames.container
        }, [
            createTextVNode("main-area")
        ]);
    }
}, _defineProperty$6(_MainAreaInst, "defineProps", [
    "inst"
]), _MainAreaInst)) || _class$6);
const Main = toNative(MainAreaInst);

var _dec$5, _class$5, _ContentAreaInst;
function _defineProperty$5(obj, key, value) {
    key = _toPropertyKey$5(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _toPropertyKey$5(t) {
    var i = _toPrimitive$5(t, "string");
    return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$5(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
        var i = e.call(t, r );
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (String )(t);
}
let ContentAreaInst = (_dec$5 = Component(), _dec$5(_class$5 = (_ContentAreaInst = class ContentAreaInst extends VueComponent {
    constructor(...args){
        super(...args);
        _defineProperty$5(this, "styles", new Styles().addDynamic("contentArea", ()=>{
            const { deputySizeProp } = useTaskbarSetting();
            return {
                flexGrow: 1,
                [deputySizeProp]: "100%"
            };
        }));
    }
    onUnmounted() {
        this.styles.dispose();
    }
    render() {
        return createVNode("div", {
            "class": this.styles.classNames.contentArea
        }, null);
    }
}, _defineProperty$5(_ContentAreaInst, "defineProps", [
    "inst"
]), _ContentAreaInst)) || _class$5);
const ContentArea = toNative(ContentAreaInst);

var _dec$4, _class$4, _InfoAreaInst;
function _defineProperty$4(obj, key, value) {
    key = _toPropertyKey$4(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _toPropertyKey$4(t) {
    var i = _toPrimitive$4(t, "string");
    return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$4(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
        var i = e.call(t, r );
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (String )(t);
}
let InfoAreaInst = (_dec$4 = Component(), _dec$4(_class$4 = (_InfoAreaInst = class InfoAreaInst extends VueComponent {
    constructor(...args){
        super(...args);
        _defineProperty$4(this, "styles", new Styles().addDynamic("infoArea", ()=>{
            const { deputySizeProp, isHorizon } = useTaskbarSetting();
            return {
                flexShrink: 0,
                flexBasis: "100px",
                [deputySizeProp]: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                flexDirection: dynamic(isHorizon ? "column" : "row"),
                overflow: "hidden",
                gap: "3px"
            };
        }).add("blank", {
            boxShadow: "-2px -2px 2px 0 rgba(0,0,0,0.2)"
        }, "hover").add("time", {
            textAlign: "center",
            fontSize: "0.75rem"
        }).addDynamic("blank", ()=>{
            const { deputySizeProp } = useTaskbarSetting();
            return {
                flexBasis: "5px",
                [deputySizeProp]: "100%",
                transition: "all 0.1s"
            };
        }));
    }
    onUnmounted() {
        this.styles.dispose();
    }
    render() {
        const styles = this.styles;
        const desktop = useDesktop();
        return createVNode("div", {
            "class": styles.classNames.infoArea
        }, [
            createVNode("div", {
                "class": styles.classNames.time
            }, [
                createVNode("div", null, [
                    desktop.formatTime
                ]),
                createVNode("div", null, [
                    desktop.formatDate
                ])
            ]),
            createVNode("div", {
                "class": styles.classNames.blank
            }, null)
        ]);
    }
}, _defineProperty$4(_InfoAreaInst, "defineProps", [
    "inst"
]), _InfoAreaInst)) || _class$4);
const InfoArea = toNative(InfoAreaInst);

var _dec$3, _dec2, _class$3, _class2, _descriptor, _PromptLineInst;
function _initializerDefineProperty(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
        writable: descriptor.writable,
        value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
}
function _defineProperty$3(obj, key, value) {
    key = _toPropertyKey$3(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _toPropertyKey$3(t) {
    var i = _toPrimitive$3(t, "string");
    return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$3(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
        var i = e.call(t, r );
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (String )(t);
}
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object.keys(descriptor).forEach(function(key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;
    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }
    desc = decorators.slice().reverse().reduce(function(desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);
    if (desc.initializer === void 0) {
        Object.defineProperty(target, property, desc);
        desc = null;
    }
    return desc;
}
let PromptLineInst = (_dec$3 = Component(), _dec2 = Link(), _dec$3(_class$3 = (_class2 = (_PromptLineInst = class PromptLineInst extends VueComponent {
    constructor(...args){
        super(...args);
        _defineProperty$3(this, "styles", new Styles().addDynamic("promptLine", ()=>{
            const { promptLinePositions, deputySizeProp, principalSizeProp, isHorizon } = useTaskbarSetting();
            return {
                position: "absolute",
                [promptLinePositions[0]]: 0,
                [promptLinePositions[1]]: 0,
                [principalSizeProp]: "100%",
                [deputySizeProp]: "3px",
                transform: dynamic(isHorizon ? "translateX(-50%)" : "translateY(-50%)"),
                cursor: dynamic(isHorizon ? "col-resize" : "row-resize")
            };
        }));
        _initializerDefineProperty(this, "el", _descriptor, this);
    }
    onMounted() {
        let downPosition;
        useBehavior().wrapEventTarget(this.el).addEventListener("mousedown", (e)=>{
            useDesktop().cursor = getComputedStyle(this.el).cursor;
            downPosition = e;
            useBehavior().curBehavior = "resize-taskbar";
        });
        useBehavior().wrapEventTarget(window).addEventListener("mouseup", ()=>{
            downPosition = undefined;
            useBehavior().curBehavior = "";
            useDesktop().resetCursor();
        }, {
            behaviorTypes: "resize-taskbar",
            firedOnLeave: true,
            key: this
        }).addEventListener("mousemove", (e)=>{
            if (downPosition) {
                const { value, deputySizeProp } = useTaskbarSetting();
                const offsetX = e.x - downPosition.x;
                const offsetY = e.y - downPosition.y;
                let deputySize = this.el.getBoundingClientRect()[deputySizeProp];
                if (value.position === "left") {
                    deputySize += offsetX;
                } else if (value.position === "right") {
                    deputySize -= offsetX;
                } else if (value.position === "bottom") {
                    deputySize -= offsetY;
                } else if (value.position === "top") {
                    deputySize += offsetY;
                }
                value.deputySize = deputySize + "px";
                downPosition = e;
            }
        }, {
            behaviorTypes: "resize-taskbar",
            key: this
        });
    }
    onUnmounted() {
        this.styles.dispose();
        useBehavior().wrapEventTarget(this.el).dispose();
        useBehavior().wrapEventTarget(window).dispose({
            key: this
        });
    }
    render() {
        return createVNode("div", {
            "ref": "el",
            "class": this.styles.classNames.promptLine
        }, null);
    }
}, _defineProperty$3(_PromptLineInst, "defineProps", [
    "inst"
]), _PromptLineInst), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "el", [
    _dec2
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
}), _class2)) || _class$3);
const PromptLine = toNative(PromptLineInst);

var _dec$2, _class$2, _StartButtonInst;
function _defineProperty$2(obj, key, value) {
    key = _toPropertyKey$2(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _toPropertyKey$2(t) {
    var i = _toPrimitive$2(t, "string");
    return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$2(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
        var i = e.call(t, r );
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (String )(t);
}
let StartButtonInst = (_dec$2 = Component(), _dec$2(_class$2 = (_StartButtonInst = class StartButtonInst extends VueComponent {
    constructor(...args){
        super(...args);
        _defineProperty$2(this, "styles", new Styles().addDynamic("startButton", ()=>{
            const { deputySizeProp } = useTaskbarSetting();
            return {
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexBasis: dynamic(rem(50)),
                [deputySizeProp]: "100%",
                fontSize: dynamic(rem(18)),
                cursor: "pointer",
                transition: "all 0.3s linear"
            };
        }).add("startButton", {
            background: "rgba(255, 255, 255, 0.5)"
        }, "hover"));
    }
    onUnmounted() {
        this.styles.dispose();
    }
    render() {
        return createVNode("div", {
            "class": this.styles.classNames.startButton,
            "title": "开始"
        }, [
            createVNode(WindowsFilled, null, null)
        ]);
    }
}, _defineProperty$2(_StartButtonInst, "defineProps", [
    "inst"
]), _StartButtonInst)) || _class$2);
const StartButton = toNative(StartButtonInst);

var _dec$1, _class$1, _TaskbarInst;
function _defineProperty$1(obj, key, value) {
    key = _toPropertyKey$1(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _toPropertyKey$1(t) {
    var i = _toPrimitive$1(t, "string");
    return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$1(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
        var i = e.call(t, r );
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (String )(t);
}
function setContainerPosition(result, value, show) {
    switch(value.position){
        case "bottom":
            result.bottom = "0";
            result.left = "0";
            result.transform = dynamic(show ? "translate(0, 0)" : "translate(0, 100%)");
            break;
        case "left":
            result.left = "0";
            result.top = "0";
            result.transform = dynamic(show ? "translate(0, 0)" : "translate(-100%, 0)");
            break;
        case "right":
            result.right = "0";
            result.top = "0";
            result.transform = dynamic(show ? "translate(0, 0)" : "translate(100%, 0)");
            break;
        case "top":
            result.top = "0";
            result.left = 0;
            result.transform = dynamic(show ? "translate(0, 0)" : "translate(0, -100%)");
            break;
    }
    return result;
}
let TaskbarInst = (_dec$1 = Component(), _dec$1(_class$1 = (_TaskbarInst = class TaskbarInst extends VueComponent {
    constructor(...args){
        super(...args);
        _defineProperty$1(this, "styles", new Styles().addDynamic("container", ()=>{
            const { deputySizeValue, deputySizeProp, deputyMinSizeProp, principalSizeProp, isHorizon, value } = useTaskbarSetting();
            const result = {
                [principalSizeProp]: "100%",
                [deputySizeProp]: dynamic(deputySizeValue),
                [deputyMinSizeProp]: dynamic(rem(isHorizon ? TASKBAR_INIT_WIDTH : TASKBAR_INIT_HEIGHT)),
                display: "flex",
                flexDirection: dynamic(isHorizon ? "column" : "row"),
                flexShrink: "0",
                background: "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(10px)",
                position: dynamic(value.autoHide.enabled ? "absolute" : "relative"),
                transitionProperty: "transform",
                transitionDuration: "200ms",
                transitionDelay: "500ms"
            };
            if (value.autoHide.enabled) {
                setContainerPosition(result, value, value.autoHide.forceShow);
            }
            return result;
        }).addDynamic("container", ()=>{
            const result = {};
            return setContainerPosition(result, useTaskbarSetting().value, true);
        }, {
            pseudoClasses: "hover"
        }));
    }
    setup() {
        useDesktop().taskbarInst = this;
    }
    onUnmounted() {
        this.styles.dispose();
    }
    render() {
        const { styles } = this;
        const setting = useTaskbarSetting().value;
        return createVNode("div", {
            "class": styles.classNames.container
        }, [
            createVNode(StartButton, null, null),
            createVNode(ContentArea, null, null),
            createVNode(InfoArea, null, null),
            setting.lock ? null : createVNode(PromptLine, null, null)
        ]);
    }
}, _defineProperty$1(_TaskbarInst, "defineProps", [
    "inst"
]), _TaskbarInst)) || _class$1);
const Taskbar = toNative(TaskbarInst);

var _dec, _class, _DesktopInst;
function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
        var i = e.call(t, r );
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (String )(t);
}
let DesktopInst = (_dec = Component(), _dec(_class = (_DesktopInst = class DesktopInst extends VueComponent {
    constructor(...args){
        super(...args);
        _defineProperty(this, "styles", new Styles().add("container", {
            width: "100%",
            height: "100%",
            overflow: "auto"
        }).addDynamic("wrapper", ()=>{
            const settings = useTaskbarSetting().value;
            let flexDirection;
            if (settings.position === "left") flexDirection = "row-reverse";
            else if (settings.position === "right") flexDirection = "row";
            else if (settings.position === "top") flexDirection = "column-reverse";
            else flexDirection = "column";
            return {
                width: "100%",
                height: "100%",
                position: "relative",
                display: "flex",
                flexDirection: dynamic(flexDirection),
                background: "wheat",
                cursor: "default",
                overflow: "hidden"
            };
        }));
    }
    setup() {
        useDesktop().desktopInst = this;
    }
    render() {
        return createVNode("div", {
            "class": this.styles.classNames.container
        }, [
            createVNode("div", {
                "class": this.styles.classNames.wrapper
            }, [
                createVNode(Main, null, null),
                createVNode(Taskbar, null, null)
            ])
        ]);
    }
}, _defineProperty(_DesktopInst, "defineProps", [
    "inst"
]), _DesktopInst)) || _class);
const desktop = toNative(DesktopInst);

export { desktop as Desktop, Main as MainArea, Taskbar, rem, useBehavior, useDesktop, useTaskbarSetting };
