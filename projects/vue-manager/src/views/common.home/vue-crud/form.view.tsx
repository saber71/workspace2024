import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
} from "vue-class";
import { crudForm, crudComponent } from "vue-crud";
import { Required } from "vue-form-rules";

@Component()
export class FormViewInst extends VueComponent {
  static readonly defineProps: ComponentProps<VueComponentBaseProps> = ["inst"];

  readonly form = crudForm({
    form: {
      labelAlign: "right",
      labelCol: { style: "width:70px" },
    },
    columns: [
      {
        prop: "username",
        component: crudComponent.input({
          placeholder: "请输入用户名",
        }),
        rules: Required,
        label: "用户名",
      },
      {
        prop: "password",
        component: crudComponent.inputPassword(),
        rules: Required,
        label: "密码",
      },
      {
        prop: "age",
        defaultValue: 20,
        component: crudComponent.inputNumber(),
      },
      {
        prop: "rememberMe",
        defaultValue: true,
        wrapFormItem: false,
        component: crudComponent.checkbox({}, ["记住我"]),
      },
      {
        component: crudComponent.submitButton(
          {
            class: "block w-full",
            type: "primary",
          },
          ["登陆"],
        ),
        wrapFormItem: false,
      },
    ],
  });

  render(): VNodeChild {
    return <div>{this.form.render()}</div>;
  }
}

export default toNative<VueComponentBaseProps>(FormViewInst);

export const Meta: ViewMeta = {
  title: "基础表单",
};
