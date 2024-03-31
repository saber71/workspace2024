import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
} from "vue-class";

@Component()
export class LoginInst extends VueComponent {
  static readonly defineProps: ComponentProps<VueComponentBaseProps> = ["inst"];

  render(): VNodeChild {
    return <div></div>;
  }
}

export default toNative<VueComponentBaseProps>(LoginInst);

export const Meta: ViewMeta = {
  title: "登陆",
  hidden: true,
};
