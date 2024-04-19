import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
} from "vue-class";
import { useDesktop, useDesktopStyles } from "./stores";

export interface TaskbarProps extends VueComponentBaseProps {}

@Component()
export class TaskbarInst extends VueComponent<TaskbarProps> {
  static readonly defineProps: ComponentProps<TaskbarProps> = ["inst"];

  readonly styles = useDesktopStyles().taskbarStyles;

  setup() {
    useDesktop().taskbarInst = this as any;
  }

  render(): VNodeChild {
    return <div style={this.styles.container}></div>;
  }
}

export default toNative<TaskbarProps>(TaskbarInst);
