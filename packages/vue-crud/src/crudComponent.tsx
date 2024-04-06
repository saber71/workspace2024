import {
  Button,
  type ButtonProps,
  Checkbox,
  type CheckboxProps,
  Form,
  FormItem,
  type FormItemProps,
  type FormProps,
  Input,
  InputNumber,
  type InputNumberProps,
  InputPassword,
  type InputProps,
} from "ant-design-vue";
import type { HTMLAttributes, VNode } from "vue";

export default {
  form(
    prop: FormProps & HTMLAttributes = {},
    children?: VNodeArray,
  ): Component {
    return (arg) => (
      <Form {...prop} model={arg.record}>
        {...toVNodes(children)}
      </Form>
    );
  },
  formItem(
    prop: FormItemProps & HTMLAttributes = {},
    children?: VNodeArray,
  ): Component {
    if (prop.validateFirst === undefined) prop.validateFirst = true;
    prop = Object.assign({}, prop);
    delete prop.prop;
    return () => <FormItem {...prop}>{...toVNodes(children)}</FormItem>;
  },
  input(prop: InputProps & HTMLAttributes = {}): Component {
    if (!prop.placeholder) prop.placeholder = "请输入";
    if (prop.allowClear === undefined) prop.allowClear = true;
    return (arg) => (
      <Input
        {...prop}
        value={arg.value}
        onUpdate:value={arg["onUpdate:value"]}
      ></Input>
    );
  },
  inputNumber(prop: InputNumberProps & HTMLAttributes = {}): Component {
    if (!prop.placeholder) prop.placeholder = "请输入";
    return (arg) => (
      <InputNumber
        {...prop}
        value={arg.value}
        onUpdate:value={arg["onUpdate:value"]}
      ></InputNumber>
    );
  },
  inputPassword(prop: InputProps & HTMLAttributes = {}): Component {
    if (!prop.placeholder) prop.placeholder = "请输入密码";
    if (prop.allowClear === undefined) prop.allowClear = true;
    return (arg) => (
      <InputPassword
        {...prop}
        value={arg.value}
        onUpdate:value={arg["onUpdate:value"]}
      ></InputPassword>
    );
  },
  checkbox(
    prop: CheckboxProps & HTMLAttributes = {},
    children?: VNodeArray,
  ): Component {
    return (arg) => (
      <Checkbox
        {...prop}
        checked={arg.value}
        onUpdate:checked={arg["onUpdate:value"]}
      >
        {toVNodes(children)}
      </Checkbox>
    );
  },
  button(
    prop: ButtonProps & HTMLAttributes = {},
    children?: VNodeArray,
  ): Component {
    return () => <Button {...prop}>{toVNodes(children)}</Button>;
  },
  submitButton(
    prop: ButtonProps & HTMLAttributes = {},
    children?: VNodeArray,
  ): Component {
    return this.button({ ...prop, htmlType: "submit" }, children);
  },
};

function toVNodes(vnodeArray?: VNodeArray): VNode[] {
  if (!vnodeArray) return [];
  if (typeof vnodeArray[0] === "function")
    return vnodeArray.map((fn) => (fn as Function)());
  return vnodeArray as VNode[];
}
