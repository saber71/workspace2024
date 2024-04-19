import type { StyleValue, VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
} from "vue-class";
import Main from "./main-area";
import { useDesktop, useDesktopStyles } from "./stores";
import Taskbar from "./taskbar";

export interface DesktopProps extends VueComponentBaseProps {}

@Component()
export class DesktopInst extends VueComponent<DesktopProps> {
  static readonly defineProps: ComponentProps<DesktopProps> = ["inst"];

  readonly styles = useDesktopStyles().desktopStyles;

  setup() {
    useDesktop().desktopInst = this as any;
  }

  render(): VNodeChild {
    return (
      <div style={this.styles.container}>
        <div style={this.styles.wrapper}>
          <Main></Main>
          <Taskbar></Taskbar>
        </div>
      </div>
    );
  }
}

export default toNative<DesktopProps>(DesktopInst);
