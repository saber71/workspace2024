import { Form, FormItem } from "ant-design-vue";
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
  Watcher,
} from "vue-class";
import { mergeDefaultComponentProps } from "./component.ts";
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

  @Mut(true) layout: ComponentType;
  @Mut() formModel: any = {};
  @Mut() searchFormModel: any = {};
  @Mut() addFormModel: any = {};
  @Mut() editFormModel: any = {};
  @Mut() dataSource: any[] = [];
  @Mut() curPage: number = 1;
  @Mut() pageSize: number = 10;
  @Mut() total: number = 0;
  @Mut() renderDefault?: () => VNodeChild;
  @Mut() renderSearchForm?: () => VNodeChild;
  @Mut() renderButtons?: () => VNodeChild;
  @Mut() renderTable?: () => VNodeChild;
  @Mut() renderPagination?: () => VNodeChild;
  @Mut() visibleAddForm: boolean = false;
  @Mut() visibleEditForm: boolean = false;

  get enablePagination() {
    return this.props.dataSource && !(this.props.dataSource instanceof Array);
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
  buildFormModel() {
    if (!this.showForm || this.showTable) {
      this.formModel = {};
      return;
    }
    const result = this.formModel;
    const { crudColumnOptions } = this.props.option;
    const renderFormItems: Array<Function> = [];
    for (let propName in crudColumnOptions) {
      if (propName in result) continue;
      const columnOption: CrudColumnOption<any> = crudColumnOptions[propName];
      if (columnOption.formOption?.show === false) {
        delete result[propName];
        continue;
      }
      result[propName] = columnOption.formOption?.value;
      const componentName = columnOption.component ?? "Input";
      const componentFn = (AntComponent as any)[componentName];
      renderFormItems.push(() => (
        <FormItem
          {...mergeDefaultComponentProps("FormItem", columnOption.formOption)}
        >
          {createVNode(
            componentFn,
            mergeDefaultComponentProps(
              componentName,
              columnOption.componentProps,
            ),
          )}
        </FormItem>
      ));
    }
    this.renderDefault = () => (
      <Form
        {...mergeDefaultComponentProps("Form", this.props.option.formOption)}
      >
        {renderFormItems.map((fn) => fn())}
      </Form>
    );
  }

  @PropsWatcher({ immediate: true })
  buildAddFormModel() {
    if (!this.showAddForm || !this.visibleAddForm) {
      this.addFormModel = {};
      return;
    }
    const result = this.addFormModel;
    const { crudColumnOptions } = this.props.option;
    for (let propName in crudColumnOptions) {
      if (propName in result) continue;
      const columnOption = crudColumnOptions[propName];
      if (columnOption.addFormOption?.show === false) {
        delete result[propName];
        continue;
      }
      result[propName] = columnOption.addFormOption?.value;
    }
  }

  @PropsWatcher({ immediate: true })
  buildEditFormModel() {
    if (!this.showEditForm || !this.visibleEditForm) {
      this.editFormModel = {};
      return;
    }
    const result = this.editFormModel;
    const { crudColumnOptions } = this.props.option;
    for (let propName in crudColumnOptions) {
      if (propName in result) continue;
      const columnOption = crudColumnOptions[propName];
      if (columnOption.editFormOption?.show === false) {
        delete result[propName];
        continue;
      }
      result[propName] = columnOption.editFormOption?.value;
    }
  }

  @PropsWatcher({ immediate: true })
  buildSearchFormModel() {
    if (!this.showSearchForm || !this.showTable) {
      this.searchFormModel = {};
      return;
    }
    const result = this.searchFormModel;
    const { crudColumnOptions } = this.props.option;
    for (let propName in crudColumnOptions) {
      if (propName in result) continue;
      const columnOption = crudColumnOptions[propName];
      if (columnOption.searchFormOption?.show === false) {
        delete result[propName];
        continue;
      }
      result[propName] = columnOption.searchFormOption?.value;
    }
  }

  @PropsWatcher({ immediate: true })
  rebuild() {
    const option = this.props.option;
    this.layout = option.layout ?? Layout;
    if (option.tableOption?.show === false) this.renderTable = undefined;
    else {
    }
    if (option.formOption?.show === false) {
      this.renderSearchForm = undefined;
      this.renderDefault = undefined;
    }
    if (option.searchFormOption?.show !== false) {
    }
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
