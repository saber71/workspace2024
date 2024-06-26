import type { CrudTypes } from "@/components/crud/types.ts";

export const DefaultComponentProps: Partial<CrudTypes.AntComponentPropsMap> = {
  Input: { allowClear: true, placeholder: "请输入" },
  InputSearch: { allowClear: true, placeholder: "请输入", enterButton: true },
  InputNumber: { placeholder: "请输入" },
  InputPassword: { allowClear: true, placeholder: "请输入" },
  FormItem: { validateFirst: true },
  Table: { pagination: false, sticky: true, rowKey: "_id" },
};

export const ComponentVModal: Record<
  keyof CrudTypes.AntComponentPropsMap,
  any
> = {
  Input: "value",
  InputSearch: "value",
  InputPassword: "value",
  InputNumber: "value",
  Cascader: "value",
  Checkbox: "checked",
  AutoComplete: "value",
  Radio: "checked",
  Rate: "value",
  TimeRangePicker: "value",
  Table: "value",
  TimePicker: "value",
  Transfer: "selectedKeys",
  TreeSelect: "value",
  Select: "value",
  Slider: "value",
  Switch: "checked",
  Button: "",
  FormItem: "",
  Form: "",
  Pagination: "",
  DatePicker: "value",
  Upload: "fileList",
  Mentions: "value",
};

export function mergeDefaultComponentProps(
  componentName: string | undefined,
  ...props: Array<object | undefined>
) {
  if (!componentName) return Object.assign({}, ...props);
  const defaultProps = (DefaultComponentProps as any)[componentName];
  if (!defaultProps) return Object.assign({}, ...props);
  return Object.assign({}, defaultProps, ...props);
}
