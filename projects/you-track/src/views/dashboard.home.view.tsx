import type { HTMLAttributes, VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  toNative,
  VueComponent,
} from "vue-class";

@Component()
class Dashboard extends VueComponent {
  static readonly defineProps: ComponentProps<Partial<HTMLAttributes>> = [];

  render(): VNodeChild {
    return <div class={"bg-amber-200"}>dashboard</div>;
  }
}

export default toNative<Partial<HTMLAttributes>>(Dashboard);

export const Meta = {};
