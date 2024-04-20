import { WindowsFilled } from "@ant-design/icons-vue";
import { dynamic, Styles } from "styles";
import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
  Computed,
  Hook,
} from "vue-class";
import { TASKBAR_INIT_HEIGHT } from "./constants";
import { rem, useDesktop, useSettings } from "./stores";

export interface TaskbarProps extends VueComponentBaseProps {}

@Component()
export class TaskbarInst extends VueComponent<TaskbarProps> {
  static readonly defineProps: ComponentProps<TaskbarProps> = ["inst"];

  readonly desktop = useDesktop();
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
      const { deputySizeProp } = this.styleHelper;
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
      } = this.styleHelper;
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
      } = this.styleHelper;
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
      const { deputySizeProp } = this.styleHelper;
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
      const { deputySizeProp } = this.styleHelper;
      return {
        flexGrow: 1,
        [deputySizeProp]: "100%",
      };
    })
    .addDynamic("infoArea", () => {
      const { deputySizeProp, isHorizon } = this.styleHelper;
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

  @Computed() get styleHelper() {
    const settings = useSettings().taskbar;

    const deputySizeValue = settings.deputySize || rem(TASKBAR_INIT_HEIGHT);
    let principalSizeProp = "width",
      deputySizeProp = "height",
      deputyMinSizeProp = "minHeight";
    const isHorizon =
      settings.position === "left" || settings.position === "right";
    if (isHorizon) {
      principalSizeProp = "height";
      deputySizeProp = "width";
      deputyMinSizeProp = "minWidth";
    }
    let promptLinePositions = ["top", "left"];
    if (settings.position === "top") promptLinePositions[0] = "bottom";
    else if (settings.position === "left") promptLinePositions[1] = "right";
    else if (settings.position === "right") promptLinePositions[1] = "left";

    return {
      promptLinePositions,
      principalSizeProp,
      deputySizeProp,
      deputyMinSizeProp,
      deputySizeValue,
      isHorizon,
    };
  }

  setup() {
    useDesktop().taskbarInst = this as any;
  }

  @Hook("onUnmounted") onUnmounted(): void {
    this.styles.dispose();
  }

  render(): VNodeChild {
    const { styles, desktop } = this;
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
