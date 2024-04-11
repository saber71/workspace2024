import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
} from "vue-class";
import { Required } from "vue-form-rules";

@Component()
export class TableViewInst extends VueComponent {
  static readonly defineProps: ComponentProps<VueComponentBaseProps> = ["inst"];

  render(): VNodeChild {
    return <div></div>;
  }
}

export default toNative<VueComponentBaseProps>(TableViewInst);

export const Meta = {
  title: "基本列表",
};
