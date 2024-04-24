import { useBehavior } from "@/stores";
import { dynamic, Styles } from "styles";
import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
  Link,
} from "vue-class";
import { useDesktop, useTaskbarSetting } from "../stores";

export interface PromptLineProps extends VueComponentBaseProps {}

@Component()
export class PromptLineInst extends VueComponent<PromptLineProps> {
  static readonly defineProps: ComponentProps<PromptLineProps> = ["inst"];

  readonly styles = new Styles<"promptLine">().addDynamic("promptLine", () => {
    const {
      promptLinePositions,
      deputySizeProp,
      principalSizeProp,
      isHorizon,
      value,
    } = useTaskbarSetting();
    let transform = "";
    if (value.position === "left") transform = "translateX(50%)";
    else if (value.position === "right") transform = "translateX(-50%)";
    else if (value.position === "top") transform = "translateY(50%)";
    else if (value.position === "bottom") transform = "translateY(-50%)";
    return {
      position: "absolute",
      [promptLinePositions[0]]: 0,
      [promptLinePositions[1]]: 0,
      [principalSizeProp]: "100%",
      [deputySizeProp]: "5px",
      transform: dynamic(transform),
      cursor: dynamic(isHorizon ? "col-resize" : "row-resize"),
    };
  });

  @Link() el: HTMLElement;

  onMounted() {
    let downPosition: MouseEvent | undefined;
    useBehavior()
      .wrapEventTarget(this.el)
      .addEventListener("mousedown", (e) => {
        useDesktop().cursor = getComputedStyle(this.el).cursor;
        downPosition = e;
        useBehavior().curBehavior = "resize-taskbar";
      });
    useBehavior()
      .wrapEventTarget(window)
      .addEventListener(
        "mouseup",
        () => {
          downPosition = undefined;
          useBehavior().curBehavior = "";
          useDesktop().resetCursor();
        },
        {
          behaviorTypes: "resize-taskbar",
          firedOnLeave: true,
          key: this,
        },
      )
      .addEventListener(
        "mousemove",
        (e) => {
          if (downPosition) {
            const { value, deputySizeProp } = useTaskbarSetting();
            const offsetX = e.x - downPosition.x;
            const offsetY = e.y - downPosition.y;
            let deputySize =
              useDesktop().taskbarInst.el.getBoundingClientRect()[
                deputySizeProp
              ];
            if (value.position === "left") {
              deputySize += offsetX;
            } else if (value.position === "right") {
              deputySize -= offsetX;
            } else if (value.position === "bottom") {
              deputySize -= offsetY;
            } else if (value.position === "top") {
              deputySize += offsetY;
            }
            value.deputySize = deputySize + "px";
            downPosition = e;
          }
        },
        {
          behaviorTypes: "resize-taskbar",
          key: this,
        },
      );
  }

  onUnmounted(): void {
    this.styles.dispose();
    useBehavior().wrapEventTarget(this.el).dispose();
    useBehavior().wrapEventTarget(window).dispose({ key: this });
  }

  render(): VNodeChild {
    return <div ref={"el"} class={this.styles.classNames.promptLine}></div>;
  }
}

export default toNative<PromptLineProps>(PromptLineInst);
