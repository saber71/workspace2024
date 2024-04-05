import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
} from "vue-class";

@Component()
export class RoleManageInst extends VueComponent {
  static readonly defineProps: ComponentProps<VueComponentBaseProps> = ["inst"];

  render(): VNodeChild {
    return <div>role-manage</div>;
  }
}

export default toNative<VueComponentBaseProps>(RoleManageInst);

export const Meta: ViewMeta = {
  title: "角色管理",
};
