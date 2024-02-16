import { RouterKey } from "@/constant.ts";
import { InjectService } from "@/services";
import { type LoginData, UserService } from "@/services/user.service.ts";
import { LogoFormLayoutInst } from "@/views/logo-form.layout.tsx";
import { Button, Checkbox, Flex, Form, FormItem, Input } from "ant-design-vue";
import type { RuleObject } from "ant-design-vue/es/form";
import { type HTMLAttributes, type VNodeChild } from "vue";
import {
  BindThis,
  Component,
  type ComponentProps,
  Mut,
  toNative,
  VueComponent,
  VueInject,
} from "vue-class";
import type { Router } from "vue-router";

@Component()
export class LoginViewInst extends VueComponent {
  static readonly defineProps: ComponentProps<Partial<HTMLAttributes>> = [];

  @VueInject(RouterKey)
  readonly router: Router;

  @InjectService("UserService")
  readonly userService: UserService;

  @Mut()
  readonly form: LoginData = {
    loginNameOrEmail: "",
    remember: true,
    password: "",
  };

  readonly rule: Record<keyof Omit<LoginData, "remember">, RuleObject> = {
    loginNameOrEmail: {
      validator: (_, value) => {
        if (!value) return Promise.reject("此为必填项");
      },
    },
    password: {
      validator: (_, value) => {
        if (!value) return Promise.reject("此为必填项");
      },
    },
  };

  @VueInject(LogoFormLayoutInst.key)
  logoFormLayoutInst: LogoFormLayoutInst;

  @BindThis()
  async guestLogin() {
    this.logoFormLayoutInst.errorMsg = "";
    try {
      await this.userService.guestLogin();
      this.router.push({ path: "/" });
    } catch (e) {
      this.logoFormLayoutInst.errorMsg = (e as Error).message;
    }
  }

  @BindThis()
  toRegister() {
    this.router.push({});
  }

  @BindThis()
  toResetPassword() {}

  @BindThis()
  async handleLogin() {
    this.logoFormLayoutInst.errorMsg = "";
    try {
      await this.userService.login(this.form);
      this.router.push({ path: "/" });
    } catch (e) {
      this.logoFormLayoutInst.errorMsg = (e as Error).message;
    }
  }

  render(): VNodeChild {
    return (
      <Form model={this.form} rules={this.rule}>
        <FormItem name={"loginNameOrEmail"}>
          <Input
            value={this.form.loginNameOrEmail}
            onUpdate:value={(val) => (this.form.loginNameOrEmail = val)}
            placeholder={"登录名或邮箱"}
          />
        </FormItem>
        <FormItem name={"password"}>
          <Input
            value={this.form.password}
            onUpdate:value={(val) => (this.form.password = val)}
            placeholder={"密码"}
          />
        </FormItem>
        <Flex justify={"space-between"} align={"center"} class={"mb-2"}>
          <Checkbox
            checked={this.form.remember}
            onUpdate:checked={(val) => (this.form.remember = val)}
          >
            记住我
          </Checkbox>
          <Button type={"link"} onClick={this.toResetPassword}>
            重置密码
          </Button>
        </Flex>
        <Button
          block
          type={"primary"}
          onClick={this.handleLogin}
          class={"mb-2"}
        >
          登陆
        </Button>
        <Button block class={"mb-2"} onClick={this.toRegister}>
          注册
        </Button>
        <Button block onClick={this.guestLogin}>
          以游客身份继续
        </Button>
      </Form>
    );
  }
}

export default toNative<Partial<HTMLAttributes>>(LoginViewInst);

export const Meta = {
  title: "登陆",
};
