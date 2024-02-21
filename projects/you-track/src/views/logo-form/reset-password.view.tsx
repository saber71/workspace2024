import PasswordStrengthComponent from "@/components/password-strength.component.tsx";
import { RouterKey } from "@/constant.ts";
import { InjectService } from "@/services";
import type {
  ResetPasswordData,
  UserService,
} from "@/services/user.service.ts";
import { Equal, getErrorMessage, Required } from "@/utils";
import type { LogoFormLayoutInst } from "@/views/logo-form.layout.tsx";
import LoginView from "@/views/logo-form/login.view.tsx";
import {
  Button,
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
  type VueComponentBaseProps,
  toNative,
  VueComponent,
  Mut,
  VueInject,
  BindThis,
  Link,
} from "vue-class";
import type { Router } from "vue-router";

@Component()
export class ResetPasswordViewInst extends VueComponent {
  static readonly defineProps: ComponentProps<VueComponentBaseProps> = ["inst"];

  @Mut()
  readonly form: ResetPasswordData & { repeatPassword: string } = {
    password: "",
    repeatPassword: "",
    loginNameOrEmail: "",
  };

  @VueInject("LogoFormLayoutInst")
  readonly logoFormLayoutInst: LogoFormLayoutInst;

  @Link()
  readonly formRef: FormInstance;

  @VueInject(RouterKey)
  readonly router: Router;

  @InjectService("UserService")
  readonly userService: UserService;

  @BindThis()
  async handleResetPassword() {
    this.logoFormLayoutInst.errorMsg = "";
    try {
      await this.formRef.validate();
      await this.userService.resetPassword(this.form);
      this.router.push({ name: LoginView.name });
    } catch (e) {
      this.logoFormLayoutInst.errorMsg = getErrorMessage(e);
    }
  }

  render(): VNodeChild {
    const form = this.form;

    return (
      <Form ref={"formRef"} model={form}>
        <FormItem name={"loginNameOrEmail"} rules={Required}>
          <Input
            value={form.loginNameOrEmail}
            onUpdate:value={(val) => (form.loginNameOrEmail = val)}
            placeholder={"登录名或邮箱"}
          />
        </FormItem>
        <FormItem name={"password"} rules={Required}>
          <InputPassword
            value={form.password}
            onUpdate:value={(val) => (form.password = val)}
            placeholder={`新密码`}
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
            placeholder={`确认新密码`}
          />
        </FormItem>
        <Button block type={"primary"} onClick={this.handleResetPassword}>
          重置密码
        </Button>
      </Form>
    );
  }
}

export default toNative<VueComponentBaseProps>(ResetPasswordViewInst);

export const Meta = {
  title: "重置密码",
};
