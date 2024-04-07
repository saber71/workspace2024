/// <reference types="vite/client" />

declare type VNodeArray =
  | import("vue").VNodeChild
  | Array<import("vue").VNodeChild>
  | Array<() => import("vue").VNodeChild>;

declare type ComponentArg<T = any> = {
  record: T;
  index: number;
  value?: any;
  "onUpdate:value"?: (value: any) => void;
};

declare interface LayoutComponentArg {
  searchForm?: () => import("vue").VNodeChild;
  buttons?: () => import("vue").VNodeChild;
  table?: () => import("vue").VNodeChild;
  pagination?: () => import("vue").VNodeChild;
  default?: () => import("vue").VNodeChild;
}

declare type LayoutComponent = (
  arg: LayoutComponentArg,
) => import("vue").VNodeChild;

declare type Component<Data = any> = (
  arg: ComponentArg<Data>,
) => import("vue").VNodeChild;

declare interface SelectOptionData {
  label: string;
  value: any;
  disabled?: boolean;
}

declare type TableColumnOption = Partial<
  import("ant-design-vue").TableColumnType &
    import("vue").HTMLAttributes & { component: Component; show: boolean }
>;

declare type FormItemOption = import("ant-design-vue").FormItemProps &
  import("vue").HTMLAttributes & {
    show?: boolean;
    component?: Component;
    wrapFormItem?: boolean;
    defaultValue?: any;
  };

declare interface BaseColumnOption {
  component?: Component;
}

declare interface FormColumnOption extends BaseColumnOption, FormItemOption {
  name?: string;
}

declare type TableOption = Partial<
  import("ant-design-vue").TableProps &
    import("vue").HTMLAttributes & { show: boolean }
>;

declare interface TableOperation extends TableColumnOption {
  edit?: boolean;
  delete?: boolean;
}

declare interface ColumnOption extends BaseColumnOption {
  title?: string;
  prop?: string;
  table?: TableColumnOption;
  form?: FormItemOption;
  searchForm?: FormItemOption;
  addForm?: FormItemOption;
  editForm?: FormItemOption;
}

declare interface CrudOption {
  request: {
    search(query: any): Promise<{
      data: any[];
      curPage: number;
      total: number;
      pageSize: number;
    }>;
    add(): Promise<void>;
    delete(items: any[]): Promise<void>;
    update(items: any[]): Promise<void>;
  };
  layout?: LayoutComponent;
  columns: ColumnOption[];
  table?: Omit<TableOption, "pagination">;
  tableOperation?: TableOperation | false;
  pagination?: import("vue").HTMLAttributes &
    import("ant-design-vue").PaginationProps & { show?: boolean };
  form?: FormOption;
  searchForm?: FormOption;
  addForm?: FormOption;
  editForm?: FormOption;
  buttons?: {
    add?: ButtonOption;
    delete?: ButtonOption;
  };
}

declare type ButtonOption = import("ant-design-vue").ButtonProps &
  import("vue").HTMLAttributes & {
    show?: boolean;
    text?: string;
  };

declare interface CrudFormOption {
  columns: FormColumnOption[];
  form?: FormOption;
  model?: any;
  attr?: import("vue").HTMLAttributes;
}

declare type FormOption = Partial<
  import("ant-design-vue").FormProps &
    import("vue").HTMLAttributes & {
      show: boolean;
    }
>;

declare type CrudForm<Model = any> = Readonly<{
  render: () => import("vue").VNodeChild;
  model: Model;
  option: CrudFormOption;
  update: () => void;
}>;

declare interface CrudTableOption {
  columns: TableColumnOption[];
  table?: TableOption;
  dataSource: any[] | { data: any[] };
  attr?: import("vue").HTMLAttributes;
}

declare type CrudTable<Data = any> = Readonly<{
  render: () => import("vue").VNodeChild;
  dataSource: Data[];
  option: CrudTableOption;
  update: () => void;
}>;

declare type Crud = Readonly<{
  option: CrudOption;
  render(): import("vue").VNodeChild;
  update(): void;
  notifySearch(): void;
}>;
