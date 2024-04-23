import { ref, shallowRef, watch, computed, watchEffect, createVNode, createTextVNode, nextTick, isVNode } from 'vue';
import { Styles, dynamic } from 'styles';
import { Component, toNative, VueComponent, Link, Mut, Watcher } from 'vue-class';
import { useLocalStorage } from '@vueuse/core';
import { remove } from 'common';
import EventEmitter from 'eventemitter3';
import { defineStore } from 'pinia';
import { UpOutlined, DownOutlined, WindowsFilled } from '@ant-design/icons-vue';
import { Button, Flex } from 'ant-design-vue';

const TASKBAR_INIT_HEIGHT = 40;
const TASKBAR_INIT_WIDTH = 70;
const BASE_FONT_SIZE = 16;
const PRIMARY_COLOR = "#1677ff";
const PRIMARY_HOVER_COLOR = "#69b1ff";
const BACKGROUND_COLOR = "rgba(255,255,255,0.3)";

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

var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}

function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}

// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect$2(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


const applyStyles$1 = {
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect$2,
  requires: ['computeStyles']
};

function getBasePlacement(placement) {
  return placement.split('-')[0];
}

var max = Math.max;
var min = Math.min;
var round = Math.round;

function getUAString() {
  var uaData = navigator.userAgentData;

  if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
    return uaData.brands.map(function (item) {
      return item.brand + "/" + item.version;
    }).join(' ');
  }

  return navigator.userAgent;
}

function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test(getUAString());
}

function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }

  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }

  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;

  if (includeScale && isHTMLElement(element)) {
    scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
  }

  var _ref = isElement(element) ? getWindow(element) : window,
      visualViewport = _ref.visualViewport;

  var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
  var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width: width,
    height: height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x: x,
    y: y
  };
}

// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}

function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && isShadowRoot(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

function getComputedStyle$1(element) {
  return getWindow(element).getComputedStyle(element);
}

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
}

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}

function getParentNode(element) {
  if (getNodeName(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element) // fallback

  );
}

function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle$1(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = /firefox/i.test(getUAString());
  var isIE = /Trident/i.test(getUAString());

  if (isIE && isHTMLElement(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = getComputedStyle$1(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = getParentNode(element);

  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }

  while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle$1(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}

function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

function within(min$1, value, max$1) {
  return max(min$1, min(value, max$1));
}
function withinMaxClamp(min, value, max) {
  var v = within(min, value, max);
  return v > max ? max : v;
}

function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}

function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

var toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === 'y' ? top : left;
  var maxProp = axis === 'y' ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = within(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function effect$1(_ref2) {
  var state = _ref2.state,
      options = _ref2.options;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (!contains(state.elements.popper, arrowElement)) {
    return;
  }

  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules


const arrow$1 = {
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect$1,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
};

function getVariation(placement) {
  return placement.split('-')[1];
}

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref, win) {
  var x = _ref.x,
      y = _ref.y;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x * dpr) / dpr || 0,
    y: round(y * dpr) / dpr || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets,
      isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x,
      x = _offsets$x === void 0 ? 0 : _offsets$x,
      _offsets$y = offsets.y,
      y = _offsets$y === void 0 ? 0 : _offsets$y;

  var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = left;
  var sideY = top;
  var win = window;

  if (adaptive) {
    var offsetParent = getOffsetParent(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === getWindow(popper)) {
      offsetParent = getDocumentElement(popper);

      if (getComputedStyle$1(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
      offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
      offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x,
    y: y
  }, getWindow(popper)) : {
    x: x,
    y: y
  };

  x = _ref4.x;
  y = _ref4.y;

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref5) {
  var state = _ref5.state,
      options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration,
    isFixed: state.options.strategy === 'fixed'
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


const computeStyles$1 = {
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
};

var passive = {
  passive: true
};

function effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


const eventListeners = {
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect,
  data: {}
};

var hash$1 = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash$1[matched];
  });
}

var hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash[matched];
  });
}

function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}

function getViewportRect(element, strategy) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = isLayoutViewport();

    if (layoutViewport || !layoutViewport && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + getWindowScrollBarX(element),
    y: y
  };
}

// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;

  if (getComputedStyle$1(body || html).direction === 'rtl') {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = getComputedStyle$1(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }

  return getScrollParent(getParentNode(node));
}

/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  {
    list = [];
  }

  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents(getParentNode(target)));
}

function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

function getInnerBoundingClientRect(element, strategy) {
  var rect = getBoundingClientRect(element, false, strategy === 'fixed');
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = listScrollParents(getParentNode(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle$1(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

  if (!isElement(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;
    }
  }

  return offsets;
}

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$strategy = _options.strategy,
      strategy = _options$strategy === void 0 ? state.strategy : _options$strategy,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
    return getVariation(placement) === variation;
  }) : basePlacements;
  var allowedPlacements = placements$1.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements$1;
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[getBasePlacement(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }

  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = getBasePlacement(placement);

    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }

    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


const flip$1 = {
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
};

function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


const hide$1 = {
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
};

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


const offset$1 = {
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
};

function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


const popperOffsets$1 = {
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
};

function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis) {
    var _offsetModifierState$;

    var mainSide = mainAxis === 'y' ? top : left;
    var altSide = mainAxis === 'y' ? bottom : right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min$1 = offset + overflow[mainSide];
    var max$1 = offset - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
    popperOffsets[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset;
  }

  if (checkAltAxis) {
    var _offsetModifierState$2;

    var _mainSide = mainAxis === 'x' ? top : left;

    var _altSide = mainAxis === 'x' ? bottom : right;

    var _offset = popperOffsets[altAxis];

    var _len = altAxis === 'y' ? 'height' : 'width';

    var _min = _offset + overflow[_mainSide];

    var _max = _offset - overflow[_altSide];

    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;

    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

    popperOffsets[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


const preventOverflow$1 = {
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
};

function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}

function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }

    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(setOptionsAction) {
        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
          popper: listScrollParents(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {
          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
          popper: getLayoutRect(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });

        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {
      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref) {
        var name = _ref.name,
            _ref$options = _ref.options,
            options = _ref$options === void 0 ? {} : _ref$options,
            effect = _ref.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}

var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
var createPopper = /*#__PURE__*/popperGenerator({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

var _dec$5, _dec2$3, _dec3, _dec4, _dec5, _dec6, _dec7, _class$5, _class2$3, _descriptor$3, _descriptor2, _descriptor3, _descriptor4, _TimeInst;
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
    width: rem(40),
    height: rem(40),
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
let TimeInst = (_dec$5 = Component(), _dec2$3 = Link(), _dec3 = Link(), _dec4 = Mut(), _dec5 = Mut(), _dec6 = Watcher(), _dec7 = Watcher(), _dec$5(_class$5 = (_class2$3 = (_TimeInst = class TimeInst extends VueComponent {
    constructor(...args){
        super(...args);
        _defineProperty$5(this, "styles", new Styles().add("isToday_inner", {
            border: "3px solid white",
            boxSizing: "border-box"
        }).add("calendarGrid", {
            ...baseCalendarGridStyle,
            border: "2px solid transparent"
        }).add("calendarGrid", {
            border: "2px solid white"
        }, "hover").add("calendarGrid_inner", {
            width: "100%",
            height: "100%",
            boxSizing: "border-box"
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
            padding: rem(10),
            borderBottom: "1px solid #aaa"
        }).add("popperHeaderTime", {
            fontSize: rem(40)
        }).add("popperHeader", {
            padding: rem(10),
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
                width: "300px",
                background: BACKGROUND_COLOR,
                backdropFilter: "blur(10px)",
                boxShadow: "0 2px 12px 0 rgba(0, 0, 0, 0.1)"
            };
        }));
        _initializerDefineProperty$3(this, "timeEl", _descriptor$3, this);
        _initializerDefineProperty$3(this, "popperEl", _descriptor2, this);
        _initializerDefineProperty$3(this, "showPopper", _descriptor3, this);
        _initializerDefineProperty$3(this, "calendars", _descriptor4, this);
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
            useBehavior().wrapEventTarget(window).removeEventListener("click", {
                key: this
            });
        }
    }
    onUnmounted() {
        this.styles.dispose();
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
                    createVNode(Flex, null, _isSlot(_slot = weekTexts.map((val)=>createVNode("span", {
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
                        return createVNode(Flex, null, _isSlot(_slot2 = arr.map((item)=>createVNode("div", {
                                "class": styles.classNames.calendarGrid + " " + (item.isToday ? styles.classNames.isToday : "")
                            }, [
                                createVNode("div", {
                                    "class": styles.classNames.calendarGrid_inner + " " + (item.isToday ? styles.classNames.isToday_inner : "") + (item.month !== this.month ? styles.classNames.isAnotherMonth : "")
                                }, [
                                    createVNode("div", null, [
                                        item.day
                                    ]),
                                    createVNode("div", {
                                        "style": "opacity:0.6;font-size:0.75rem;"
                                    }, [
                                        item.chineseDay
                                    ])
                                ])
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
}), _applyDecoratedDescriptor$3(_class2$3.prototype, "updateCalendars", [
    _dec6
], Object.getOwnPropertyDescriptor(_class2$3.prototype, "updateCalendars"), _class2$3.prototype), _applyDecoratedDescriptor$3(_class2$3.prototype, "setupPopper", [
    _dec7
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
