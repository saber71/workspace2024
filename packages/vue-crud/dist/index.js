import { ref, reactive, createVNode, mergeProps, isVNode } from 'vue';
import { Form, FormItem, Input, InputNumber, InputPassword, Checkbox, Button, Select, SelectOption, Table } from 'ant-design-vue';

function crudForm(option) {
    const forceUpdateCount = ref(0);
    const forceUpdate = ()=>forceUpdateCount.value++;
    let model = reactive(option.model ?? {});
    option.model = model;
    let renderForm = createRenderForm();
    const componentArg = {
        index: -1,
        record: model
    };
    return {
        get model () {
            return model;
        },
        render: ()=>createVNode("div", option.attr, [
                renderForm(componentArg),
                createVNode("span", {
                    "style": {
                        display: "none"
                    }
                }, [
                    forceUpdateCount.value
                ])
            ]),
        option,
        update () {
            option.model = model = reactive(option.model ?? model);
            renderForm = createRenderForm();
            forceUpdate();
        }
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
        return crudComponent.form(option.form, columns, true);
    }
}

function crudTable(option) {
    const forceUpdateCount = ref(0);
    const forceUpdate = ()=>forceUpdateCount.value++;
    let dataSource = setDataSource();
    const componentArg = {
        index: -1,
        record: dataSource
    };
    let renderTable = createRenderTable();
    return {
        option,
        render: ()=>createVNode("div", option.attr, [
                renderTable(componentArg),
                createVNode("span", {
                    "style": {
                        display: "none"
                    }
                }, [
                    forceUpdateCount.value
                ])
            ]),
        update () {
            dataSource = setDataSource();
            renderTable = createRenderTable();
            forceUpdate();
        },
        get dataSource () {
            return dataSource;
        }
    };
    function setDataSource() {
        let dataSource;
        if (option.dataSource instanceof Array) dataSource = option.dataSource;
        else dataSource = option.dataSource.data;
        return reactive(dataSource);
    }
    function createRenderTable() {
        const columns = option.columns.map((col)=>{
            const result = Object.assign({}, col);
            if (result.ellipsis === undefined) result.ellipsis = true;
            if (result.align === undefined) result.align = "center";
            if (!result.customRender) {
                if (!result.component) result.component = crudComponent.renderPlaceholder();
                result.customRender = (data)=>result.component(data);
            }
            return result;
        });
        return crudComponent.table({
            ...option.table,
            columns,
            dataSource
        });
    }
}

function _isSlot(s) {
    return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !isVNode(s);
}
const crudComponent = {
    crudForm (option, recordAsModel) {
        return (arg)=>{
            const model = recordAsModel ? arg.record : arg.value;
            const form = crudForm({
                ...option,
                model
            });
            return form.render();
        };
    },
    crudTable (option) {
        return (arg)=>{
            const dataSource = arg.value;
            const table = crudTable({
                ...option,
                dataSource
            });
            return table.render();
        };
    },
    form (prop = {}, children, recordAsModel) {
        return (arg)=>{
            let _slot;
            return createVNode(Form, mergeProps(prop, {
                "model": recordAsModel ? arg.record : arg.value
            }), _isSlot(_slot = toVNodes(children)) ? _slot : {
                default: ()=>[
                        _slot
                    ]
            });
        };
    },
    formItem (prop = {}, children) {
        prop = clone(prop);
        if (prop.validateFirst === undefined) prop.validateFirst = true;
        prop = Object.assign({}, prop);
        delete prop.prop;
        return ()=>{
            let _slot2;
            return createVNode(FormItem, prop, _isSlot(_slot2 = toVNodes(children)) ? _slot2 : {
                default: ()=>[
                        _slot2
                    ]
            });
        };
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
            let _slot3;
            return createVNode(Checkbox, mergeProps(prop, {
                "checked": arg.value,
                "onUpdate:checked": arg["onUpdate:value"]
            }), _isSlot(_slot3 = toVNodes(children)) ? _slot3 : {
                default: ()=>[
                        _slot3
                    ]
            });
        };
    },
    button (prop = {}, children) {
        return (arg)=>{
            let _slot4;
            return createVNode(Button, prop, _isSlot(_slot4 = toVNodes(children ?? arg.value)) ? _slot4 : {
                default: ()=>[
                        _slot4
                    ]
            });
        };
    },
    submitButton (prop = {}, children) {
        return this.button({
            ...prop,
            htmlType: "submit"
        }, children);
    },
    select (prop = {}, options) {
        return (arg)=>createVNode(Select, mergeProps(prop, {
                "value": arg.value,
                "onUpdate:value": arg["onUpdate:value"]
            }), {
                default: ()=>[
                        options?.map((item)=>createVNode(SelectOption, {
                                "value": item.value,
                                "disabled": item.disabled
                            }, {
                                default: ()=>[
                                        item.label
                                    ]
                            }))
                    ]
            });
    },
    table (prop = {}, recordAsDataSource = true) {
        prop = clone(prop);
        if (prop.rowKey === undefined) prop.rowKey = "_id";
        return (arg)=>createVNode(Table, mergeProps(prop, {
                "dataSource": recordAsDataSource ? arg.record : arg.value
            }), null);
    },
    renderPlaceholder (attr = {}, placeholder = "--") {
        return (arg)=>{
            let value;
            if (arg.value === undefined || arg.value === null || arg.value === "") value = placeholder;
            else value = arg.value;
            return createVNode("span", attr, [
                value
            ]);
        };
    }
};
function clone(obj) {
    return Object.assign({}, obj);
}
function toVNodes(vnodeArray) {
    if (!vnodeArray) return null;
    if (vnodeArray instanceof Array) {
        if (typeof vnodeArray[0] === "function") return vnodeArray.map((fn)=>fn());
        return vnodeArray;
    }
    return [
        vnodeArray
    ];
}

export { crudComponent, crudForm, crudTable };
