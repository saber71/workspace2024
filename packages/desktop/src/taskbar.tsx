import { WindowsFilled } from "@ant-design/icons-vue";
import type { CSSProperties, VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
  Computed,
} from "vue-class";
import { TASKBAR_INIT_HEIGHT } from "./constants";
import { rem, useDesktop, useSettings } from "./stores";

export interface TaskbarProps extends VueComponentBaseProps {}

@Component()
export class TaskbarInst extends VueComponent<TaskbarProps> {
  static readonly defineProps: ComponentProps<TaskbarProps> = ["inst"];

  readonly desktop = useDesktop();

  @Computed() get styles() {
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
      container: {
        [principalSizeProp]: "100%",
        [deputySizeProp]: deputySizeValue,
        [deputyMinSizeProp]: rem(TASKBAR_INIT_HEIGHT),
        display: "flex",
        flexDirection: isHorizon ? "col" : "row",
        position: "absolute",
        left:
          settings.position !== "right"
            ? "0"
            : `calc(100% - ${deputySizeValue})`,
        top:
          settings.position !== "bottom"
            ? 0
            : `calc(100% - ${deputySizeValue})`,
        background: "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(10px)",
      } as CSSProperties,
      promptLine: {
        position: "absolute",
        [promptLinePositions[0]]: 0,
        [promptLinePositions[1]]: 0,
        [principalSizeProp]: "100%",
        [deputySizeProp]: "3px",
        transform: isHorizon ? "translateX(-50%)" : "translateY(-50%)",
        cursor: isHorizon ? "row-resize" : "col-resize",
      } as CSSProperties,
      startButton: {
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexBasis: rem(50),
        [deputySizeProp]: "100%",
        fontSize: rem(18),
        cursor: "pointer",
        transition: "all 0.3s ease-in-out",
      } as CSSProperties,
      contentArea: {
        flexGrow: 1,
        [deputySizeProp]: "100%",
      } as CSSProperties,
      infoArea: {
        flexShrink: 0,
        [principalSizeProp]: "100px",
        [deputySizeProp]: "100%",
        display: "flex",
        alignItems: "center",
      } as CSSProperties,
      time: {
        textAlign: "center",
        fontSize: "0.75rem",
      } as CSSProperties,
    };
  }

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
