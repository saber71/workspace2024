import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
} from "vue-class";

@Component()
export class DashboardInst extends VueComponent {
  static readonly defineProps: ComponentProps<VueComponentBaseProps> = ["inst"];

  render(): VNodeChild {
    return <div>dashboard</div>;
  }
}

export default toNative<VueComponentBaseProps>(DashboardInst);

export const Meta: ViewMeta = {
  title: "仪表盘",
};
