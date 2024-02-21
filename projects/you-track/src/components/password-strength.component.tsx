import { Flex } from "ant-design-vue";
import { passwordStrength } from "check-password-strength";
import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
  Computed,
} from "vue-class";

export interface PasswordStrengthComponentProps extends VueComponentBaseProps {
  value: string;
}

@Component()
export class PasswordStrengthComponentInst extends VueComponent<PasswordStrengthComponentProps> {
  static readonly defineProps: ComponentProps<PasswordStrengthComponentProps> =
    ["inst", "value"];

  readonly normalColor = "bg-gray-200";

  @Computed()
  get color() {
    switch (this.strength) {
      case 0:
        return "bg-red-700";
      case 1:
        return "bg-emerald-700";
      case 2:
      case 3:
        return "bg-emerald-500";
      default:
        return this.normalColor;
    }
  }

  @Computed()
  get strength() {
    if (this.props.value) return passwordStrength(this.props.value).id;
    return -1;
  }

  render(): VNodeChild {
    return (
      <Flex align={"center"} gap={4}>
        <div class={"h-3 w-1/3 rounded " + this.color}></div>
        <div
          class={
            "h-3 w-1/3 rounded " +
            (this.strength >= 1 ? this.color : this.normalColor)
          }
        ></div>
        <div
          class={
            "h-3 w-1/3 rounded " +
            (this.strength >= 2 ? this.color : this.normalColor)
          }
        ></div>
        <span class={"shrink"}>
          {["弱", "中", "强", "强"][this.strength] || "无"}
        </span>
      </Flex>
    );
  }
}

export default toNative<PasswordStrengthComponentProps>(
  PasswordStrengthComponentInst,
);
