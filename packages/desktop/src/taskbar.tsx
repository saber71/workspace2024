import { WindowsFilled } from "@ant-design/icons-vue";
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
  readonly desktop = useDesktop();

  setup() {
    useDesktop().taskbarInst = this as any;
  }

  render(): VNodeChild {
    const { styles, desktop } = this;
    return (
      <div style={styles.container}>
        <div style={styles.startButton} title={"开始"}>
          <WindowsFilled />
        </div>
        <div style={styles.contentArea}></div>
        <div style={styles.infoArea}>
          <div style={styles.time}>
            <div>{desktop.formatTime}</div>
            <div>{desktop.formatDate}</div>
          </div>
        </div>
        <div style={styles.promptLine}></div>
      </div>
    );
  }
}

export default toNative<TaskbarProps>(TaskbarInst);
