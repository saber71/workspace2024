import {
  DeleteFilled,
  EditFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import {
  Button,
  Form,
  type FormInstance,
  FormItem,
  Modal,
  Pagination,
  type PaginationProps,
  Space,
  Spin,
  Table,
  type TableColumnProps,
  type TableProps,
} from "ant-design-vue";
import {
  type VNodeChild,
  type Component as ComponentType,
  createVNode,
  isVNode,
} from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
  Mut,
  PropsWatcher,
  Computed,
  Watcher,
  BindThis,
  Link,
} from "vue-class";
import { ComponentVModal, mergeDefaultComponentProps } from "./component.ts";
import Layout from "./layout.tsx";
import * as AntComponent from "ant-design-vue";

export interface CrudProps extends VueComponentBaseProps {
  option: CrudOptions;
  dataSource?: any[] | PaginationResult;
}

@Component()
export class CrudInst extends VueComponent<CrudProps> {
  static readonly defineProps: ComponentProps<CrudProps> = [
    "inst",
    "option",
    "dataSource",
  ];

  private static _getModal(
    formModel: any,
    propName: string,
    componentName: string | undefined,
    modalName?: string,
  ) {
    if (!componentName) return {};
    if (!modalName)
      modalName = (ComponentVModal as any)[componentName] || "value";
    return {
      [modalName!]: formModel[propName],
      [`onUpdate:${modalName}`]: (val: any) => (formModel[propName] = val),
    };
  }

  @Link() readonly layoutInst: VueComponent;
  @Mut(true) layout: ComponentType;
  @Mut() formModel: any;
  @Mut() searchFormModel: any;
  @Mut() addFormModel: any;
  @Mut() editFormModel: any;
  @Mut() dataSource: any[] = [];
  @Mut() selectedRows: any[] = [];
  @Mut() tableColumnOptions: TableColumnProps[] = [];
  @Mut() curPage: number = 1;
  @Mut() pageSize: number = 10;
  @Mut() total: number = 0;
  @Mut() paginationOption?: PaginationProps;
  @Mut() renderFormElements: Array<RenderElement> = [];
  @Mut() renderSearchFormElements: Array<RenderElement> = [];
  @Mut() renderAddFormElements: Array<RenderElement> = [];
  @Mut() renderEditFormElements: Array<RenderElement> = [];
  @Mut() renderToolButtonElements: Array<RenderElement> = [];
  @Mut() visibleAddForm: boolean = false;
  @Mut() visibleEditForm: boolean = false;
  @Mut() loadingTable: boolean = false;

  @Computed() get openModal() {
    return this.visibleAddForm || this.visibleEditForm || false;
  }

  @Computed() get renderToolButtons(): RenderElement | undefined {
    if (this.renderToolButtonElements.length) {
      return () => (
        <Space>{this.renderToolButtonElements.map((item) => item())}</Space>
      );
    }
  }

  @Computed() get modalName() {
    let prefix = "";
    if (this.visibleAddForm) prefix = "新增";
    else if (this.visibleEditForm) prefix = "编辑";
    return prefix + (this.props.option.name ?? "");
  }

  get renderModal(): RenderElement | undefined {
    const onUpdateOpen = (val: boolean) =>
      (this.visibleEditForm = this.visibleAddForm = val);
    let fn: (e: MouseEvent) => void;
    if (this.visibleEditForm) fn = this._handleEdit;
    else if (this.visibleAddForm) fn = this._handleAdd;
    return () => (
      <Modal
        title={this.modalName}
        open={this.openModal}
        onUpdate:open={onUpdateOpen}
        onOk={fn}
      >
        {this.renderEditForm?.() ?? this.renderAddForm?.()}
      </Modal>
    );
  }

  @Computed() get renderPagination(): RenderElement | undefined {
    if (this.paginationOption)
      return () => (
        <Pagination
          {...mergeDefaultComponentProps("Pagination", this.paginationOption)}
        ></Pagination>
      );
  }

  @Computed() get renderTable(): RenderElement | undefined {
    const dataSource = this.dataSource;

    if (this.tableColumnOptions.length) {
      return () => {
        const props = mergeDefaultComponentProps(
          "Table",
          this.props.option.tableOption?.componentProps,
        );
        const rowSelection: TableProps["rowSelection"] = {
          onChange: (_, selectedRows) => {
            this.selectedRows = selectedRows || [];
          },
          selectedRowKeys: this.selectedRows.map(
            (item) => item[props.rowKey || "_id"],
          ),
        };
        return (
          <Spin spinning={this.loadingTable} tip={"Loading..."}>
            <Table
              {...props}
              columns={this.tableColumnOptions}
              dataSource={dataSource}
              rowSelection={rowSelection}
            ></Table>
          </Spin>
        );
      };
    }
  }

  @Computed() get renderForm(): RenderElement | undefined {
    if (this.renderFormElements.length)
      return () => (
        <Form
          model={this.formModel}
          {...mergeDefaultComponentProps(
            "Form",
            this.props.option.formOption?.componentProps,
          )}
        >
          {this.renderFormElements.map((fn) => fn())}
        </Form>
      );
  }

  @Computed() get renderAddForm(): RenderElement | undefined {
    if (this.renderAddFormElements.length)
      return () => (
        <Form
          ref={"addForm"}
          model={this.addFormModel}
          {...mergeDefaultComponentProps(
            "Form",
            this.props.option.formOption?.componentProps,
            this.props.option.addFormOption?.componentProps,
          )}
        >
          {this.renderAddFormElements.map((fn) => fn())}
        </Form>
      );
  }

  @Computed() get renderEditForm(): RenderElement | undefined {
    if (this.renderEditFormElements.length)
      return () => (
        <Form
          ref={"editForm"}
          model={this.editFormModel}
          {...mergeDefaultComponentProps(
            "Form",
            this.props.option.formOption?.componentProps,
            this.props.option.editFormOption?.componentProps,
          )}
        >
          {this.renderEditFormElements.map((fn) => fn())}
        </Form>
      );
  }

  @Computed() get renderSearchForm(): RenderElement | undefined {
    if (this.renderSearchFormElements.length)
      return () => (
        <Form
          model={this.searchFormModel}
          layout={"inline"}
          {...mergeDefaultComponentProps(
            "Form",
            this.props.option.formOption?.componentProps,
            this.props.option.searchFormOption?.componentProps,
          )}
        >
          {this.renderSearchFormElements.map((fn) => fn())}
        </Form>
      );
  }

  get showPagination() {
    if (this.props.option.tableOption?.paginationOption?.show === false)
      return false;
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

  @PropsWatcher({ immediate: true })
  @Watcher<CrudInst>({ source: ["curPage", "pageSize", "total"] })
  buildPagination() {
    if (this.showPagination) {
      this.paginationOption = {
        pageSize: this.pageSize,
        total: this.total,
        showSizeChanger: true,
        current: this.curPage,
        showTotal: () => `共 ${this.total} 条`,
        ...this.props.option.tableOption?.paginationOption,
      };
    } else {
      this.paginationOption = undefined;
    }
  }

  @PropsWatcher({ immediate: true })
  buildTableColumnOptions() {
    this.tableColumnOptions.length = 0;
    if (!this.showTable) return;
    const { crudColumnOptions } = this.props.option;
    for (let propName in crudColumnOptions) {
      const columnOption: CrudColumnOption = crudColumnOptions[propName];
      if (columnOption.tableOption?.show === false) continue;
      const componentName = columnOption.tableOption?.component;
      const componentFn =
        typeof componentName === "string"
          ? (AntComponent as any)[componentName]
          : componentName;
      const componentProps = columnOption.tableOption?.componentProps;
      const slots = columnOption.tableOption?.slots;
      const dict = columnOption.tableOption?.dict ?? columnOption.dict;
      const dataPropName = columnOption.tableOption?.dataPropName ?? "data";
      const vModal =
        columnOption.tableOption?.vModal ??
        ((ComponentVModal as any)[componentName] || "value");
      this.tableColumnOptions.push({
        title: columnOption.title,
        dataIndex: propName,
        customRender(data) {
          if (componentFn) {
            return isVNode(componentFn)
              ? componentFn
              : createVNode(
                  componentFn,
                  Object.assign(
                    {
                      [vModal]: data.value,
                      [`onUpdate:${vModal}`]: (val: any) =>
                        ((data.record as any)[propName] = val),
                    },
                    componentProps,
                    { [dataPropName]: data },
                  ),
                  slots,
                );
          }
          let value = data.value;
          if (dict) {
            const target = dict.data.value.find((item) => item.value === value);
            if (target) value = target.label;
          }
          return <div>{value || "--"}</div>;
        },
        ...this.props.option.tableOption?.tableColumnType,
        ...columnOption.tableOption?.tableColumnProps,
      });
    }
    this.tableColumnOptions.push({
      title: "操作",
      customRender: (data) => (
        <Space>
          <Button
            type={"link"}
            onClick={() => {
              this.editFormModel = Object.assign({}, data.record);
              this.visibleEditForm = true;
            }}
          >
            <EditFilled />
          </Button>
          <Button
            type={"link"}
            danger
            onClick={() => {
              this.selectedRows.length = 0;
              this.selectedRows.push(data.record);
              Modal.confirm({
                title: "是否删除选中的数据？",
                icon: <ExclamationCircleOutlined />,
                onOk: this._handleDelete,
              });
            }}
          >
            <DeleteFilled />
          </Button>
        </Space>
      ),
      width: 150,
      ...this.props.option.tableOption?.tableColumnType,
    });
  }

  @PropsWatcher({ immediate: true })
  buildToolButtons() {
    this.renderToolButtonElements.length = 0;
    if (!this.showTable) return;
    const toolButtons = Object.assign({}, this.props.option.toolButtons);
    const addButton: ToolButtonOption = {
      text: "新增",
      component: "Button",
      componentProps: {
        type: "primary",
        onClick: () => (this.visibleAddForm = true),
      },
    };
    const batchDeleteButton: ToolButtonOption = {
      text: "批量删除",
      component: "Button",
      componentProps: {
        type: "primary",
        danger: true,
        onClick: () => {
          Modal.confirm({
            title: `是否删除选中的${this.selectedRows.length}条数据？`,
            icon: <ExclamationCircleOutlined />,
            onOk: this._handleDelete,
          });
        },
      },
    };
    if (!toolButtons.add) toolButtons.add = addButton;
    if (!toolButtons.batchDelete) toolButtons.batchDelete = batchDeleteButton;
    for (let key in toolButtons) {
      const buttonOption = toolButtons[key];
      const componentName = buttonOption.component;
      const componentFn =
        typeof componentName === "string"
          ? (AntComponent as any)[componentName]
          : componentName;
      this.renderToolButtonElements.push(() =>
        isVNode(componentFn)
          ? componentFn
          : createVNode(
              componentFn,
              Object.assign(
                {
                  disabled:
                    key === "batchDelete" && this.selectedRows.length === 0,
                },
                buttonOption.componentProps,
              ),
              () => buttonOption.text,
            ),
      );
    }
  }

  @PropsWatcher({ immediate: true })
  buildFormModel() {
    this.renderFormElements.length = 0;
    if (!this.showForm || this.showTable) {
      this.formModel = undefined;
      return;
    }
    if (!this.formModel) this.formModel = {};
    this._buildFormModel(this.formModel, "formOption", this.renderFormElements);
  }

  @PropsWatcher({ immediate: true })
  @Watcher({ source: ["visibleAddForm"] })
  buildAddFormModel() {
    this.renderAddFormElements.length = 0;
    if (!this.showAddForm || !this.visibleAddForm) {
      this.addFormModel = undefined;
      return;
    }
    if (!this.addFormModel) this.addFormModel = {};
    this._buildFormModel(
      this.addFormModel,
      "addFormOption",
      this.renderAddFormElements,
    );
  }

  @PropsWatcher({ immediate: true })
  @Watcher({ source: ["visibleEditForm"] })
  buildEditFormModel() {
    this.renderEditFormElements.length = 0;
    if (!this.showEditForm || !this.visibleEditForm) {
      this.editFormModel = undefined;
      return;
    }
    if (!this.editFormModel) this.editFormModel = {};
    this._buildFormModel(
      this.editFormModel,
      "editFormOption",
      this.renderEditFormElements,
    );
  }

  @PropsWatcher({ immediate: true })
  buildSearchFormModel() {
    this.renderSearchFormElements.length = 0;
    if (!this.showSearchForm || !this.showTable) {
      this.searchFormModel = undefined;
      return;
    }
    if (!this.searchFormModel) this.searchFormModel = {};
    this._buildFormModel(
      this.searchFormModel,
      "searchFormOption",
      this.renderSearchFormElements,
      false,
      {
        onSearch: this.handleSearch,
      },
      "InputSearch",
    );
  }

  @PropsWatcher({ immediate: true })
  @BindThis()
  async handleSearch() {
    console.log("search");
    if (this.props.dataSource) {
      this.dataSource =
        this.props.dataSource instanceof Array
          ? this.props.dataSource
          : this.props.dataSource.data;
    } else {
      this.loadingTable = true;
      const searchResult = await this.props.option.request?.search(
        this.searchFormModel,
      );
      this.dataSource = searchResult?.data ?? [];
      this.curPage = searchResult?.curPage ?? 1;
      this.pageSize = searchResult?.pageSize ?? 10;
      this.total = searchResult?.total ?? 0;
      this.loadingTable = false;
    }
  }

  @PropsWatcher({ immediate: true })
  setLayout() {
    const option = this.props.option;
    this.layout = option.layout ?? Layout;
  }

  render(): VNodeChild {
    return createVNode(this.layout, {
      searchForm: this.renderSearchForm,
      toolButtons: this.renderToolButtons,
      table: this.renderTable,
      pagination: this.renderPagination,
      modal: this.renderModal,
      form: this.renderForm,
      inst: "layoutInst",
    });
  }

  @BindThis()
  private _handleAdd() {
    (this.layoutInst.vueInstance.refs.addForm as FormInstance)
      .validate()
      .then(async () => {
        await this.props.option.request?.add(this.addFormModel);
        this.visibleAddForm = false;
        await this.handleSearch();
      });
  }

  @BindThis()
  private _handleEdit() {
    (this.layoutInst.vueInstance.refs.editForm as FormInstance)
      .validate()
      .then(async () => {
        await this.props.option.request?.edit(this.editFormModel);
        this.visibleEditForm = false;
        await this.handleSearch();
      });
  }

  @BindThis()
  private async _handleDelete() {
    await this.props.option.request?.delete(this.selectedRows);
    await this.handleSearch();
  }

  private _buildFormModel(
    form: any,
    formOptionName:
      | "addFormOption"
      | "searchFormOption"
      | "editFormOption"
      | "formOption",
    renderElements: RenderElement[],
    defaultShowInForm: boolean = true,
    defaultComponentProps: object = {},
    defaultComponentName: string = "Input",
  ) {
    const { crudColumnOptions } = this.props.option;
    for (let propName in crudColumnOptions) {
      const columnOption: CrudColumnOption = crudColumnOptions[propName];
      const formOption = columnOption[formOptionName];
      let componentName =
        formOption?.component ?? columnOption.formOption?.component;
      const showInForm =
        formOption?.show ?? columnOption.formOption?.show ?? defaultShowInForm;
      if (!showInForm) {
        delete form[propName];
      } else {
        if (!(propName in form))
          form[propName] = formOption?.value ?? columnOption.formOption?.value;
        if (!componentName) componentName = defaultComponentName;
      }
      if (componentName) {
        let componentProps =
          formOption?.componentProps ?? columnOption.formOption?.componentProps;
        const componentFn =
          typeof componentName === "string"
            ? (AntComponent as any)[componentName]
            : componentName;
        const vModal = formOption?.vModal ?? columnOption.formOption?.vModal;
        const slots = formOption?.slots ?? columnOption.formOption?.slots;
        const dict = formOption?.dict ?? columnOption.dict;
        const dictOption =
          formOption?.dictOption ?? columnOption.dictOption ?? "options";
        const createComponent = () => {
          return isVNode(componentFn)
            ? componentFn
            : createVNode(
                componentFn,
                mergeDefaultComponentProps(
                  componentName,
                  defaultComponentProps,
                  {
                    [dictOption]: dict?.data.value,
                    form,
                  },
                  componentProps,
                  CrudInst._getModal(form, propName, componentName, vModal),
                ),
                slots,
              );
        };
        if (
          formOption?.wrapFormItem ??
          columnOption.formOption?.wrapFormItem ??
          showInForm
        ) {
          renderElements.push(() => (
            <FormItem
              name={propName}
              label={columnOption.title}
              {...mergeDefaultComponentProps(
                "FormItem",
                columnOption.formOption?.formItemProps,
                formOption?.formItemProps,
              )}
            >
              {createComponent()}
            </FormItem>
          ));
        } else {
          renderElements.push(createComponent);
        }
      }
    }
  }
}

export default toNative<CrudProps>(CrudInst);
