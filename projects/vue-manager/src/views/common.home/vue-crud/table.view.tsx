import Crud from "@/components/crud";
import type { CrudTypes } from "@/components/crud/types.ts";
import { Required } from "@/utils";
import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
} from "vue-class";

@Component()
export class TableViewInst extends VueComponent {
  static readonly defineProps: ComponentProps<VueComponentBaseProps> = ["inst"];

  readonly options: CrudTypes.CrudOptions = {
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
        addFormOption: {
          formItemProps: {
            rules: Required,
          },
        },
      },
      password: {
        title: "密码",
        editFormOption: {
          formItemProps: {
            rules: Required,
          },
        },
      },
    },
    name: "用户",
    addFormOption: {
      componentProps: {
        labelCol: { span: 3 },
      },
    },
  };

  readonly dataSource: CrudTypes.PaginationResult = {
    data: [
      {
        name: "dsa",
        password: "dsad",
        _id: String(Math.random()),
      },
      {
        name: "dsa1",
        password: "d1sad",
        _id: String(Math.random()),
      },
      {
        name: "dsa12",
        password: "d21sad",
        _id: String(Math.random()),
      },
      {
        name: "dsa",
        password: "",
        _id: String(Math.random()),
      },
      {
        name: "dsa1",
        password: "d1sad",
        _id: String(Math.random()),
      },
      {
        name: "dsa12",
        password: "d21sad",
        _id: String(Math.random()),
      },
      {
        name: "dsa1",
        password: "d1sad",
        _id: String(Math.random()),
      },
      {
        name: "dsa12",
        password: "d21sad",
        _id: String(Math.random()),
      },
      {
        name: "dsa",
        password: "",
        _id: String(Math.random()),
      },
      {
        name: "dsa1",
        password: "d1sad",
        _id: String(Math.random()),
      },
      {
        name: "dsa12",
        password: "d21sad",
        _id: String(Math.random()),
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
