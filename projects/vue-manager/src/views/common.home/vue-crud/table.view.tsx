import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
} from "vue-class";
import { crudComponent, crudTable } from "vue-crud";
import { Required } from "vue-form-rules";

@Component()
export class TableViewInst extends VueComponent {
  static readonly defineProps: ComponentProps<VueComponentBaseProps> = ["inst"];

  readonly table = crudTable({
    columns: [
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Password",
        dataIndex: "password",
        component: crudComponent.button({ type: "dashed" }),
      },
      {
        title: "Form",
        component: crudComponent.crudForm(
          {
            columns: [
              {
                name: "name",
                component: crudComponent.input({
                  placeholder: "请输入用户名",
                }),
                rules: Required,
                label: "用户名",
              },
              {
                name: "password",
                component: crudComponent.inputPassword(),
                rules: Required,
                label: "密码",
              },
            ],
          },
          true,
        ),
      },
    ],
    dataSource: [
      {
        _id: 1,
        name: "",
        password: "password1",
      },
      {
        _id: 2,
        name: "name2",
        password: "password2",
      },
      {
        _id: 3,
        name: "name3",
        password: "password3",
      },
    ],
    table: {
      // bordered: true,
    },
  });

  render(): VNodeChild {
    return this.table.render();
  }
}

export default toNative<VueComponentBaseProps>(TableViewInst);

export const Meta = {
  title: "基本列表",
};
