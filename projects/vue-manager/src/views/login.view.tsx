import { userApi } from "@/api.ts";
import { ROUTE, ROUTER } from "@/constant.ts";
import { useUser } from "@/stores";
import { MenuUnfoldOutlined } from "@ant-design/icons-vue";
import {
  Button,
  Card,
  Checkbox,
  Flex,
  Form,
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
  BindThis,
  VueInject,
  Inject,
} from "vue-class";
import { Required } from "vue-form-rules";
import type { Router } from "vue-router";

@Component()
export class LoginInst extends VueComponent {
  static readonly defineProps: ComponentProps<VueComponentBaseProps> = ["inst"];

  @Mut() form = {
    loginNameOrEmail: "",
    password: "",
    rememberMe: true,
  };

  @VueInject(ROUTER) router: Router;

  @Inject({ typeLabel: ROUTE }) route: CurrentRoute;

  @BindThis()
  handleLogin() {
    userApi("login", [this.form]).then((data) => {
      if (data.success) {
        const userStore = useUser();
        userStore.info = data.object;
        userStore.rememberMe = this.form.rememberMe;
        if (this.route.value.query.redirect) {
          window.open(this.route.value.query.redirect as string, "_self");
        } else {
          this.router.push({ path: "/" });
        }
      }
    });
  }

  render(): VNodeChild {
    return (
      <Flex justify={"center"} align={"center"} class={"h-full bg-base"}>
        <Card class={"w-80"} title={"登陆系统"}>
          <Form model={this.form} onFinish={this.handleLogin}>
            <FormItem rules={Required} name={"loginNameOrEmail"}>
              <Input
                placeholder={"请输入用户名或邮箱"}
                value={this.form.loginNameOrEmail}
                onUpdate:value={(val) => (this.form.loginNameOrEmail = val)}
              />
            </FormItem>
            <FormItem rules={Required} name={"password"}>
              <InputPassword
                placeholder={"请输入密码"}
                value={this.form.password}
                onUpdate:value={(val) => (this.form.password = val)}
              />
            </FormItem>
            <Checkbox
              checked={this.form.rememberMe}
              onUpdate:checked={(val) => (this.form.rememberMe = val)}
            >
              记住我
            </Checkbox>
            <Button
              class={"block w-full mt-2"}
              type={"primary"}
              htmlType={"submit"}
            >
              登陆
            </Button>
          </Form>
        </Card>
      </Flex>
    );
  }
}

export default toNative<VueComponentBaseProps>(LoginInst);

export const Meta: ViewMeta = {
  title: "登陆",
  hidden: true,
  icon: <MenuUnfoldOutlined />,
};
