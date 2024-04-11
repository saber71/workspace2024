export const DefaultComponentProps: Partial<AntComponentPropsMap> = {
  Input: { allowClear: true, placeholder: "请输入" },
  InputNumber: { placeholder: "请输入" },
  InputPassword: { allowClear: true, placeholder: "请输入" },
  FormItem: { validateFirst: true },
  Table: { pagination: false },
};

export function mergeDefaultComponentProps(
  componentName: string | undefined,
  ...props: Array<any | undefined>
) {
  if (!componentName) return Object.assign({}, ...props);
  const defaultProps = (DefaultComponentProps as any)[componentName];
  if (!defaultProps) return Object.assign({}, ...props);
  return Object.assign({}, defaultProps, ...props);
}
