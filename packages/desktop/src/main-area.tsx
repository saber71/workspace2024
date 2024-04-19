import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
} from "vue-class";
import { useDesktop } from "./stores";

export interface MainAreaProps extends VueComponentBaseProps {}

@Component()
export class MainAreaInst extends VueComponent<MainAreaProps> {
  static readonly defineProps: ComponentProps<MainAreaProps> = ["inst"];

  setup() {
    useDesktop().mainAreaInst = this as any;
  }

  render(): VNodeChild {
    return <div></div>;
  }
}

export default toNative<MainAreaProps>(MainAreaInst);
