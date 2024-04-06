import { createVNode, mergeProps, isVNode, reactive, ref, watch } from 'vue';
import { Form, FormItem, Input, InputNumber, InputPassword, Checkbox, Button } from 'ant-design-vue';

function _isSlot(s) {
    return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !isVNode(s);
}
const crudComponent = {
    form (prop = {}, children) {
        return (arg)=>createVNode(Form, mergeProps(prop, {
                "model": arg.record
            }), {
                default: ()=>[
                        ...toVNodes(children)
                    ]
            });
    },
    formItem (prop = {}, children) {
        prop = clone(prop);
        if (prop.validateFirst === undefined) prop.validateFirst = true;
        prop = Object.assign({}, prop);
        delete prop.prop;
        return ()=>createVNode(FormItem, prop, {
                default: ()=>[
                        ...toVNodes(children)
                    ]
            });
    },
    input (prop = {}) {
        prop = clone(prop);
        if (!prop.placeholder) prop.placeholder = "请输入";
        if (prop.allowClear === undefined) prop.allowClear = true;
        return (arg)=>createVNode(Input, mergeProps(prop, {
                "value": arg.value,
                "onUpdate:value": arg["onUpdate:value"]
            }), null);
    },
    inputNumber (prop = {}) {
        prop = clone(prop);
        if (!prop.placeholder) prop.placeholder = "请输入";
        return (arg)=>createVNode(InputNumber, mergeProps(prop, {
                "value": arg.value,
                "onUpdate:value": arg["onUpdate:value"]
            }), null);
    },
    inputPassword (prop = {}) {
        prop = clone(prop);
        if (!prop.placeholder) prop.placeholder = "请输入密码";
        if (prop.allowClear === undefined) prop.allowClear = true;
        return (arg)=>createVNode(InputPassword, mergeProps(prop, {
                "value": arg.value,
                "onUpdate:value": arg["onUpdate:value"]
            }), null);
    },
    checkbox (prop = {}, children) {
        return (arg)=>{
            let _slot;
            return createVNode(Checkbox, mergeProps(prop, {
                "checked": arg.value,
                "onUpdate:checked": arg["onUpdate:value"]
            }), _isSlot(_slot = toVNodes(children)) ? _slot : {
                default: ()=>[
                        _slot
                    ]
            });
        };
    },
    button (prop = {}, children) {
        return ()=>{
            let _slot2;
            return createVNode(Button, prop, _isSlot(_slot2 = toVNodes(children)) ? _slot2 : {
                default: ()=>[
                        _slot2
                    ]
            });
        };
    },
    submitButton (prop = {}, children) {
        return this.button({
            ...prop,
            htmlType: "submit"
        }, children);
    }
};
function clone(obj) {
    return Object.assign({}, obj);
}
function toVNodes(vnodeArray) {
    if (!vnodeArray) return [];
    if (typeof vnodeArray[0] === "function") return vnodeArray.map((fn)=>fn());
    return vnodeArray;
}

function crudForm(option) {
    const model = reactive({});
    const forceUpdateCount = ref(0);
    let renderForm = createRenderForm();
    option = reactive(option);
    const componentArg = {
        index: -1,
        record: model
    };
    watch(option, ()=>{
        renderForm = createRenderForm();
        forceUpdateCount.value++;
    });
    return {
        model,
        render: ()=>createVNode("div", null, [
                renderForm(componentArg),
                createVNode("span", {
                    "style": {
                        display: "none"
                    }
                }, [
                    forceUpdateCount.value
                ])
            ]),
        option
    };
    function createRenderForm() {
        const columns = option.columns.filter((col)=>col.show !== false).map((col)=>{
            if (col.name) {
                if (!(col.name in model)) model[col.name] = col.defaultValue;
            }
            const render = ()=>col.component({
                    index: -1,
                    record: model,
                    value: col.name ? model[col.name] : undefined,
                    "onUpdate:value": (val)=>{
                        if (col.name) model[col.name] = val;
                    }
                });
            if (col.wrapFormItem !== false) {
                const formItem = crudComponent.formItem(col, [
                    render
                ]);
                return ()=>formItem({
                        index: -1,
                        record: model
                    });
            }
            return render;
        });
        return crudComponent.form(option.form, columns);
    }
}

export { crudComponent, crudForm };
