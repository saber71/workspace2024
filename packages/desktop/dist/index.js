import { ref, shallowRef, watch, computed, watchEffect, createVNode, createTextVNode, nextTick, isVNode } from 'vue';
import { Styles, dynamic } from 'styles';
import { Component, toNative, VueComponent, Link, Mut, Watcher } from 'vue-class';
import { useLocalStorage } from '@vueuse/core';
import { remove, If } from 'common';
import EventEmitter from 'eventemitter3';
import { defineStore } from 'pinia';
import { UpOutlined, DownOutlined, WindowsFilled } from '@ant-design/icons-vue';
import { createPopper } from '@popperjs/core';
import { Button, Flex, Space } from 'ant-design-vue';

const TASKBAR_INIT_HEIGHT = 40;
const TASKBAR_INIT_WIDTH = 70;
const BASE_FONT_SIZE = 16;
const PRIMARY_COLOR = "#1677ff";
const PRIMARY_HOVER_COLOR = "#69b1ff";
const BACKGROUND_COLOR = "rgba(245,245,235,0.3)";

const useDesktop = defineStore("desktop", ()=>{
    const initCursor = "default";
    const cursor = ref(initCursor);
    const opened = useLocalStorage("desktop.opened", []);
    const desktopInst = shallowRef(0);
    const mainAreaInst = shallowRef(0);
    const taskbarInst = shallowRef(0);
    const id = opened.value.reduce((previousValue, currentValue)=>Math.max(previousValue, currentValue), -1) + 1;
    const scale = ref(1);
    const timestamp = shallowRef(new Date());
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
        desktopInst.value.wrapperEl.style.cursor = cursor.value;
    });
    return {
        opened,
        id,
        scale,
        eventBus,
        desktopInst,
        mainAreaInst,
        taskbarInst,
        timestamp,
        cursor,
        resetCursor
    };
    function resetCursor() {
        cursor.value = initCursor;
    }
    function updateTimestamp() {
        timestamp.value = new Date();
        raqHandler = requestAnimationFrame(updateTimestamp);
    }
});
function rem(px) {
    return px / BASE_FONT_SIZE + "rem";
}

const useTaskbarSetting = defineStore("desktop.taskbar.setting", ()=>{
    const value = ref({
        deputySize: "",
        autoHide: {
            enabled: false,
            forceShow: false
        },
        position: "bottom",
        small: false,
        lock: false
    });
    const isHorizon = computed(()=>value.value.position === "left" || value.value.position === "right");
    const deputySizeValue = computed(()=>value.value.deputySize || rem(isHorizon.value ? TASKBAR_INIT_WIDTH : TASKBAR_INIT_HEIGHT));
    const principalSizeProp = computed(()=>isHorizon.value ? "height" : "width");
    const deputySizeProp = computed(()=>isHorizon.value ? "width" : "height");
    const deputyMinSizeProp = computed(()=>isHorizon.value ? "minWidth" : "minHeight");
    const promptLinePositions = ref([
        "top",
        "left"
    ]);
    watchEffect(()=>{
        useDesktop().scale = value.value.small ? 0.75 : 1;
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

var _dec$7, _class$7, _MainAreaInst;
function _defineProperty$7(obj, key, value) {
    key = _toPropertyKey$7(key);
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
function _toPropertyKey$7(t) {
    var i = _toPrimitive$7(t, "string");
    return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$7(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
        var i = e.call(t, r );
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (String )(t);
}
let MainAreaInst = (_dec$7 = Component(), _dec$7(_class$7 = (_MainAreaInst = class MainAreaInst extends VueComponent {
    constructor(...args){
        super(...args);
        _defineProperty$7(this, "styles", new Styles().addDynamic("container", ()=>{
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
}, _defineProperty$7(_MainAreaInst, "defineProps", [
    "inst"
]), _MainAreaInst)) || _class$7);
const Main = toNative(MainAreaInst);

var _dec$6, _class$6, _ContentAreaInst;
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
let ContentAreaInst = (_dec$6 = Component(), _dec$6(_class$6 = (_ContentAreaInst = class ContentAreaInst extends VueComponent {
    constructor(...args){
        super(...args);
        _defineProperty$6(this, "styles", new Styles().addDynamic("contentArea", ()=>{
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
}, _defineProperty$6(_ContentAreaInst, "defineProps", [
    "inst"
]), _ContentAreaInst)) || _class$6);
const ContentArea = toNative(ContentAreaInst);

var _dec$5, _dec2$3, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class$5, _class2$3, _descriptor$3, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _TimeInst;
function _initializerDefineProperty$3(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
        writable: descriptor.writable,
        value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
}
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
function _applyDecoratedDescriptor$3(target, property, decorators, descriptor, context) {
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
function _isSlot(s) {
    return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !isVNode(s);
}
const weekTexts = [
    "日",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六"
];
const baseCalendarGridStyle = {
    width: rem(50),
    height: rem(45),
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
};
const dateFormatter = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "numeric",
    day: "2-digit"
});
const cnDateFormatter = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit"
});
const chineseDateFormatter = new Intl.DateTimeFormat("zh-u-ca-chinese", {
    dateStyle: "full"
});
const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    hour12: false,
    minute: "2-digit"
});
const fullTimeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    second: "2-digit"
});
const weekFormatter = new Intl.DateTimeFormat(undefined, {
    weekday: "short"
});
function getChineseMonthDay(date) {
    const string = chineseDateFormatter.format(date);
    const si = string.indexOf("年"), ei = string.indexOf("星");
    return string.substring(si + 1, ei);
}
function getChineseDay(date) {
    const string = chineseDateFormatter.format(date);
    const si = string.indexOf("月"), ei = string.indexOf("星");
    return string.substring(si + 1, ei);
}
function getChineseMonth(date) {
    const string = chineseDateFormatter.format(date);
    const si = string.indexOf("年"), ei = string.indexOf("月");
    return string.substring(si + 1, ei + 1);
}
let TimeInst = (_dec$5 = Component(), _dec2$3 = Link(), _dec3 = Link(), _dec4 = Mut(), _dec5 = Mut(), _dec6 = Mut(), _dec7 = Watcher(), _dec8 = Watcher(), _dec$5(_class$5 = (_class2$3 = (_TimeInst = class TimeInst extends VueComponent {
    constructor(...args){
        super(...args);
        _defineProperty$5(this, "styles", new Styles().add("isToday_inner", {
            border: "3px solid transparent",
            boxSizing: "border-box"
        }).add("isToday_inner-selected", {
            border: "3px solid white",
            boxSizing: "border-box"
        }).add("calendarGrid", {
            ...baseCalendarGridStyle,
            border: "2px solid transparent",
            "margin-bottom": "2px"
        }).add("calendarGrid-selected", {
            borderColor: PRIMARY_COLOR
        }).add("calendarGrid", {
            border: "2px solid white"
        }, "hover").add("calendarGrid-selected", {
            borderColor: PRIMARY_HOVER_COLOR
        }, "hover").add("calendarGrid_inner", {
            width: "100%",
            height: "100%"
        }).add("isAnotherMonth", {
            opacity: "0.5"
        }).add("isToday", {
            color: "white",
            background: PRIMARY_COLOR,
            border: `2px solid ${PRIMARY_COLOR}`
        }).add("isToday", {
            border: "2px solid black"
        }, "hover").add("arrow", {
            transition: "all 0.3s"
        }).add("arrow", {
            color: PRIMARY_HOVER_COLOR
        }, "hover").add("popperCalendar", {
            padding: rem(15),
            borderBottom: "1px solid #aaa"
        }).add("popperHeaderTime", {
            fontSize: rem(40)
        }).add("popperHeader", {
            padding: rem(15),
            borderBottom: "1px solid #aaa",
            textAlign: "left"
        }).addDynamic("time", ()=>{
            const { deputySizeProp } = useTaskbarSetting();
            return {
                fontSize: "0.75rem",
                userSelect: "none",
                [deputySizeProp]: "100%",
                display: "flex",
                alignItems: "center",
                textAlign: "center"
            };
        }).addDynamic("hoverableTime", ()=>{
            const { deputySizeProp } = useTaskbarSetting();
            return {
                width: "100%",
                height: "100%",
                padding: dynamic(deputySizeProp === "width" ? "5px 0" : "0 5px"),
                display: "flex",
                alignItems: "center"
            };
        }).add("hoverableTime", {
            background: "rgba(255,255,255,0.5)"
        }, "hover").addDynamic("popper", ()=>{
            useTaskbarSetting().value;
            return {
                width: rem(392),
                background: BACKGROUND_COLOR,
                backdropFilter: "blur(10px)",
                boxShadow: "0 2px 12px 0 rgba(0, 0, 0, 0.25)"
            };
        }));
        _initializerDefineProperty$3(this, "timeEl", _descriptor$3, this);
        _initializerDefineProperty$3(this, "popperEl", _descriptor2, this);
        _initializerDefineProperty$3(this, "showPopper", _descriptor3, this);
        _initializerDefineProperty$3(this, "calendars", _descriptor4, this);
        _initializerDefineProperty$3(this, "selectedTime", _descriptor5, this);
        _defineProperty$5(this, "popperInstance", void 0);
        _defineProperty$5(this, "year", void 0);
        _defineProperty$5(this, "month", void 0);
    }
    updateCalendars() {
        this.calendars.length = 0;
        const monthOneDay = new Date(`${this.year}/${this.month}/1`);
        const today = new Date(useDesktop().timestamp);
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        const todayTimestamp = today.setMilliseconds(0);
        const oneDayMs = 86400000;
        let time = monthOneDay.getTime() - oneDayMs * monthOneDay.getDay();
        for(let i = 0; i < 6; i++){
            const arr = [];
            this.calendars.push(arr);
            for(let j = 0; j < 7; j++){
                const date = new Date(time);
                let chineseDay = getChineseDay(date);
                if (chineseDay === "初一") chineseDay = getChineseMonth(date);
                arr.push({
                    timestamp: time,
                    day: date.getDate(),
                    month: date.getMonth() + 1,
                    chineseDay,
                    isToday: todayTimestamp === time
                });
                time += oneDayMs;
            }
        }
    }
    jumpMonth(offset) {
        this.month += offset;
        if (this.month <= 0) {
            this.month = 12;
            this.year--;
        } else if (this.month > 12) {
            this.month = 1;
            this.year++;
        }
    }
    setupPopper() {
        if (this.showPopper) {
            if (this.popperInstance) return;
            const date = useDesktop().timestamp;
            this.year = date.getFullYear();
            this.month = date.getMonth() + 1;
            this.selectedTime = new Date(`${this.year}/${this.month}/${date.getDate()}`).getTime();
            nextTick(()=>{
                const popper = createPopper(this.timeEl, this.popperEl, {
                    placement: "top",
                    strategy: "absolute"
                });
                popper.update();
                this.popperInstance = popper;
                setTimeout(()=>enabled = true, 100);
            });
            let enabled = false;
            useBehavior().wrapEventTarget(window).addEventListener("click", ()=>{
                if (enabled) this.showPopper = false;
            }, {
                key: this
            });
        } else {
            this.popperInstance?.destroy();
            this.popperInstance = undefined;
            this._disposeWindowBehavior();
        }
    }
    onUnmounted() {
        this.styles.dispose();
        this._disposeWindowBehavior();
    }
    render() {
        let _slot;
        const styles = this.styles;
        const desktop = useDesktop();
        const cnDate = cnDateFormatter.format(desktop.timestamp);
        const week = weekFormatter.format(desktop.timestamp).replace("周", "星期");
        return createVNode("div", {
            "ref": "timeEl",
            "class": styles.classNames.time,
            "onClick": ()=>this.showPopper = !this.showPopper
        }, [
            createVNode("div", {
                "class": styles.classNames.hoverableTime,
                "title": cnDate + "\n" + week
            }, [
                timeFormatter.format(desktop.timestamp),
                createVNode("br", null, null),
                dateFormatter.format(desktop.timestamp)
            ]),
            this.showPopper ? createVNode("div", {
                "ref": "popperEl",
                "class": styles.classNames.popper,
                "onClick": (e)=>e.stopPropagation()
            }, [
                createVNode("div", {
                    "class": styles.classNames.popperHeader
                }, [
                    createVNode("div", {
                        "class": styles.classNames.popperHeaderTime
                    }, [
                        fullTimeFormatter.format(desktop.timestamp)
                    ]),
                    createVNode(Button, {
                        "type": "link"
                    }, {
                        default: ()=>[
                                cnDate + " " + getChineseMonthDay(desktop.timestamp)
                            ]
                    })
                ]),
                createVNode("div", {
                    "class": styles.classNames.popperCalendar
                }, [
                    createVNode(Flex, {
                        "justify": "space-between",
                        "align": "center"
                    }, {
                        default: ()=>[
                                createVNode("div", null, [
                                    this.year + "年" + this.month + "月"
                                ]),
                                createVNode(Flex, null, {
                                    default: ()=>[
                                            createVNode("div", {
                                                "class": styles.classNames.arrow,
                                                "style": baseCalendarGridStyle,
                                                "onClick": ()=>this.jumpMonth(-1)
                                            }, [
                                                createVNode(UpOutlined, null, null)
                                            ]),
                                            createVNode("div", {
                                                "class": styles.classNames.arrow,
                                                "style": baseCalendarGridStyle,
                                                "onClick": ()=>this.jumpMonth(1)
                                            }, [
                                                createVNode(DownOutlined, null, null)
                                            ])
                                        ]
                                })
                            ]
                    }),
                    createVNode(Space, {
                        "size": 2
                    }, _isSlot(_slot = weekTexts.map((val)=>createVNode("span", {
                            "style": baseCalendarGridStyle
                        }, [
                            val
                        ]))) ? _slot : {
                        default: ()=>[
                                _slot
                            ]
                    }),
                    this.calendars.map((arr)=>{
                        let _slot2;
                        return createVNode(Space, {
                            "size": 2
                        }, _isSlot(_slot2 = arr.map((item)=>createVNode("div", {
                                "class": this._getCalendarClasses(item),
                                "onClick": ()=>this.selectedTime = item.timestamp
                            }, [
                                createVNode(Flex, {
                                    "class": this._getCalendarGridInnerStyles(item),
                                    "vertical": true,
                                    "align": "center",
                                    "justify": "center"
                                }, {
                                    default: ()=>[
                                            createVNode("div", null, [
                                                item.day
                                            ]),
                                            createVNode("div", {
                                                "style": "opacity:0.6;font-size:0.75rem;"
                                            }, [
                                                item.chineseDay
                                            ])
                                        ]
                                })
                            ]))) ? _slot2 : {
                            default: ()=>[
                                    _slot2
                                ]
                        });
                    })
                ])
            ]) : null
        ]);
    }
    _getCalendarClasses(item) {
        const styles = this.styles;
        return [
            styles.classNames.calendarGrid,
            item.isToday ? styles.classNames.isToday : "",
            If(item.timestamp === this.selectedTime).then(styles.classNames["calendarGrid-selected"]).else("")
        ];
    }
    _getCalendarGridInnerStyles(item) {
        const styles = this.styles;
        return [
            styles.classNames.calendarGrid_inner,
            If(item.isToday).then(styles.classNames.isToday_inner).else(""),
            If(item.isToday && item.timestamp === this.selectedTime).then(styles.classNames["isToday_inner-selected"]).else(""),
            If(item.month !== this.month).then(styles.classNames.isAnotherMonth).else("")
        ];
    }
    _disposeWindowBehavior() {
        useBehavior().wrapEventTarget(window).removeEventListener("click", {
            key: this
        });
    }
}, _defineProperty$5(_TimeInst, "defineProps", [
    "inst"
]), _TimeInst), _descriptor$3 = _applyDecoratedDescriptor$3(_class2$3.prototype, "timeEl", [
    _dec2$3
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
}), _descriptor2 = _applyDecoratedDescriptor$3(_class2$3.prototype, "popperEl", [
    _dec3
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
}), _descriptor3 = _applyDecoratedDescriptor$3(_class2$3.prototype, "showPopper", [
    _dec4
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return false;
    }
}), _descriptor4 = _applyDecoratedDescriptor$3(_class2$3.prototype, "calendars", [
    _dec5
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return [];
    }
}), _descriptor5 = _applyDecoratedDescriptor$3(_class2$3.prototype, "selectedTime", [
    _dec6
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return 0;
    }
}), _applyDecoratedDescriptor$3(_class2$3.prototype, "updateCalendars", [
    _dec7
], Object.getOwnPropertyDescriptor(_class2$3.prototype, "updateCalendars"), _class2$3.prototype), _applyDecoratedDescriptor$3(_class2$3.prototype, "setupPopper", [
    _dec8
], Object.getOwnPropertyDescriptor(_class2$3.prototype, "setupPopper"), _class2$3.prototype), _class2$3)) || _class$5);
const Time = toNative(TimeInst);

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
        }, "hover").addDynamic("blank", ()=>{
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
        return createVNode("div", {
            "class": styles.classNames.infoArea
        }, [
            createVNode(Time, null, null),
            createVNode("div", {
                "class": styles.classNames.blank
            }, null)
        ]);
    }
}, _defineProperty$4(_InfoAreaInst, "defineProps", [
    "inst"
]), _InfoAreaInst)) || _class$4);
const InfoArea = toNative(InfoAreaInst);

var _dec$3, _dec2$2, _class$3, _class2$2, _descriptor$2, _PromptLineInst;
function _initializerDefineProperty$2(target, property, descriptor, context) {
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
function _applyDecoratedDescriptor$2(target, property, decorators, descriptor, context) {
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
let PromptLineInst = (_dec$3 = Component(), _dec2$2 = Link(), _dec$3(_class$3 = (_class2$2 = (_PromptLineInst = class PromptLineInst extends VueComponent {
    constructor(...args){
        super(...args);
        _defineProperty$3(this, "styles", new Styles().addDynamic("promptLine", ()=>{
            const { promptLinePositions, deputySizeProp, principalSizeProp, isHorizon, value } = useTaskbarSetting();
            let transform = "";
            if (value.position === "left") transform = "translateX(50%)";
            else if (value.position === "right") transform = "translateX(-50%)";
            else if (value.position === "top") transform = "translateY(50%)";
            else if (value.position === "bottom") transform = "translateY(-50%)";
            return {
                position: "absolute",
                [promptLinePositions[0]]: 0,
                [promptLinePositions[1]]: 0,
                [principalSizeProp]: "100%",
                [deputySizeProp]: "5px",
                transform: dynamic(transform),
                cursor: dynamic(isHorizon ? "col-resize" : "row-resize")
            };
        }));
        _initializerDefineProperty$2(this, "el", _descriptor$2, this);
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
                let deputySize = useDesktop().taskbarInst.el.getBoundingClientRect()[deputySizeProp];
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
]), _PromptLineInst), _descriptor$2 = _applyDecoratedDescriptor$2(_class2$2.prototype, "el", [
    _dec2$2
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
}), _class2$2)) || _class$3);
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

var _dec$1, _dec2$1, _class$1, _class2$1, _descriptor$1, _TaskbarInst;
function _initializerDefineProperty$1(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
        writable: descriptor.writable,
        value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
}
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
function _applyDecoratedDescriptor$1(target, property, decorators, descriptor, context) {
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
let TaskbarInst = (_dec$1 = Component(), _dec2$1 = Link(), _dec$1(_class$1 = (_class2$1 = (_TaskbarInst = class TaskbarInst extends VueComponent {
    constructor(...args){
        super(...args);
        _initializerDefineProperty$1(this, "el", _descriptor$1, this);
        _defineProperty$1(this, "styles", new Styles().addDynamic("taskbar", ()=>{
            const { deputySizeValue, deputySizeProp, deputyMinSizeProp, principalSizeProp, isHorizon, value } = useTaskbarSetting();
            const result = {
                [principalSizeProp]: "100%",
                [deputySizeProp]: dynamic(deputySizeValue),
                [deputyMinSizeProp]: dynamic(rem(isHorizon ? TASKBAR_INIT_WIDTH : TASKBAR_INIT_HEIGHT)),
                display: "flex",
                flexDirection: dynamic(isHorizon ? "column" : "row"),
                flexShrink: "0",
                background: BACKGROUND_COLOR,
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
        }).addDynamic("taskbar", ()=>{
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
            "ref": "el",
            "class": styles.classNames.taskbar
        }, [
            createVNode(StartButton, null, null),
            createVNode(ContentArea, null, null),
            createVNode(InfoArea, null, null),
            setting.lock ? null : createVNode(PromptLine, null, null)
        ]);
    }
}, _defineProperty$1(_TaskbarInst, "defineProps", [
    "inst"
]), _TaskbarInst), _descriptor$1 = _applyDecoratedDescriptor$1(_class2$1.prototype, "el", [
    _dec2$1
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
}), _class2$1)) || _class$1);
const Taskbar = toNative(TaskbarInst);

var _dec, _dec2, _class, _class2, _descriptor, _DesktopInst;
function _initializerDefineProperty(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
        writable: descriptor.writable,
        value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
}
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
let DesktopInst = (_dec = Component(), _dec2 = Link(), _dec(_class = (_class2 = (_DesktopInst = class DesktopInst extends VueComponent {
    constructor(...args){
        super(...args);
        _initializerDefineProperty(this, "wrapperEl", _descriptor, this);
        _defineProperty(this, "styles", new Styles().add("container", {
            width: "100%",
            height: "100%",
            overflow: "auto",
            color: "black"
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
            "id": "desktop-container",
            "class": this.styles.classNames.container
        }, [
            createVNode("div", {
                "ref": "wrapperEl",
                "class": this.styles.classNames.wrapper
            }, [
                createVNode(Main, null, null),
                createVNode(Taskbar, null, null)
            ])
        ]);
    }
}, _defineProperty(_DesktopInst, "defineProps", [
    "inst"
]), _DesktopInst), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "wrapperEl", [
    _dec2
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
}), _class2)) || _class);
const desktop = toNative(DesktopInst);

export { desktop as Desktop, Main as MainArea, Taskbar, rem, useBehavior, useDesktop, useTaskbarSetting };
