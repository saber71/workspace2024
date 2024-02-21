import PasswordStrengthComponent from "@/components/password-strength.component.tsx";
import { InjectService } from "@/services";
import type { CommonService } from "@/services/common.service.ts";
import type { CreateUserData } from "@/services/user.service";
import { Equal, Required, ValidEmail } from "@/utils";
import {
  Form,
  type FormInstance,
  FormItem,
  Input,
  InputPassword,
} from "ant-design-vue";
import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  Link,
  toNative,
  VueComponent,
  type VueComponentBaseProps,
} from "vue-class";

export interface RegisterFormComponentProps extends VueComponentBaseProps {
  form: CreateUserData & { repeatPassword?: string };
  prefix?: string;
}

@Component()
export class RegisterFormComponentInst extends VueComponent<RegisterFormComponentProps> {
  static readonly defineProps: ComponentProps<RegisterFormComponentProps> = [
    "form",
    "inst",
    "prefix",
  ];

  @InjectService("CommonService")
  readonly commonService: CommonService;

  @Link({ refName: "form" })
  readonly antdForm: FormInstance;

  setup() {
    this.props.form.repeatPassword = "";
  }

  render(): VNodeChild {
    const prefix = this.props.prefix ?? "";
    const form = this.props.form;

    return (
      <Form ref={"form"} labelAlign={"right"} model={form}>
        <FormItem name={"loginName"} rules={Required}>
          <Input
            value={form.loginName}
            onUpdate:value={(val) => (form.loginName = val)}
            placeholder={`${prefix}登陆名`}
          />
        </FormItem>
        <FormItem name={"name"} rules={Required}>
          <Input
            value={form.name}
            onUpdate:value={(val) => (form.name = val)}
            placeholder={`${prefix}显示名称`}
          />
        </FormItem>
        <FormItem name={"email"} rules={[Required, ValidEmail]} validateFirst>
          <Input
            value={form.email}
            onUpdate:value={(val) => (form.email = val)}
            placeholder={`${prefix}邮箱`}
          />
        </FormItem>
        <FormItem name={"password"} rules={Required}>
          <InputPassword
            value={form.password}
            onUpdate:value={(val) => (form.password = val)}
            placeholder={`${prefix}密码`}
          />
          <PasswordStrengthComponent value={form.password} />
        </FormItem>
        <FormItem
          name={"repeatPassword"}
          rules={[Required, Equal(() => form.password, "密码不一致")]}
          validateFirst
        >
          <InputPassword
            value={form.repeatPassword}
            onUpdate:value={(val) => (form.repeatPassword = val)}
            placeholder={`确认${prefix}密码`}
          />
        </FormItem>
      </Form>
    );
  }
}

export default toNative<RegisterFormComponentProps>(RegisterFormComponentInst);
