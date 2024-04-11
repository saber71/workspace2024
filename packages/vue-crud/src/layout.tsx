import { Flex, Space } from "ant-design-vue";
import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
} from "vue-class";

export interface LayoutProps extends VueComponentBaseProps {
  searchForm?: () => VNodeChild;
  buttons?: () => VNodeChild;
  table?: () => VNodeChild;
  pagination?: () => VNodeChild;
  default?: () => VNodeChild;
}

@Component()
export class LayoutInst extends VueComponent<LayoutProps> {
  static readonly defineProps: ComponentProps<LayoutProps> = [
    "inst",
    "searchForm",
    "buttons",
    "table",
    "pagination",
    "default",
  ];

  render(): VNodeChild {
    const { searchForm, buttons, table, pagination } = this.props;
    const defaults = this.props.default;
    return (
      <Space direction={"vertical"}>
        {searchForm || buttons ? (
          <Flex justify={"space-between"} style={"flex-shrink:0;"}>
            <div>{searchForm?.()}</div>
            <div>{buttons?.()}</div>
          </Flex>
        ) : null}
        {table ? (
          <div style={"flex-grow:1;position:relative;"}>{table()}</div>
        ) : null}
        {pagination ? (
          <Flex justify={"flex-end"} style={"flex-shrink:0;"}>
            {pagination()}
          </Flex>
        ) : null}
        {defaults ? <div style={"position:absolute;"}>{defaults()}</div> : null}
      </Space>
    );
  }
}

export default toNative<LayoutProps>(LayoutInst);
