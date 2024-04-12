import { Button } from "ant-design-vue";
import { type VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
  Link,
  Hook,
} from "vue-class";
import Crud, { CrudInst } from "vue-crud/src/crud.tsx";
import { Required } from "vue-form-rules";

@Component()
export class FormViewInst extends VueComponent {
  static readonly defineProps: ComponentProps<VueComponentBaseProps> = ["inst"];

  @Link() readonly crud: CrudInst;

  readonly options: CrudOptions = {
    tableOption: {
      show: false,
    },
    crudColumnOptions: {
      name: {
        title: "名字",
        formOption: {
          formItemProps: {
            rules: Required,
          },
        },
      },
      password: {
        title: "密码",
        formOption: {
          component: "InputPassword",
        },
      },
      remember: {
        formOption: {
          component: "Checkbox",
          wrapFormItem: false,
          slots: { default: () => "记住我" },
        },
      },
      button: {
        formOption: {
          show: false,
          component: <Button>login</Button>,
        },
      },
    },
  };

  @Hook("onMounted")
  mounted() {
    console.log(this.crud);
    //@ts-ignore
    window.crud = this.crud;
  }

  render(): VNodeChild {
    return <Crud option={this.options} inst={"crud"}></Crud>;
  }
}

export default toNative<VueComponentBaseProps>(FormViewInst);

export const Meta: ViewMeta = {
  title: "基础表单",
};
