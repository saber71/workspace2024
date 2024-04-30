import { Inject } from 'vue-class';

var _dec, _dec2, _class, _descriptor;
function _initializerDefineProperty(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
        writable: descriptor.writable,
        value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
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
class A {
}
let Service = (_dec = Inject(), _dec2 = Reflect.metadata("design:type", typeof A === "undefined" ? Object : A), _class = class Service {
    constructor(){
        _initializerDefineProperty(this, "a", _descriptor, this);
    }
}, _descriptor = _applyDecoratedDescriptor(_class.prototype, "a", [
    _dec,
    _dec2
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
}), _class);

export { A, Service };
