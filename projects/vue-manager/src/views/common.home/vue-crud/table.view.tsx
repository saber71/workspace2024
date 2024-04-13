import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
} from "vue-class";
import Crud from "vue-crud";

@Component()
export class TableViewInst extends VueComponent {
  static readonly defineProps: ComponentProps<VueComponentBaseProps> = ["inst"];

  readonly options: CrudOptions = {
    tableOption: {
      tableColumnType: {
        align: "center",
      },
    },
    crudColumnOptions: {
      name: {
        title: "名字",
        tableOption: {
          component: "Input",
        },
        searchFormOption: {
          show: true,
        },
      },
      password: {
        title: "密码",
      },
    },
  };

  readonly dataSource: PaginationResult = {
    data: [
      {
        name: "dsa",
        password: "dsad",
      },
      {
        name: "dsa1",
        password: "d1sad",
      },
      {
        name: "dsa12",
        password: "d21sad",
      },
      {
        name: "dsa",
        password: "",
      },
      {
        name: "dsa1",
        password: "d1sad",
      },
      {
        name: "dsa12",
        password: "d21sad",
      },
    ],
    curPage: 1,
    total: 3,
    pageSize: 10,
  };

  render(): VNodeChild {
    return <Crud option={this.options} dataSource={this.dataSource}></Crud>;
  }
}

export default toNative<VueComponentBaseProps>(TableViewInst);

export const Meta = {
  title: "基本列表",
};
