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
import { mergeDefaultComponentProps } from "./component.ts";
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
  @Mut() renderDefault?: RenderElement;
  @Mut() renderButtons?: RenderElement;
  @Mut() renderFormElements: Array<RenderElement> = [];
  @Mut() renderSearchFormElements: Array<RenderElement> = [];
  @Mut() renderAddFormElements: Array<RenderElement> = [];
  @Mut() renderEditFormElements: Array<RenderElement> = [];
  @Mut() visibleAddForm: boolean = false;
  @Mut() visibleEditForm: boolean = false;

  @Mut() get renderPagination(): RenderElement | undefined {
    if (this.paginationOption)
      return () => (
        <Pagination
          {...mergeDefaultComponentProps("Pagination", this.paginationOption)}
        ></Pagination>
      );
  }

  @Computed() get renderTable(): RenderElement | undefined {
    if (this.tableColumnOptions.length)
      return () => (
        <Table
          {...mergeDefaultComponentProps(
            "Table",
            this.props.option.tableOption?.componentProps,
          )}
          columns={this.tableColumnOptions}
          dataSource={this.dataSource}
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
            this.props.option.formOption?.formItemComponentProps,
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
            this.props.option.formOption?.formItemComponentProps,
            this.props.option.addFormOption?.formItemComponentProps,
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
            this.props.option.formOption?.formItemComponentProps,
            this.props.option.editFormOption?.formItemComponentProps,
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
            this.props.option.formOption?.formItemComponentProps,
            this.props.option.searchFormOption?.formItemComponentProps,
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
      this.tableColumnOptions.push({
        title: columnOption.title,
        dataIndex: propName,
        customRender(data) {
          if (componentName)
            return createVNode(
              componentName,
              Object.assign({}, componentProps, { data }),
            );
          return <div>{data.value ?? "--"}</div>;
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
    const result = this.formModel;
    const { crudColumnOptions } = this.props.option;
    for (let propName in crudColumnOptions) {
      const columnOption: CrudColumnOption = crudColumnOptions[propName];
      let componentName = columnOption.formOption?.component;
      const componentProps = columnOption.formOption?.componentProps;
      if (columnOption.formOption?.show === false) {
        delete result[propName];
      } else {
        if (!(propName in result))
          result[propName] = columnOption.formOption?.value;
        if (!componentName) componentName = "Input";
      }
      if (componentName) {
        const componentFn = (AntComponent as any)[componentName];
        if (columnOption.formOption?.wrapFormItem !== false) {
          this.renderFormElements.push(() => (
            <FormItem
              {...mergeDefaultComponentProps(
                "FormItem",
                columnOption.formOption?.formItemProps,
              )}
            >
              {createVNode(
                componentFn,
                mergeDefaultComponentProps(componentName, componentProps),
              )}
            </FormItem>
          ));
        } else {
          this.renderFormElements.push(() =>
            createVNode(
              componentFn,
              mergeDefaultComponentProps(componentName, componentProps),
            ),
          );
        }
      }
    }
  }

  @PropsWatcher({ immediate: true })
  buildAddFormModel() {
    this.renderAddFormElements.length = 0;
    if (!this.showAddForm || !this.visibleAddForm) {
      this.addFormModel = undefined;
      return;
    }
    if (!this.addFormModel) this.addFormModel = {};
    const result = this.addFormModel;
    const { crudColumnOptions } = this.props.option;
    for (let propName in crudColumnOptions) {
      const columnOption: CrudColumnOption = crudColumnOptions[propName];
      let componentName =
        columnOption.addFormOption?.component ??
        columnOption.formOption?.component;
      const componentProps =
        columnOption.addFormOption?.componentProps ??
        columnOption.formOption?.componentProps;
      if (
        (columnOption.addFormOption?.show ?? columnOption.formOption?.show) ===
        false
      ) {
        delete result[propName];
      } else {
        if (!(propName in result))
          result[propName] =
            columnOption.addFormOption?.value ?? columnOption.formOption?.value;
        if (!componentName) componentName = "Input";
      }
      if (componentName) {
        const componentFn = (AntComponent as any)[componentName];
        if (
          (columnOption.addFormOption?.wrapFormItem ??
            columnOption.formOption?.wrapFormItem) !== false
        ) {
          this.renderAddFormElements.push(() => (
            <FormItem
              {...mergeDefaultComponentProps(
                "FormItem",
                columnOption.formOption?.formItemProps,
                columnOption.addFormOption?.formItemProps,
              )}
            >
              {createVNode(
                componentFn,
                mergeDefaultComponentProps(componentName, componentProps),
              )}
            </FormItem>
          ));
        } else {
          this.renderAddFormElements.push(() =>
            createVNode(
              componentFn,
              mergeDefaultComponentProps(componentName, componentProps),
            ),
          );
        }
      }
    }
  }

  @PropsWatcher({ immediate: true })
  buildEditFormModel() {
    this.renderEditFormElements.length = 0;
    if (!this.showEditForm || !this.visibleEditForm) {
      this.editFormModel = undefined;
      return;
    }
    if (!this.editFormModel) this.editFormModel = {};
    const result = this.editFormModel;
    const { crudColumnOptions } = this.props.option;
    for (let propName in crudColumnOptions) {
      const columnOption: CrudColumnOption = crudColumnOptions[propName];
      let componentName =
        columnOption.editFormOption?.component ??
        columnOption.formOption?.component;
      const componentProps =
        columnOption.editFormOption?.componentProps ??
        columnOption.formOption?.componentProps;
      if (
        (columnOption.editFormOption?.show ?? columnOption.formOption?.show) ===
        false
      ) {
        delete result[propName];
      } else {
        if (!(propName in result))
          result[propName] =
            columnOption.editFormOption?.value ??
            columnOption.formOption?.value;
        if (!componentName) componentName = "Input";
      }
      if (componentName) {
        const componentFn = (AntComponent as any)[componentName];
        if (
          (columnOption.editFormOption?.wrapFormItem ??
            columnOption.formOption?.wrapFormItem) !== false
        ) {
          this.renderEditFormElements.push(() => (
            <FormItem
              {...mergeDefaultComponentProps(
                "FormItem",
                columnOption.formOption?.formItemProps,
                columnOption.editFormOption?.formItemProps,
              )}
            >
              {createVNode(
                componentFn,
                mergeDefaultComponentProps(componentName, componentProps),
              )}
            </FormItem>
          ));
        } else {
          this.renderEditFormElements.push(() =>
            createVNode(
              componentFn,
              mergeDefaultComponentProps(componentName, componentProps),
            ),
          );
        }
      }
    }
  }

  @PropsWatcher({ immediate: true })
  buildSearchFormModel() {
    this.renderSearchFormElements.length = 0;
    if (!this.showSearchForm || !this.showTable) {
      this.searchFormModel = undefined;
      return;
    }
    if (!this.searchFormModel) this.searchFormModel = {};
    const result = this.searchFormModel;
    const { crudColumnOptions } = this.props.option;
    for (let propName in crudColumnOptions) {
      const columnOption: CrudColumnOption = crudColumnOptions[propName];
      let componentName =
        columnOption.searchFormOption?.component ??
        columnOption.formOption?.component;
      const componentProps =
        columnOption.searchFormOption?.componentProps ??
        columnOption.formOption?.componentProps;
      if (
        (columnOption.searchFormOption?.show ??
          columnOption.formOption?.show) === false
      ) {
        delete result[propName];
      } else {
        if (!(propName in result))
          result[propName] =
            columnOption.searchFormOption?.value ??
            columnOption.formOption?.value;
        if (!componentName) componentName = "Input";
      }
      if (componentName) {
        const componentFn = (AntComponent as any)[componentName];
        if (
          (columnOption.searchFormOption?.wrapFormItem ??
            columnOption.formOption?.wrapFormItem) !== false
        ) {
          this.renderSearchFormElements.push(() => (
            <FormItem
              {...mergeDefaultComponentProps(
                "FormItem",
                columnOption.formOption?.formItemProps,
                columnOption.searchFormOption?.formItemProps,
              )}
            >
              {createVNode(
                componentFn,
                mergeDefaultComponentProps(componentName, componentProps),
              )}
            </FormItem>
          ));
        } else {
          this.renderSearchFormElements.push(() =>
            createVNode(
              componentFn,
              mergeDefaultComponentProps(componentName, componentProps),
            ),
          );
        }
      }
    }
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
}

export default toNative<CrudProps>(CrudInst);
