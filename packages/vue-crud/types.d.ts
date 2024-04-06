/// <reference types="vite/client" />

declare type VNodeArray =
  | Array<import("vue").VNodeChild>
  | Array<() => import("vue").VNodeChild>;

declare type ComponentArg<T = any> = {
  record: T;
  index: number;
  value?: any;
  "onUpdate:value"?: (value: any) => void;
};

declare type Component<Data = any> = (
  arg: ComponentArg<Data>,
) => import("vue").VNodeChild;

declare type TableColumnOption = Partial<
  import("ant-design-vue").TableColumnType & { component: Component }
>;

declare type FormItemOption = import("ant-design-vue").FormItemProps & {
  show?: boolean;
  style?: import("vue").CSSProperties;
  class?: string;
  component?: Component;
  wrapFormItem?: boolean;
  defaultValue?: any;
};

declare interface BaseColumnOption {
  component?: Component;
  prop?: string;
}

declare interface FormColumnOption extends BaseColumnOption, FormItemOption {}

declare interface ColumnOption extends BaseColumnOption {
  title?: string;
  form?: FormItemOption;
  tableColumn?: TableColumnOption;
  searchForm?: FormItemOption;
  addForm?: FormItemOption;
  editForm?: FormItemOption;
}

declare type TableOption = Partial<
  import("ant-design-vue").TableProps & { show: boolean }
>;

declare interface CrudOption {
  columns: ColumnOption[];
  table?: TableOption;
  form?: FormOption;
  searchForm?: FormOption;
  addForm?: FormOption;
  editForm?: FormOption;
}

declare interface CrudFormOption {
  columns: FormColumnOption[];
  form?: FormOption;
}

declare type FormOption = Partial<
  import("ant-design-vue").FormProps & {
    show: boolean;
  }
>;

declare type CrudForm<T = any> = {
  render: () => import("vue").VNodeChild;
  model: T;
};
