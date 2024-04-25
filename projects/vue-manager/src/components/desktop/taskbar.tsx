import type { DesktopTypes } from "@/components/desktop/types.ts";
import { type CSSStyle, dynamic, Styles } from "styles";
import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
  Link,
} from "vue-class";
import { TASKBAR_INIT_HEIGHT, TASKBAR_INIT_WIDTH } from "./constants";
import { rem, useDesktop, useTaskbarSetting } from "./stores";
import ContentArea from "./taskbar/content-area";
import InfoArea from "./taskbar/info-area";
import PromptLine from "./taskbar/prompt-line";
import StartButton from "./taskbar/start-button";

function setContainerPosition(
  result: CSSStyle,
  value: DesktopTypes.TaskbarSetting,
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

  @Link() el: HTMLElement;

  readonly styles = new Styles<"taskbar">()
    .addDynamic("taskbar", () => {
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
        background: "rgba(240,250,250,0.5)",
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
      "taskbar",
      () => {
        const result: CSSStyle = {};
        return setContainerPosition(result, useTaskbarSetting().value, true);
      },
      { pseudoClasses: "hover" },
    );

  setup() {
    useDesktop().taskbarInst = this as any;
  }

  onBeforeUnmounted(): void {
    this.styles.dispose();
  }

  render(): VNodeChild {
    const { styles } = this;
    const setting = useTaskbarSetting().value;
    return (
      <div ref={"el"} class={styles.classNames.taskbar}>
        <StartButton />
        <ContentArea />
        <InfoArea />
        {setting.lock ? null : <PromptLine />}
      </div>
    );
  }
}

export default toNative<TaskbarProps>(TaskbarInst);
