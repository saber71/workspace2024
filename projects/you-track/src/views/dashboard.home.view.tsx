import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  toNative,
  VueComponent,
  type VueComponentBaseProps,
} from "vue-class";

@Component()
class Dashboard extends VueComponent {
  static readonly defineProps: ComponentProps<VueComponentBaseProps> = ["inst"];

  render(): VNodeChild {
    return <div class={"bg-amber-200"}>dashboard</div>;
  }
}

export default toNative<VueComponentBaseProps>(Dashboard);

export const Meta = {};
