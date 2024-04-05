import TableComponent from "@/components/table.component.tsx";
import type { ColumnsType } from "ant-design-vue/es/table";
import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
} from "vue-class";

@Component()
export class UserManageInst extends VueComponent {
  static readonly defineProps: ComponentProps<VueComponentBaseProps> = ["inst"];

  readonly columns: ColumnsType = [
    {
      title: "名字",
      dataIndex: "name",
    },
    {
      title: "描述",
      dataIndex: "description",
    },
  ];

  render(): VNodeChild {
    return (
      <div class={"h-full p-6 box-border"}>
        <TableComponent
          columns={this.columns}
          onSearch={() =>
            Promise.resolve({
              data: [
                {
                  name: "name1",
                  description: "description1",
                  _id: "1",
                },
                {
                  name: "name2",
                  description: "description2",
                  _id: "2",
                },
                {
                  name: "name3",
                  description: "description3",
                  _id: "3",
                },
                {
                  name: "name4",
                  description: "description4",
                  _id: "4",
                },
              ],
              curPage: 1,
              total: 100,
              pageSize: 10,
            })
          }
        ></TableComponent>
      </div>
    );
  }
}

export default toNative<VueComponentBaseProps>(UserManageInst);

export const Meta: ViewMeta = {
  title: "用户管理",
};
