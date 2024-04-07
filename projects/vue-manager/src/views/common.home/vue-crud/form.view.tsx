import { type VNodeChild } from "vue";
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
        name: "username",
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
      {
        name: "age",
        defaultValue: 20,
        component: crudComponent.inputNumber(),
      },
      {
        name: "rememberMe",
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
      {
        component: crudComponent.submitButton(
          {
            onClick: () => {
              this.form.model.age = 10;
              this.form.option.columns.push({
                component: crudComponent.button({}, ["被添加的"]),
                wrapFormItem: false,
              });
              this.form.update();
            },
          },
          ["添加按钮"],
        ),
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
