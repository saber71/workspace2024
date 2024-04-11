import { createVNode, isVNode, mergeProps, ref } from 'vue';
import * as AntComponent from 'ant-design-vue';
import { Space, Flex, Pagination, Table, Form, FormItem } from 'ant-design-vue';
import { Component, toNative, VueComponent, Mut, Computed, PropsWatcher, Watcher } from 'vue-class';

const DefaultComponentProps = {
    Input: {
        allowClear: true,
        placeholder: "请输入"
    },
    InputNumber: {
        placeholder: "请输入"
    },
    InputPassword: {
        allowClear: true,
        placeholder: "请输入"
    },
    FormItem: {
        validateFirst: true
    },
    Table: {
        pagination: false
    }
};
const ComponentVModal = {
    Input: "value",
    InputPassword: "value",
    InputNumber: "value",
    Cascader: "value",
    Checkbox: "checked",
    AutoComplete: "value",
    Radio: "checked",
    Rate: "value",
    TimeRangePicker: "value",
    Table: "value",
    TimePicker: "value",
    Transfer: "selectedKeys",
    TreeSelect: "value",
    Select: "value",
    Slider: "value",
    Switch: "checked",
    Button: "",
    FormItem: "",
    Form: "",
    Pagination: "",
    DatePicker: "value",
    Upload: "fileList",
    Mentions: "value"
};
function mergeDefaultComponentProps(componentName, ...props) {
    if (!componentName) return Object.assign({}, ...props);
    const defaultProps = DefaultComponentProps[componentName];
    if (!defaultProps) return Object.assign({}, ...props);
    return Object.assign({}, defaultProps, ...props);
}

var _dec$1, _class$1, _LayoutInst;
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
function _isSlot$1(s) {
    return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !isVNode(s);
}
let LayoutInst = (_dec$1 = Component(), _dec$1(_class$1 = (_LayoutInst = class LayoutInst extends VueComponent {
    render() {
        let _slot;
        const { searchForm, buttons, table, pagination } = this.props;
        const defaults = this.props.default;
        return createVNode(Space, {
            "direction": "vertical"
        }, {
            default: ()=>[
                    searchForm || buttons ? createVNode(Flex, {
                        "justify": "space-between",
                        "style": "flex-shrink:0;"
                    }, {
                        default: ()=>[
                                createVNode("div", null, [
                                    searchForm?.()
                                ]),
                                createVNode("div", null, [
                                    buttons?.()
                                ])
                            ]
                    }) : null,
                    table ? createVNode("div", {
                        "style": "flex-grow:1;position:relative;"
                    }, [
                        table()
                    ]) : null,
                    pagination ? createVNode(Flex, {
                        "justify": "flex-end",
                        "style": "flex-shrink:0;"
                    }, _isSlot$1(_slot = pagination()) ? _slot : {
                        default: ()=>[
                                _slot
                            ]
                    }) : null,
                    defaults ? createVNode("div", {
                        "style": "position:absolute;"
                    }, [
                        defaults()
                    ]) : null
                ]
        });
    }
}, _defineProperty$1(_LayoutInst, "defineProps", [
    "inst",
    "searchForm",
    "buttons",
    "table",
    "pagination",
    "default"
]), _LayoutInst)) || _class$1);
const Layout = toNative(LayoutInst);

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _CrudInst;
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
function _isSlot(s) {
    return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !isVNode(s);
}
let CrudInst = (_dec = Component(), _dec2 = Mut(true), _dec3 = Mut(), _dec4 = Mut(), _dec5 = Mut(), _dec6 = Mut(), _dec7 = Mut(), _dec8 = Mut(), _dec9 = Mut(), _dec10 = Mut(), _dec11 = Mut(), _dec12 = Mut(), _dec13 = Mut(), _dec14 = Mut(), _dec15 = Mut(), _dec16 = Mut(), _dec17 = Mut(), _dec18 = Mut(), _dec19 = Mut(), _dec20 = Mut(), _dec21 = Mut(), _dec22 = Computed(), _dec23 = Computed(), _dec24 = Computed(), _dec25 = Computed(), _dec26 = Computed(), _dec27 = PropsWatcher({
    immediate: true
}), _dec28 = Watcher({
    source: [
        "curPage",
        "pageSize",
        "total"
    ]
}), _dec29 = PropsWatcher({
    immediate: true
}), _dec30 = PropsWatcher({
    immediate: true
}), _dec31 = PropsWatcher({
    immediate: true
}), _dec32 = PropsWatcher({
    immediate: true
}), _dec33 = PropsWatcher({
    immediate: true
}), _dec34 = PropsWatcher({
    immediate: true
}), _dec35 = PropsWatcher({
    immediate: true
}), _dec(_class = (_class2 = (_CrudInst = class CrudInst extends VueComponent {
    constructor(...args){
        super(...args);
        _initializerDefineProperty(this, "layout", _descriptor, this);
        _initializerDefineProperty(this, "formModel", _descriptor2, this);
        _initializerDefineProperty(this, "searchFormModel", _descriptor3, this);
        _initializerDefineProperty(this, "addFormModel", _descriptor4, this);
        _initializerDefineProperty(this, "editFormModel", _descriptor5, this);
        _initializerDefineProperty(this, "dataSource", _descriptor6, this);
        _initializerDefineProperty(this, "tableColumnOptions", _descriptor7, this);
        _initializerDefineProperty(this, "curPage", _descriptor8, this);
        _initializerDefineProperty(this, "pageSize", _descriptor9, this);
        _initializerDefineProperty(this, "total", _descriptor10, this);
        _initializerDefineProperty(this, "paginationOption", _descriptor11, this);
        _initializerDefineProperty(this, "renderButtons", _descriptor12, this);
        _initializerDefineProperty(this, "renderFormElements", _descriptor13, this);
        _initializerDefineProperty(this, "renderSearchFormElements", _descriptor14, this);
        _initializerDefineProperty(this, "renderAddFormElements", _descriptor15, this);
        _initializerDefineProperty(this, "renderEditFormElements", _descriptor16, this);
        _initializerDefineProperty(this, "visibleAddForm", _descriptor17, this);
        _initializerDefineProperty(this, "visibleEditForm", _descriptor18, this);
    }
    static _getModal(formModel, propName, componentName, modalName) {
        if (!componentName) return {};
        if (!modalName) modalName = ComponentVModal[componentName] || "value";
        return {
            [modalName]: formModel[propName],
            [`onUpdate:${modalName}`]: (val)=>formModel[propName] = val
        };
    }
    get renderDefault() {
        const { renderForm } = this;
        if (!this.showTable && this.showForm) return renderForm;
    }
    get renderPagination() {
        if (this.paginationOption) return ()=>createVNode(Pagination, mergeDefaultComponentProps("Pagination", this.paginationOption), null);
    }
    get renderTable() {
        const dataSource = this.dataSource;
        if (this.tableColumnOptions.length) return ()=>createVNode(Table, mergeProps(mergeDefaultComponentProps("Table", this.props.option.tableOption?.componentProps), {
                "columns": this.tableColumnOptions,
                "dataSource": dataSource,
                "style": "position: absolute;left: 0;top: 0;"
            }), null);
    }
    get renderForm() {
        if (this.renderFormElements.length) return ()=>{
            let _slot;
            return createVNode(Form, mergeDefaultComponentProps("Form", this.props.option.formOption?.componentProps), _isSlot(_slot = this.renderFormElements.map((fn)=>fn())) ? _slot : {
                default: ()=>[
                        _slot
                    ]
            });
        };
    }
    get renderAddForm() {
        if (this.renderAddFormElements.length) return ()=>{
            let _slot2;
            return createVNode(Form, mergeDefaultComponentProps("Form", this.props.option.formOption?.componentProps, this.props.option.addFormOption?.componentProps), _isSlot(_slot2 = this.renderAddFormElements.map((fn)=>fn())) ? _slot2 : {
                default: ()=>[
                        _slot2
                    ]
            });
        };
    }
    get renderEditForm() {
        if (this.renderEditFormElements.length) return ()=>{
            let _slot3;
            return createVNode(Form, mergeDefaultComponentProps("Form", this.props.option.formOption?.componentProps, this.props.option.editFormOption?.componentProps), _isSlot(_slot3 = this.renderEditFormElements.map((fn)=>fn())) ? _slot3 : {
                default: ()=>[
                        _slot3
                    ]
            });
        };
    }
    get renderSearchForm() {
        if (this.renderSearchFormElements.length) return ()=>{
            let _slot4;
            return createVNode(Form, mergeDefaultComponentProps("Form", this.props.option.formOption?.componentProps, this.props.option.searchFormOption?.componentProps), _isSlot(_slot4 = this.renderSearchFormElements.map((fn)=>fn())) ? _slot4 : {
                default: ()=>[
                        _slot4
                    ]
            });
        };
    }
    get showPagination() {
        if (this.props.option.tableOption?.paginationOption?.show === false) return false;
        if (this.props.dataSource) return !(this.props.dataSource instanceof Array);
        return this.showTable;
    }
    get showForm() {
        return this.props.option.formOption?.show ?? true;
    }
    get showAddForm() {
        return this.props.option.addFormOption?.show ?? true;
    }
    get showEditForm() {
        return this.props.option.editFormOption?.show ?? true;
    }
    get showSearchForm() {
        return this.props.option.searchFormOption?.show ?? true;
    }
    get showTable() {
        return this.props.option.tableOption?.show ?? true;
    }
    buildPagination() {
        if (this.showPagination) {
            this.paginationOption = {
                pageSize: this.pageSize,
                total: this.total,
                showSizeChanger: true,
                current: this.curPage,
                showTotal: ()=>`共 ${this.total} 条`,
                ...this.props.option.tableOption?.paginationOption
            };
        } else {
            this.paginationOption = undefined;
        }
    }
    buildTableColumnOptions() {
        this.tableColumnOptions.length = 0;
        if (!this.showTable) return;
        const { crudColumnOptions } = this.props.option;
        for(let propName in crudColumnOptions){
            const columnOption = crudColumnOptions[propName];
            let componentName = columnOption.tableOption?.component;
            const componentProps = columnOption.tableOption?.componentProps;
            if (columnOption.tableOption?.show === false) continue;
            const dict = columnOption.tableOption?.dict ?? columnOption.dict;
            const dataPropName = columnOption.tableOption?.dataPropName ?? "data";
            this.tableColumnOptions.push({
                title: columnOption.title,
                dataIndex: propName,
                customRender (data) {
                    if (componentName) return createVNode(componentName, Object.assign({}, componentProps, {
                        [dataPropName]: data
                    }));
                    let value = data.value;
                    if (dict) {
                        const target = dict.data.value.find((item)=>item.value === value);
                        if (target) value = target.label;
                    }
                    return createVNode("div", null, [
                        value ?? "--"
                    ]);
                },
                ...this.props.option.tableOption?.tableColumnType,
                ...columnOption.tableOption?.tableColumnProps
            });
        }
    }
    buildFormModel() {
        this.renderFormElements.length = 0;
        if (!this.showForm || this.showTable) {
            this.formModel = undefined;
            return;
        }
        if (!this.formModel) this.formModel = {};
        this._buildFormModel(this.formModel, "formOption", this.renderFormElements);
    }
    buildAddFormModel() {
        this.renderAddFormElements.length = 0;
        if (!this.showAddForm || !this.visibleAddForm) {
            this.addFormModel = undefined;
            return;
        }
        if (!this.addFormModel) this.addFormModel = {};
        this._buildFormModel(this.addFormModel, "addFormOption", this.renderAddFormElements);
    }
    buildEditFormModel() {
        this.renderEditFormElements.length = 0;
        if (!this.showEditForm || !this.visibleEditForm) {
            this.editFormModel = undefined;
            return;
        }
        if (!this.editFormModel) this.editFormModel = {};
        this._buildFormModel(this.editFormModel, "editFormOption", this.renderEditFormElements);
    }
    buildSearchFormModel() {
        this.renderSearchFormElements.length = 0;
        if (!this.showSearchForm || !this.showTable) {
            this.searchFormModel = undefined;
            return;
        }
        if (!this.searchFormModel) this.searchFormModel = {};
        this._buildFormModel(this.searchFormModel, "searchFormOption", this.renderSearchFormElements);
    }
    setDataSource() {
        if (this.props.dataSource) {
            this.dataSource = this.props.dataSource instanceof Array ? this.props.dataSource : this.props.dataSource.data;
        }
    }
    setLayout() {
        const option = this.props.option;
        this.layout = option.layout ?? Layout;
    }
    render() {
        return createVNode(this.layout, {
            searchForm: this.renderSearchForm,
            buttons: this.renderButtons,
            table: this.renderTable,
            pagination: this.renderPagination,
            default: this.renderDefault
        });
    }
    _buildFormModel(form, formOptionName, renderElements) {
        const { crudColumnOptions } = this.props.option;
        for(let propName in crudColumnOptions){
            const columnOption = crudColumnOptions[propName];
            const formOption = columnOption[formOptionName];
            let componentName = formOption?.component ?? columnOption.formOption?.component;
            if ((formOption?.show ?? columnOption.formOption?.show) === false) {
                delete form[propName];
            } else {
                if (!(propName in form)) form[propName] = formOption?.value ?? columnOption.formOption?.value;
                if (!componentName) componentName = "Input";
            }
            if (componentName) {
                let componentProps = formOption?.componentProps ?? columnOption.formOption?.componentProps;
                const componentFn = typeof componentName === "string" ? AntComponent[componentName] : componentName;
                const vModal = formOption?.vModal ?? columnOption.formOption?.vModal;
                const dict = formOption?.dict ?? columnOption.dict;
                const dictOption = formOption?.dictOption ?? columnOption.dictOption ?? "options";
                const createComponent = ()=>{
                    return createVNode(componentFn, mergeDefaultComponentProps(componentName, {
                        [dictOption]: dict?.data.value
                    }, componentProps, CrudInst._getModal(form, propName, componentName, vModal)));
                };
                if ((formOption?.wrapFormItem ?? columnOption.formOption?.wrapFormItem) !== false) {
                    renderElements.push(()=>{
                        let _slot5;
                        return createVNode(FormItem, mergeProps({
                            "name": propName,
                            "label": columnOption.title
                        }, mergeDefaultComponentProps("FormItem", columnOption.formOption?.formItemProps, formOption?.formItemProps)), _isSlot(_slot5 = createComponent()) ? _slot5 : {
                            default: ()=>[
                                    _slot5
                                ]
                        });
                    });
                } else {
                    renderElements.push(createComponent);
                }
            }
        }
    }
}, _defineProperty(_CrudInst, "defineProps", [
    "inst",
    "option",
    "dataSource"
]), _CrudInst), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "layout", [
    _dec2
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "formModel", [
    _dec3
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "searchFormModel", [
    _dec4
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "addFormModel", [
    _dec5
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "editFormModel", [
    _dec6
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "dataSource", [
    _dec7
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return [];
    }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "tableColumnOptions", [
    _dec8
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return [];
    }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "curPage", [
    _dec9
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return 1;
    }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "pageSize", [
    _dec10
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return 10;
    }
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "total", [
    _dec11
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return 0;
    }
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "paginationOption", [
    _dec12
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
}), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "renderButtons", [
    _dec13
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
}), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "renderFormElements", [
    _dec14
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return [];
    }
}), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "renderSearchFormElements", [
    _dec15
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return [];
    }
}), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "renderAddFormElements", [
    _dec16
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return [];
    }
}), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "renderEditFormElements", [
    _dec17
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return [];
    }
}), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "visibleAddForm", [
    _dec18
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return false;
    }
}), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "visibleEditForm", [
    _dec19
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return false;
    }
}), _applyDecoratedDescriptor(_class2.prototype, "renderDefault", [
    _dec20
], Object.getOwnPropertyDescriptor(_class2.prototype, "renderDefault"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "renderPagination", [
    _dec21
], Object.getOwnPropertyDescriptor(_class2.prototype, "renderPagination"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "renderTable", [
    _dec22
], Object.getOwnPropertyDescriptor(_class2.prototype, "renderTable"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "renderForm", [
    _dec23
], Object.getOwnPropertyDescriptor(_class2.prototype, "renderForm"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "renderAddForm", [
    _dec24
], Object.getOwnPropertyDescriptor(_class2.prototype, "renderAddForm"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "renderEditForm", [
    _dec25
], Object.getOwnPropertyDescriptor(_class2.prototype, "renderEditForm"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "renderSearchForm", [
    _dec26
], Object.getOwnPropertyDescriptor(_class2.prototype, "renderSearchForm"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "buildPagination", [
    _dec27,
    _dec28
], Object.getOwnPropertyDescriptor(_class2.prototype, "buildPagination"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "buildTableColumnOptions", [
    _dec29
], Object.getOwnPropertyDescriptor(_class2.prototype, "buildTableColumnOptions"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "buildFormModel", [
    _dec30
], Object.getOwnPropertyDescriptor(_class2.prototype, "buildFormModel"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "buildAddFormModel", [
    _dec31
], Object.getOwnPropertyDescriptor(_class2.prototype, "buildAddFormModel"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "buildEditFormModel", [
    _dec32
], Object.getOwnPropertyDescriptor(_class2.prototype, "buildEditFormModel"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "buildSearchFormModel", [
    _dec33
], Object.getOwnPropertyDescriptor(_class2.prototype, "buildSearchFormModel"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "setDataSource", [
    _dec34
], Object.getOwnPropertyDescriptor(_class2.prototype, "setDataSource"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "setLayout", [
    _dec35
], Object.getOwnPropertyDescriptor(_class2.prototype, "setLayout"), _class2.prototype), _class2)) || _class);
const Crud = toNative(CrudInst);

function dict(option) {
    return {
        reload () {
            if (option.getData) {
                option.getData().then((data)=>this.data.value = wrapData(data));
            } else if (option.data) {
                this.data.value = wrapData(option.data);
            } else {
                this.data.value.length = 0;
            }
            function wrapData(data) {
                if (option.label || option.value) return data.map((item)=>({
                        label: item[option.label || "label"],
                        value: item[option.value || "value"]
                    }));
                return data;
            }
        },
        data: ref([])
    };
}

///<reference types="../types.d.ts"/>

export { ComponentVModal, CrudInst, DefaultComponentProps, LayoutInst, Crud as default, dict, mergeDefaultComponentProps };
