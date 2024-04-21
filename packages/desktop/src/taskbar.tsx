import { WindowsFilled } from "@ant-design/icons-vue";
import { type CSSStyle, dynamic, Styles } from "styles";
import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
  Hook,
} from "vue-class";
import { TASKBAR_INIT_HEIGHT, TASKBAR_INIT_WIDTH } from "./constants";
import { rem, useDesktop, useTaskbarSetting } from "./stores";

function setContainerPosition(
  result: CSSStyle,
  value: TaskbarSetting,
  show: boolean,
) {
  switch (value.position) {
    case "bottom":
      result.bottom = "0";
      result.left = "0";
      result.transform = dynamic(
        show ? "translate(0, 0)" : "translate(0, 100%)",
      );
      break;
    case "left":
      result.left = "0";
      result.top = "0";
      result.transform = dynamic(
        show ? "translate(0, 0)" : "translate(-100%, 0)",
      );
      break;
    case "right":
      result.right = "0";
      result.top = "0";
      result.transform = dynamic(
        show ? "translate(0, 0)" : "translate(100%, 0)",
      );
      break;
    case "top":
      result.top = "0";
      result.left = 0;
      result.transform = dynamic(
        show ? "translate(0, 0)" : "translate(0, -100%)",
      );
      break;
  }
  return result;
}

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
        flexBasis: "5px",
        [deputySizeProp]: "100%",
        transition: "all 0.1s",
      };
    })
    .add(
      "blank",
      {
        boxShadow: "-2px -2px 2px 0 rgba(0,0,0,0.2)",
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
        value,
      } = useTaskbarSetting();
      const result: CSSStyle = {
        [principalSizeProp]: "100%",
        [deputySizeProp]: dynamic(deputySizeValue),
        [deputyMinSizeProp]: dynamic(
          rem(isHorizon ? TASKBAR_INIT_WIDTH : TASKBAR_INIT_HEIGHT),
        ),
        display: "flex",
        flexDirection: dynamic(isHorizon ? "column" : "row"),
        flexShrink: "0",
        background: "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(10px)",
        position: dynamic(value.autoHide.enabled ? "absolute" : "relative"),
        transitionProperty: "transform",
        transitionDuration: "200ms",
        transitionDelay: "500ms",
      };
      if (value.autoHide.enabled) {
        setContainerPosition(result, value, value.autoHide.forceShow);
      }
      return result;
    })
    .addDynamic(
      "container",
      () => {
        const result: CSSStyle = {};
        return setContainerPosition(result, useTaskbarSetting().value, true);
      },
      { pseudoClasses: "hover" },
    )
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
        overflow: "hidden",
        gap: "3px",
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
    const setting = useTaskbarSetting().value;
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
        {setting.lock ? null : <div class={styles.classNames.promptLine}></div>}
      </div>
    );
  }
}

export default toNative<TaskbarProps>(TaskbarInst);
