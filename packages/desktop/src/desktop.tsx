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

  setup() {
    useDesktop().desktopInst = this as any;
  }

  render(): VNodeChild {
    const styles = useDesktopStyles().desktopStyles;
    return (
      <div style={styles.container}>
        <div style={styles.wrapper}>
          <Main></Main>
          <Taskbar></Taskbar>
        </div>
      </div>
    );
  }
}

export default toNative<DesktopProps>(DesktopInst);
