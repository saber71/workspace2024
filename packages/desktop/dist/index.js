import { shallowRef, watch, ref, computed, watchEffect, createVNode } from 'vue';
import { Styles, dynamic } from 'styles';
import { Component, toNative, VueComponent, Hook } from 'vue-class';
import { useLocalStorage } from '@vueuse/core';
import { remove } from 'common';
import EventEmitter from 'eventemitter3';
import { defineStore } from 'pinia';
import { WindowsFilled } from '@ant-design/icons-vue';

const TASKBAR_INIT_HEIGHT = 40;
const BASE_FONT_SIZE = 16;

const useDesktop = defineStore("desktop", ()=>{
    const opened = useLocalStorage("desktop.opened", []);
    const desktopInst = shallowRef(0);
    const mainAreaInst = shallowRef(0);
    const taskbarInst = shallowRef(0);
    const id = opened.value.reduce((previousValue, currentValue)=>Math.max(previousValue, currentValue), -1) + 1;
    opened.value.push(id);
    const scale = useLocalStorage("desktop.scale", 1);
    let oldFontSize = document.documentElement.style.fontSize;
    watch(scale, ()=>{
        document.documentElement.style.fontSize = scale.value * BASE_FONT_SIZE + "px";
    }, {
        immediate: true
    });
    const timestamp = shallowRef(new Date());
    const formatTime = ref("");
    const formatDate = ref("");
    let raqHandler = requestAnimationFrame(updateTimestamp);
    const eventBus = new EventEmitter().on("close", ()=>{
        remove(opened.value, id);
        document.documentElement.style.fontSize = oldFontSize;
        cancelAnimationFrame(raqHandler);
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
        formatTime
    };
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
        autoHide: false,
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

var _dec$2, _class$2, _MainAreaInst;
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
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
}
let MainAreaInst = (_dec$2 = Component(), _dec$2(_class$2 = (_MainAreaInst = class MainAreaInst extends VueComponent {
    constructor(...args){
        super(...args);
        _defineProperty$2(this, "styles", new Styles().addDynamic("container", ()=>{
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
        }, null);
    }
}, _defineProperty$2(_MainAreaInst, "defineProps", [
    "inst"
]), _MainAreaInst)) || _class$2);
const Main = toNative(MainAreaInst);

var _dec$1, _dec2, _class$1, _class2, _TaskbarInst;
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
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
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
    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }
    if (desc.initializer === void 0) {
        Object.defineProperty(target, property, desc);
        desc = null;
    }
    return desc;
}
let TaskbarInst = (_dec$1 = Component(), _dec2 = Hook("onUnmounted"), _dec$1(_class$1 = (_class2 = (_TaskbarInst = class TaskbarInst extends VueComponent {
    constructor(...args){
        super(...args);
        _defineProperty$1(this, "styles", new Styles().addDynamic("blank", ()=>{
            const { deputySizeProp } = useTaskbarSetting();
            return {
                flexBasis: "7px",
                [deputySizeProp]: "100%",
                transition: "all 0.1s"
            };
        }).add("blank", {
            boxShadow: "-2px 0 2px 0 rgba(0,0,0,0.2)"
        }, "hover").add("time", {
            textAlign: "center",
            fontSize: "0.75rem"
        }).addDynamic("container", ()=>{
            const { deputySizeValue, deputySizeProp, deputyMinSizeProp, principalSizeProp, isHorizon } = useTaskbarSetting();
            return {
                [principalSizeProp]: "100%",
                [deputySizeProp]: dynamic(deputySizeValue),
                [deputyMinSizeProp]: dynamic(rem(TASKBAR_INIT_HEIGHT)),
                display: "flex",
                flexDirection: dynamic(isHorizon ? "column" : "row"),
                flexShrink: "0",
                background: "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(10px)"
            };
        }).addDynamic("promptLine", ()=>{
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
        }).addDynamic("startButton", ()=>{
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
        }, "hover").addDynamic("contentArea", ()=>{
            const { deputySizeProp } = useTaskbarSetting();
            return {
                flexGrow: 1,
                [deputySizeProp]: "100%"
            };
        }).addDynamic("infoArea", ()=>{
            const { deputySizeProp, isHorizon } = useTaskbarSetting();
            return {
                flexShrink: 0,
                flexBasis: "100px",
                [deputySizeProp]: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                flexDirection: dynamic(isHorizon ? "column" : "row"),
                gap: "3px",
                overflow: "hidden"
            };
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
        const desktop = useDesktop();
        return createVNode("div", {
            "class": styles.classNames.container
        }, [
            createVNode("div", {
                "class": styles.classNames.startButton,
                "title": "开始"
            }, [
                createVNode(WindowsFilled, null, null)
            ]),
            createVNode("div", {
                "class": styles.classNames.contentArea
            }, null),
            createVNode("div", {
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
            ]),
            createVNode("div", {
                "class": styles.classNames.promptLine
            }, null)
        ]);
    }
}, _defineProperty$1(_TaskbarInst, "defineProps", [
    "inst"
]), _TaskbarInst), _applyDecoratedDescriptor(_class2.prototype, "onUnmounted", [
    _dec2
], Object.getOwnPropertyDescriptor(_class2.prototype, "onUnmounted"), _class2.prototype), _class2)) || _class$1);
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
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
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
                cursor: "default"
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

export { desktop as Desktop, Main as MainArea, Taskbar, rem, useDesktop, useTaskbarSetting };
