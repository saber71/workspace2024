/// <reference types="vite/client" />

declare interface AntComponentPropsMap {
  AutoComplete: import("ant-design-vue").AutoCompleteProps;
  Input: import("ant-design-vue").InputProps;
  InputPassword: import("ant-design-vue").InputProps;
  InputNumber: import("ant-design-vue").InputNumberProps;
  Form: import("ant-design-vue").FormProps;
  FormItem: import("ant-design-vue").FormItemProps;
  Table: import("ant-design-vue").TableProps;
  Select: import("ant-design-vue").SelectProps;
  Button: import("ant-design-vue").ButtonProps;
  Checkbox: import("ant-design-vue").CheckboxProps;
  Pagination: import("ant-design-vue").PaginationProps;
  Radio: import("ant-design-vue").RadioProps;
  Slider: import("ant-design-vue").SliderProps;
  Switch: import("ant-design-vue").SwitchProps;
  TimePicker: import("ant-design-vue").TimePickerProps;
  TimeRangePicker: import("ant-design-vue").TimeRangePickerProps;
  Cascader: import("ant-design-vue").CascaderProps;
  DatePicker: import("ant-design-vue").DatePickerProps;
  Mentions: import("ant-design-vue").MentionsProps;
  Rate: import("ant-design-vue").RateProps;
  Transfer: import("ant-design-vue").TransferProps;
  TreeSelect: import("ant-design-vue").TreeSelectProps;
  Upload: import("ant-design-vue").UploadProps;
}

declare interface PaginationOption {
  show?: boolean;
  componentProps?: import("ant-design-vue").PaginationProps;
}

declare interface TableOptions {
  show?: boolean;
  componentProps?: Omit<import("ant-design-vue").TableProps, "pagination">;
  tableColumnType?: import("ant-design-vue").TableColumnType;
  paginationOption?: PaginationOption;
}

declare interface TableColumnOption<
  ComponentType extends keyof AntComponentPropsMap = any,
> extends ColumnComponentOption {
  tableColumnProps?: import("ant-design-vue").TableColumnType;
  show?: boolean;
}

declare interface UseDict {
  dict?: DictInstance;
  dictOption?: string;
}

declare interface ColumnComponentOption<
  ComponentType extends keyof AntComponentPropsMap = any,
> extends UseDict {
  component?: ComponentType | import("vue").Component;
  componentProps?: AntComponentPropsMap[ComponentType];
  vModal?: string;
  dataPropName?: string;
}

declare interface CrudColumnOption extends UseDict {
  formOption?: FormColumnOption;
  searchFormOption?: FormColumnOption;
  addFormOption?: FormColumnOption;
  editFormOption?: FormColumnOption;
  tableOption?: TableColumnOption;
  title?: string;
}

declare interface CrudColumnOptions {
  [key: string]: CrudColumnOption;
}

declare interface FormColumnOption<
  ComponentType extends keyof AntComponentPropsMap = any,
> extends ColumnComponentOption<ComponentType> {
  formItemProps: import("ant-design-vue").FormItemProps;
  show?: boolean;
  value?: any;
  wrapFormItem?: boolean;
}

declare interface FormOption {
  componentProps?: import("ant-design-vue").FormProps;
  formItemComponentProps?: import("ant-design-vue").FormItemProps;
  show?: boolean;
}

declare interface PaginationResult<T = any> {
  data: T[];
  curPage: number;
  pageSize: number;
  total: number;
}

declare interface RequestOption {
  add(data: any): Promise<void>;

  search(query: any): Promise<PaginationResult>;

  delete(ids: any[]): Promise<void>;

  edit(data: any): Promise<void>;

  info?(): Promise<any>;
}

declare interface CrudOptions {
  layout?:
    | import("vue").Component
    | import("vue").ShallowRef<import("vue").Component>;
  request?: RequestOption;
  crudColumnOptions: CrudColumnOptions;
  formOption?: FormOption;
  searchFormOption?: FormOption;
  addFormOption?: FormOption;
  editFormOption?: FormOption;
  tableOption?: TableOptions;
}

declare interface DictOption {
  data?: any[];
  label?: string;
  value?: string;
  getData?(): Promise<any[]>;
}

declare interface DictInstance {
  reload(): void;
  data: import("vue").Ref<any[]>;
}
