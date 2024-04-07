import { ref, reactive, createVNode, mergeProps, isVNode } from 'vue';
import { Space, Flex, Form, FormItem, Input, InputNumber, InputPassword, Checkbox, Button, Select, SelectOption, Table, Pagination } from 'ant-design-vue';

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
            if (result.show === undefined) result.show = true;
            if (result.ellipsis === undefined) result.ellipsis = true;
            if (result.align === undefined) result.align = "center";
            if (!result.customRender) {
                if (!result.component) result.component = crudComponent.renderPlaceholder();
                result.customRender = (data)=>result.component(data);
            }
            return result;
        }).filter((col)=>col.show);
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
    commonLayout () {
        return (arg)=>createVNode(Space, {
                "direction": "vertical",
                "style": {
                    height: "100%"
                }
            }, {
                default: ()=>[
                        createVNode(Flex, {
                            "justify": "space-between",
                            "style": {
                                flexShrink: 0
                            }
                        }, {
                            default: ()=>[
                                    arg.searchForm?.() ?? createVNode("div", null, null),
                                    arg.buttons?.() ?? createVNode("div", null, null)
                                ]
                        }),
                        createVNode("div", {
                            "style": {
                                flexGrow: 1
                            }
                        }, [
                            arg.table?.()
                        ]),
                        createVNode(Flex, {
                            "justify": "flex-end",
                            "style": {
                                flexShrink: 0
                            }
                        }, {
                            default: ()=>[
                                    arg.pagination?.()
                                ]
                        }),
                        arg.default?.()
                    ]
            });
    },
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
        if (prop.pagination === undefined) prop.pagination = false;
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
    },
    pagination (prop = {}) {
        if (prop.showTotal === undefined) prop.showTotal = (total)=>`共 ${total} 项`;
        return (arg)=>createVNode(Pagination, mergeProps(prop, {
                "total": arg.record.total,
                "showSizeChanger": true,
                "onUpdate:pageSize": arg.record["onUpdate:pageSize"]
            }), null);
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

function crud(option) {
    let layoutComponentArg;
    const searchFormModel = ref({});
    const dataSource = ref([]);
    const pagination = reactive({
        curPage: 1,
        pageSize: 10,
        total: 0,
        "onUpdate:pageSize": ()=>crud.notifySearch()
    });
    const crud = {
        option,
        update () {
            if (!option.layout) option.layout = crudComponent.commonLayout();
            layoutComponentArg = {};
            createButtons();
            createSearchForm();
            createTable();
            createPagination();
        },
        render: ()=>option.layout(layoutComponentArg),
        notifySearch () {}
    };
    crud.update();
    return crud;
    function createPagination() {
        if (option.pagination?.show !== false) {
            const componentArg = {
                index: -1,
                record: pagination
            };
            const renderPagination = crudComponent.pagination(option.pagination);
            layoutComponentArg.pagination = ()=>renderPagination(componentArg);
        }
    }
    function createTable() {
        const columns = option.columns.map((col)=>{
            const result = Object.assign({
                title: col.title,
                dataIndex: col.prop,
                show: true
            }, col.table);
            return result;
        }).filter((col)=>col.show);
        if (columns.length && option.table?.show !== false) {
            if (option.tableOperation !== false) {
                const operationColumn = Object.assign({
                    title: "操作"
                }, option.tableOperation);
                columns.push(operationColumn);
            }
            const renderTable = crudComponent.crudTable({
                columns,
                table: {
                    ...option.table,
                    pagination: false
                }
            });
            const componentArg = {
                index: -1,
                record: null,
                get value () {
                    return dataSource;
                }
            };
            layoutComponentArg.table = ()=>renderTable(componentArg);
        }
    }
    function createSearchForm() {
        const formColumns = option.columns.map((col, index)=>{
            const searchForm = Object.assign({
                name: col.prop,
                show: true,
                component: crudComponent.input()
            }, option.columns[index].form, col.searchForm);
            return searchForm;
        }).filter((col)=>col.show);
        if (formColumns.length) {
            const renderForm = crudComponent.crudForm({
                columns: formColumns,
                form: {
                    layout: "inline",
                    ...option.form,
                    ...option.searchForm
                }
            }, true);
            const componentArg = {
                index: -1,
                get record () {
                    return searchFormModel.value;
                }
            };
            layoutComponentArg.searchForm = ()=>renderForm(componentArg);
        }
    }
    function createButtons() {
        const addButtonOption = Object.assign({
            show: true,
            text: "新增",
            type: "primary"
        }, option.buttons?.add);
        const deleteButtonOption = Object.assign({
            show: true,
            text: "批量删除",
            danger: true
        }, option.buttons?.delete);
        if (addButtonOption.show || deleteButtonOption.show) {
            const renderButtons = [];
            if (addButtonOption.show) renderButtons.push(crudComponent.button(addButtonOption, addButtonOption.text));
            if (deleteButtonOption.show) renderButtons.push(crudComponent.button(deleteButtonOption, deleteButtonOption.text));
            const componentArg = {
                record: null,
                index: -1
            };
            layoutComponentArg.buttons = ()=>createVNode("div", null, [
                    renderButtons.map((component)=>component(componentArg))
                ]);
        }
    }
}

export { crud, crudComponent, crudForm, crudTable };
