import { InjectService } from "@/services";
import type { CommonService } from "@/services/common.service.ts";
import type { CreateUserData } from "@/services/user.service";
import {
  Flex,
  Form,
  type FormInstance,
  FormItem,
  Input,
  InputPassword,
} from "ant-design-vue";
import type { RuleObject } from "ant-design-vue/es/form";
import { passwordStrength } from "check-password-strength";
import { IoC } from "ioc";
import type { HTMLAttributes, VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  Computed,
  Link,
  Mut,
  toNative,
  VueComponent,
} from "vue-class";

export interface RegisterFormComponentProps extends Partial<HTMLAttributes> {
  form: CreateUserData & { repeatPassword?: string };
  inst?: (inst: RegisterFormInst) => void;
  prefix?: string;
}

@Component()
export class RegisterFormInst extends VueComponent<RegisterFormComponentProps> {
  static readonly defineProps: ComponentProps<RegisterFormComponentProps> = [
    "form",
    "inst",
    "prefix",
  ];

  @InjectService("CommonService")
  readonly commonService: CommonService;

  @Link({ refName: "form" })
  readonly antdForm: FormInstance;

  @Mut()
  passwordStrength: number = -1;

  commonRule: RuleObject = {
    required: true,
    trigger: ["blur", "change"],
    message: "此为必填项",
  };

  repeatPasswordRule: RuleObject = {
    required: true,
    trigger: ["blur", "change"],
    validator: (_, value) => {
      if (!value) return Promise.reject("此为必填项");
      else if (value !== this.props.form.password)
        return Promise.reject("密码不一致");
      else return Promise.resolve();
    },
  };

  passwordRule: RuleObject = {
    required: true,
    trigger: ["blur", "change"],
    validator: (_, value) => {
      if (!value) {
        this.passwordStrength = -1;
        return Promise.reject("此为必填项");
      } else {
        this.passwordStrength = passwordStrength(value).id;
        return Promise.resolve();
      }
    },
  };

  emailRule: RuleObject = {
    required: true,
    trigger: ["blur", "change"],
    validator: (_, value) => {
      if (!value) return Promise.reject("此为必填项");
      else if (!this.commonService.isEmail(value))
        return Promise.reject("不是合法的邮箱");
      else return Promise.resolve();
    },
  };

  @Computed()
  get passwordColor() {
    switch (this.passwordStrength) {
      case 0:
        return "bg-red-700";
      case 1:
        return "bg-emerald-700";
      case 2:
      case 3:
        return "bg-emerald-500";
      default:
        return "bg-gray-200";
    }
  }

  [IoC.Initializer]() {
    this.props.form.repeatPassword = "";
    this.props.inst?.(this);
  }

  render(): VNodeChild {
    const prefix = this.props.prefix ?? "";
    const form = this.props.form;

    return (
      <Form ref={"form"} labelAlign={"right"} model={form}>
        <FormItem name={"loginName"} rules={this.commonRule}>
          <Input
            value={form.loginName}
            onUpdate:value={(val) => (form.loginName = val)}
            placeholder={`${prefix}登陆名`}
          />
        </FormItem>
        <FormItem name={"name"} rules={this.commonRule}>
          <Input
            value={form.name}
            onUpdate:value={(val) => (form.name = val)}
            placeholder={`${prefix}显示名称`}
          />
        </FormItem>
        <FormItem name={"email"} rules={this.emailRule}>
          <Input
            value={form.email}
            onUpdate:value={(val) => (form.email = val)}
            placeholder={`${prefix}邮箱`}
          />
        </FormItem>
        <FormItem name={"password"} rules={this.passwordRule}>
          <InputPassword
            value={form.password}
            onUpdate:value={(val) => (form.password = val)}
            placeholder={`${prefix}密码`}
          />
          <Flex align={"center"} gap={4}>
            <div class={"h-3 w-1/3 rounded " + this.passwordColor}></div>
            <div
              class={
                "h-3 w-1/3 rounded " +
                (this.passwordStrength >= 1 ? this.passwordColor : "")
              }
            ></div>
            <div
              class={
                "h-3 w-1/3 rounded " +
                (this.passwordStrength >= 2 ? this.passwordColor : "")
              }
            ></div>
            <span class={"shrink"}>
              {["弱", "中", "强", "强"][this.passwordStrength] || "无"}
            </span>
          </Flex>
        </FormItem>
        <FormItem name={"repeatPassword"} rules={this.repeatPasswordRule}>
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

export default toNative<RegisterFormComponentProps>(RegisterFormInst);
