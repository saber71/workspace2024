import { WindowsFilled } from "@ant-design/icons-vue";
import { dynamic, Styles } from "styles";
import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
  Hook,
} from "vue-class";
import { TASKBAR_INIT_HEIGHT } from "./constants";
import { rem, useDesktop, useTaskbarSetting } from "./stores";

export interface TaskbarProps extends VueComponentBaseProps {}

@Component()
export class TaskbarInst extends VueComponent<TaskbarProps> {
  static readonly defineProps: ComponentProps<TaskbarProps> = ["inst"];

  readonly styles = new Styles<
    | "time"
    | "container"
    | "promptLine"
    | "startButton"
    | "contentArea"
    | "infoArea"
    | "blank"
  >()
    .addDynamic("blank", () => {
      const { deputySizeProp } = useTaskbarSetting();
      return {
        flexBasis: "7px",
        [deputySizeProp]: "100%",
        transition: "all 0.1s",
      };
    })
    .add(
      "blank",
      {
        boxShadow: "-2px 0 2px 0 rgba(0,0,0,0.2)",
      },
      "hover",
    )
    .add("time", {
      textAlign: "center",
      fontSize: "0.75rem",
    })
    .addDynamic("container", () => {
      const {
        deputySizeValue,
        deputySizeProp,
        deputyMinSizeProp,
        principalSizeProp,
        isHorizon,
      } = useTaskbarSetting();
      return {
        [principalSizeProp]: "100%",
        [deputySizeProp]: dynamic(deputySizeValue),
        [deputyMinSizeProp]: dynamic(rem(TASKBAR_INIT_HEIGHT)),
        display: "flex",
        flexDirection: dynamic(isHorizon ? "column" : "row"),
        flexShrink: "0",
        background: "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(10px)",
      };
    })
    .addDynamic("promptLine", () => {
      const {
        promptLinePositions,
        deputySizeProp,
        principalSizeProp,
        isHorizon,
      } = useTaskbarSetting();
      return {
        position: "absolute",
        [promptLinePositions[0]]: 0,
        [promptLinePositions[1]]: 0,
        [principalSizeProp]: "100%",
        [deputySizeProp]: "3px",
        transform: dynamic(isHorizon ? "translateX(-50%)" : "translateY(-50%)"),
        cursor: dynamic(isHorizon ? "col-resize" : "row-resize"),
      };
    })
    .addDynamic("startButton", () => {
      const { deputySizeProp } = useTaskbarSetting();
      return {
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexBasis: dynamic(rem(50)),
        [deputySizeProp]: "100%",
        fontSize: dynamic(rem(18)),
        cursor: "pointer",
        transition: "all 0.3s linear",
      };
    })
    .add(
      "startButton",
      {
        background: "rgba(255, 255, 255, 0.5)",
      },
      "hover",
    )
    .addDynamic("contentArea", () => {
      const { deputySizeProp } = useTaskbarSetting();
      return {
        flexGrow: 1,
        [deputySizeProp]: "100%",
      };
    })
    .addDynamic("infoArea", () => {
      const { deputySizeProp, isHorizon } = useTaskbarSetting();
      return {
        flexShrink: 0,
        flexBasis: "100px",
        [deputySizeProp]: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        flexDirection: dynamic(isHorizon ? "column" : "row"),
        gap: "3px",
        overflow: "hidden",
      };
    });

  setup() {
    useDesktop().taskbarInst = this as any;
  }

  @Hook("onUnmounted") onUnmounted(): void {
    this.styles.dispose();
  }

  render(): VNodeChild {
    const { styles } = this;
    const desktop = useDesktop();
    return (
      <div class={styles.classNames.container}>
        <div class={styles.classNames.startButton} title={"开始"}>
          <WindowsFilled />
        </div>
        <div class={styles.classNames.contentArea}></div>
        <div class={styles.classNames.infoArea}>
          <div class={styles.classNames.time}>
            <div>{desktop.formatTime}</div>
            <div>{desktop.formatDate}</div>
          </div>
          <div class={styles.classNames.blank}></div>
        </div>
        <div class={styles.classNames.promptLine}></div>
      </div>
    );
  }
}

export default toNative<TaskbarProps>(TaskbarInst);
