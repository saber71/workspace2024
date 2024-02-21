import {RouterKey} from "@/constant.ts";
import {InjectService} from "@/services";
import {type LoginData, UserService} from "@/services/user.service.ts";
import {getErrorMessage, Required} from "@/utils";
import type {LogoFormLayoutInst} from "@/views/logo-form.layout.tsx";
import RegisterUserView from "@/views/logo-form/register-user.view.tsx";
import ResetPasswordView from "@/views/logo-form/reset-password.view.tsx";
import {
  Button,
  Checkbox,
  Flex,
  Form,
  type FormInstance,
  FormItem,
  Input,
} from "ant-design-vue";
import {type VNodeChild} from "vue";
import {
  BindThis,
  Component,
  type ComponentProps,
  Link,
  Mut,
  toNative,
  VueComponent,
  type VueComponentBaseProps,
  VueInject,
} from "vue-class";
import {type Router, RouterLink} from "vue-router";

@Component()
export class LoginViewInst extends VueComponent {
  static readonly defineProps: ComponentProps<VueComponentBaseProps> = ["inst"];

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

  @Link()
  readonly formRef: FormInstance;

  @VueInject("LogoFormLayoutInst")
  readonly logoFormLayoutInst: LogoFormLayoutInst;

  @BindThis()
  async guestLogin() {
    this.logoFormLayoutInst.errorMsg = "";
    try {
      await this.userService.guestLogin();
      this.router.push({path: "/"});
    } catch (e) {
      this.logoFormLayoutInst.errorMsg = (e as Error).message;
    }
  }

  @BindThis()
  async handleLogin() {
    this.logoFormLayoutInst.errorMsg = "";
    try {
      await this.formRef.validate();
      await this.userService.login(this.form);
      this.router.push({path: "/"});
    } catch (e) {
      this.logoFormLayoutInst.errorMsg = getErrorMessage(e);
    }
  }

  render(): VNodeChild {
    return (
      <Form ref={"formRef"} model={this.form}>
        <FormItem name={"loginNameOrEmail"} rules={Required}>
          <Input
            value={this.form.loginNameOrEmail}
            onUpdate:value={(val) => (this.form.loginNameOrEmail = val)}
            placeholder={"登录名或邮箱"}
          />
        </FormItem>
        <FormItem name={"password"} rules={Required}>
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
          <Button type={"link"}>
            <RouterLink to={{name: ResetPasswordView.name}}>重置密码</RouterLink>
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
        <Button block class={"mb-2"}>
          <RouterLink to={{name: RegisterUserView.name}}>注册</RouterLink>
        </Button>
        <Button block onClick={this.guestLogin}>
          以游客身份继续
        </Button>
      </Form>
    );
  }
}

export default toNative<VueComponentBaseProps>(LoginViewInst);

export const Meta = {
  title: "登陆",
};
