import {
  DesktopService,
  DesktopSettingService,
  TaskbarHelper,
} from "@/components/desktop/services";
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
  Inject,
  Disposable,
} from "vue-class";

export interface PromptLineProps extends VueComponentBaseProps {}

@Component()
export class PromptLineInst extends VueComponent<PromptLineProps> {
  static readonly defineProps: ComponentProps<PromptLineProps> = ["inst"];

  @Inject() desktopService: DesktopService;
  @Inject() desktopSettingService: DesktopSettingService;
  @Inject() taskbarHelper: TaskbarHelper;
  @Disposable() styles = new Styles<"promptLine">().addDynamic(
    "promptLine",
    () => {
      const {
        promptLinePositions,
        deputySizeProp,
        principalSizeProp,
        isHorizon,
      } = this.taskbarHelper;
      const position = this.desktopSettingService.get("taskbar.position");
      let transform = "";
      if (position === "left") transform = "translateX(50%)";
      else if (position === "right") transform = "translateX(-50%)";
      else if (position === "top") transform = "translateY(50%)";
      else if (position === "bottom") transform = "translateY(-50%)";
      return {
        position: "absolute",
        [promptLinePositions[0]]: 0,
        [promptLinePositions[1]]: 0,
        [principalSizeProp]: "100%",
        [deputySizeProp]: "5px",
        transform: dynamic(transform),
        cursor: dynamic(isHorizon ? "col-resize" : "row-resize"),
      };
    },
  );

  @Link() el: HTMLElement;

  onMounted() {
    let downPosition: MouseEvent | undefined;
    useBehavior()
      .wrapEventTarget(this.el)
      .addEventListener("mousedown", (e) => {
        this.desktopService.cursor = getComputedStyle(this.el).cursor;
        downPosition = e;
        useBehavior().curType = "resize-taskbar";
      });
    useBehavior()
      .wrapEventTarget(window)
      .addEventListener(
        "mouseup",
        () => {
          downPosition = undefined;
          useBehavior().curType = "";
          this.desktopService.cursor = "default";
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
            const { deputySizeProp } = this.taskbarHelper;
            const position = this.desktopSettingService.get("taskbar.position");
            const offsetX = e.x - downPosition.x;
            const offsetY = e.y - downPosition.y;
            let deputySize =
              this.desktopService.taskbarInst.el.getBoundingClientRect()[
                deputySizeProp
              ];
            if (position === "left") {
              deputySize += offsetX;
            } else if (position === "right") {
              deputySize -= offsetX;
            } else if (position === "bottom") {
              deputySize -= offsetY;
            } else if (position === "top") {
              deputySize += offsetY;
            }
            this.desktopSettingService.set(
              "taskbar.deputySize",
              `${deputySize}px`,
            );
            downPosition = e;
          }
        },
        {
          behaviorTypes: "resize-taskbar",
          key: this,
        },
      );
  }

  onBeforeUnmounted(): void {
    useBehavior().wrapEventTarget(this.el).dispose();
    useBehavior().wrapEventTarget(window).dispose({ key: this });
  }

  render(): VNodeChild {
    return <div ref={"el"} class={this.styles.classNames.promptLine}></div>;
  }
}

export default toNative<PromptLineProps>(PromptLineInst);
