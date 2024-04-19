import { shallowRef, watch, createVNode } from 'vue';
import { Component, toNative, VueComponent } from 'vue-class';
import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { remove } from 'common';
import EventEmitter from 'eventemitter3';

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
    let oldFontSize = document.body.style.fontSize;
    watch(scale, ()=>{
        document.body.style.fontSize = scale.value * BASE_FONT_SIZE + "px";
    }, {
        immediate: true
    });
    const eventBus = new EventEmitter().on("close", ()=>{
        remove(opened.value, id);
        document.body.style.fontSize = oldFontSize;
    });
    return {
        opened,
        id,
        eventBus,
        desktopInst,
        mainAreaInst,
        taskbarInst
    };
});
function rem(px) {
    return px / BASE_FONT_SIZE + "rem";
}

const useDesktopStyles = defineStore("desktop.styles", ()=>{
    const desktop = useDesktop();
    const desktopStyles = useLocalStorage("desktop.styles:" + desktop.id, {
        container: {
            width: "100%",
            height: "100%",
            overflow: "auto"
        },
        wrapper: {
            width: "100%",
            height: "100%",
            position: "relative"
        }
    });
    const taskbarStyles = useLocalStorage("desktop.taskbarStyles:" + desktop.id, {
        container: {
            width: "100%",
            height: rem(TASKBAR_INIT_HEIGHT),
            display: "flex",
            flexDirection: "row"
        }
    });
    return {
        desktopStyles,
        taskbarStyles
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
    setup() {
        useDesktop().mainAreaInst = this;
    }
    render() {
        return createVNode("div", null, null);
    }
}, _defineProperty$2(_MainAreaInst, "defineProps", [
    "inst"
]), _MainAreaInst)) || _class$2);
const Main = toNative(MainAreaInst);

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
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
}
let TaskbarInst = (_dec$1 = Component(), _dec$1(_class$1 = (_TaskbarInst = class TaskbarInst extends VueComponent {
    constructor(...args){
        super(...args);
        _defineProperty$1(this, "styles", useDesktopStyles().taskbarStyles);
    }
    setup() {
        useDesktop().taskbarInst = this;
    }
    render() {
        return createVNode("div", {
            "style": this.styles.container
        }, null);
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
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
}
let DesktopInst = (_dec = Component(), _dec(_class = (_DesktopInst = class DesktopInst extends VueComponent {
    constructor(...args){
        super(...args);
        _defineProperty(this, "styles", useDesktopStyles().desktopStyles);
    }
    setup() {
        useDesktop().desktopInst = this;
    }
    render() {
        return createVNode("div", {
            "style": this.styles.container
        }, [
            createVNode("div", {
                "style": this.styles.wrapper
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

export { desktop as Desktop, Main as MainArea, Taskbar, rem, useDesktop, useDesktopStyles };
