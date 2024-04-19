import { WindowsFilled } from "@ant-design/icons-vue";
import { Desktop } from "desktop/src";
import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
} from "vue-class";

@Component()
export class DesktopViewInst extends VueComponent {
  static readonly defineProps: ComponentProps<VueComponentBaseProps> = ["inst"];

  render(): VNodeChild {
    return <Desktop></Desktop>;
  }
}

export default toNative<VueComponentBaseProps>(DesktopViewInst);

export const Meta: ViewMeta = {
  title: "Desktop",
  icon: <WindowsFilled />,
};
