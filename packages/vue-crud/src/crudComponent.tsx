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
  Select,
  SelectOption,
  type SelectProps,
  Table,
  type TableProps,
} from "ant-design-vue";
import type { HTMLAttributes, VNodeChild } from "vue";
import { crudForm } from "./crudForm.tsx";
import { crudTable } from "./crudTable.tsx";

export default {
  crudForm(
    option: Omit<CrudFormOption, "model">,
    recordAsModel?: boolean,
  ): Component {
    return (arg) => {
      const model = recordAsModel ? arg.record : arg.value;
      const form: CrudForm = crudForm({ ...option, model });
      return form.render();
    };
  },
  crudTable(option: Omit<CrudTableOption, "dataSource">): Component {
    return (arg) => {
      const dataSource = arg.value;
      const table = crudTable({ ...option, dataSource });
      return table.render();
    };
  },
  form(
    prop: FormProps & HTMLAttributes = {},
    children?: VNodeArray,
    recordAsModel?: boolean,
  ): Component {
    return (arg) => (
      <Form {...prop} model={recordAsModel ? arg.record : arg.value}>
        {toVNodes(children)}
      </Form>
    );
  },
  formItem(
    prop: FormItemProps & HTMLAttributes = {},
    children?: VNodeArray,
  ): Component {
    prop = clone(prop);
    if (prop.validateFirst === undefined) prop.validateFirst = true;
    prop = Object.assign({}, prop);
    delete prop.prop;
    return () => <FormItem {...prop}>{toVNodes(children)}</FormItem>;
  },
  input(prop: InputProps & HTMLAttributes = {}): Component {
    prop = clone(prop);
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
    prop = clone(prop);
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
    prop = clone(prop);
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
    return (arg) => (
      <Button {...prop}>{toVNodes(children ?? arg.value)}</Button>
    );
  },
  submitButton(
    prop: ButtonProps & HTMLAttributes = {},
    children?: VNodeArray,
  ): Component {
    return this.button({ ...prop, htmlType: "submit" }, children);
  },
  select(
    prop: SelectProps & HTMLAttributes = {},
    options?: Array<SelectOptionData>,
  ): Component {
    return (arg) => (
      <Select
        {...prop}
        value={arg.value}
        onUpdate:value={arg["onUpdate:value"]}
      >
        {options?.map((item) => (
          <SelectOption value={item.value} disabled={item.disabled}>
            {item.label}
          </SelectOption>
        ))}
      </Select>
    );
  },
  table(
    prop: TableProps & HTMLAttributes = {},
    recordAsDataSource: boolean = true,
  ): Component {
    prop = clone(prop);
    if (prop.rowKey === undefined) prop.rowKey = "_id";
    return (arg) => (
      <Table
        {...prop}
        dataSource={recordAsDataSource ? arg.record : arg.value}
      ></Table>
    );
  },
  renderPlaceholder(
    attr: HTMLAttributes = {},
    placeholder: string = "--",
  ): Component {
    return (arg) => {
      let value;
      if (arg.value === undefined || arg.value === null || arg.value === "")
        value = placeholder;
      else value = arg.value;
      return <span {...attr}>{value}</span>;
    };
  },
};

function clone<T>(obj: T): T {
  return Object.assign({}, obj);
}

function toVNodes(vnodeArray?: VNodeArray): VNodeChild[] | null {
  if (!vnodeArray) return null;
  if (vnodeArray instanceof Array) {
    if (typeof vnodeArray[0] === "function")
      return vnodeArray.map((fn) => (fn as Function)());
    return vnodeArray as VNodeChild[];
  }
  return [vnodeArray];
}
