import {
  Form,
  FormItem,
  Pagination,
  type PaginationProps,
  Table,
  type TableColumnProps,
} from "ant-design-vue";
import {
  type VNodeChild,
  type Component as ComponentType,
  createVNode,
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
} from "vue-class";
import { ComponentVModal, mergeDefaultComponentProps } from "./component.ts";
import Layout from "./layout.tsx";
import * as AntComponent from "ant-design-vue";

export interface CrudProps extends VueComponentBaseProps {
  option: CrudOptions;
  dataSource?: any[] | PaginationResult;
}

type RenderElement = () => VNodeChild;

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

  @Mut(true) layout: ComponentType;
  @Mut() formModel: any;
  @Mut() searchFormModel: any;
  @Mut() addFormModel: any;
  @Mut() editFormModel: any;
  @Mut() dataSource: any[] = [];
  @Mut() tableColumnOptions: TableColumnProps[] = [];
  @Mut() curPage: number = 1;
  @Mut() pageSize: number = 10;
  @Mut() total: number = 0;
  @Mut() paginationOption?: PaginationProps;
  @Mut() renderButtons?: RenderElement;
  @Mut() renderFormElements: Array<RenderElement> = [];
  @Mut() renderSearchFormElements: Array<RenderElement> = [];
  @Mut() renderAddFormElements: Array<RenderElement> = [];
  @Mut() renderEditFormElements: Array<RenderElement> = [];
  @Mut() visibleAddForm: boolean = false;
  @Mut() visibleEditForm: boolean = false;

  @Mut() get renderDefault(): RenderElement | undefined {
    const { renderForm } = this;
    if (!this.showTable && this.showForm) return renderForm;
  }

  @Mut() get renderPagination(): RenderElement | undefined {
    if (this.paginationOption)
      return () => (
        <Pagination
          {...mergeDefaultComponentProps("Pagination", this.paginationOption)}
        ></Pagination>
      );
  }

  @Computed() get renderTable(): RenderElement | undefined {
    const dataSource = this.dataSource;
    if (this.tableColumnOptions.length)
      return () => (
        <Table
          {...mergeDefaultComponentProps(
            "Table",
            this.props.option.tableOption?.componentProps,
          )}
          columns={this.tableColumnOptions}
          dataSource={dataSource}
          style={"position: absolute;left: 0;top: 0;"}
        ></Table>
      );
  }

  @Computed() get renderForm(): RenderElement | undefined {
    if (this.renderFormElements.length)
      return () => (
        <Form
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
      let componentName = columnOption.tableOption?.component;
      const componentProps = columnOption.tableOption?.componentProps;
      if (columnOption.tableOption?.show === false) continue;
      const dict = columnOption.tableOption?.dict ?? columnOption.dict;
      const dataPropName = columnOption.tableOption?.dataPropName ?? "data";
      this.tableColumnOptions.push({
        title: columnOption.title,
        dataIndex: propName,
        customRender(data) {
          if (componentName)
            return createVNode(
              componentName,
              Object.assign({}, componentProps, { [dataPropName]: data }),
            );
          let value = data.value;
          if (dict) {
            const target = dict.data.value.find((item) => item.value === value);
            if (target) value = target.label;
          }
          return <div>{value ?? "--"}</div>;
        },
        ...this.props.option.tableOption?.tableColumnType,
        ...columnOption.tableOption?.tableColumnProps,
      });
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
    );
  }

  @PropsWatcher({ immediate: true })
  setDataSource() {
    if (this.props.dataSource) {
      this.dataSource =
        this.props.dataSource instanceof Array
          ? this.props.dataSource
          : this.props.dataSource.data;
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
      buttons: this.renderButtons,
      table: this.renderTable,
      pagination: this.renderPagination,
      default: this.renderDefault,
    });
  }

  private _buildFormModel(
    form: any,
    formOptionName:
      | "addFormOption"
      | "searchFormOption"
      | "editFormOption"
      | "formOption",
    renderElements: RenderElement[],
  ) {
    const { crudColumnOptions } = this.props.option;
    for (let propName in crudColumnOptions) {
      const columnOption: CrudColumnOption = crudColumnOptions[propName];
      const formOption = columnOption[formOptionName];
      let componentName =
        formOption?.component ?? columnOption.formOption?.component;
      if ((formOption?.show ?? columnOption.formOption?.show) === false) {
        delete form[propName];
      } else {
        if (!(propName in form))
          form[propName] = formOption?.value ?? columnOption.formOption?.value;
        if (!componentName) componentName = "Input";
      }
      if (componentName) {
        let componentProps =
          formOption?.componentProps ?? columnOption.formOption?.componentProps;
        const componentFn =
          typeof componentName === "string"
            ? (AntComponent as any)[componentName]
            : componentName;
        const vModal = formOption?.vModal ?? columnOption.formOption?.vModal;
        const dict = formOption?.dict ?? columnOption.dict;
        const dictOption =
          formOption?.dictOption ?? columnOption.dictOption ?? "options";
        const createComponent = () => {
          return createVNode(
            componentFn,
            mergeDefaultComponentProps(
              componentName,
              {
                [dictOption]: dict?.data.value,
              },
              componentProps,
              CrudInst._getModal(form, propName, componentName, vModal),
            ),
          );
        };
        if (
          (formOption?.wrapFormItem ??
            columnOption.formOption?.wrapFormItem) !== false
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
