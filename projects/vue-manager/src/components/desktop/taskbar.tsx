import {
  DesktopService,
  DesktopSettingService,
  TaskbarHelper,
} from "@/components/desktop/services";
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
  Inject,
  Disposable,
} from "vue-class";
import { DesktopConstants, rem } from "./constants";
import ContentArea from "./taskbar/content-area";
import InfoArea from "./taskbar/info-area";
import PromptLine from "./taskbar/prompt-line";
import StartButton from "./taskbar/start-button";

function setContainerPosition(
  result: CSSStyle,
  position: DesktopTypes.Setting["taskbar.position"],
  show: boolean,
) {
  switch (position) {
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
  @Inject() desktopService: DesktopService;
  @Inject() desktopSettingService: DesktopSettingService;
  @Inject() taskbarHelper: TaskbarHelper;
  @Disposable() styles = new Styles<"taskbar">()
    .addDynamic("taskbar", () => {
      const {
        deputySizeValue,
        deputySizeProp,
        deputyMinSizeProp,
        principalSizeProp,
        isHorizon,
      } = this.taskbarHelper;
      const result: CSSStyle = {
        [principalSizeProp]: "100%",
        [deputySizeProp]: dynamic(deputySizeValue),
        [deputyMinSizeProp]: dynamic(
          rem(
            isHorizon
              ? DesktopConstants.TASKBAR_INIT_WIDTH
              : DesktopConstants.TASKBAR_INIT_HEIGHT,
          ),
        ),
        display: "flex",
        flexDirection: dynamic(isHorizon ? "column" : "row"),
        flexShrink: "0",
        background: "rgba(240,250,250,0.5)",
        backdropFilter: "blur(10px)",
        position: dynamic(
          this.desktopSettingService.get("taskbar.autoHide.enabled") === "true"
            ? "absolute"
            : "relative",
        ),
        transitionProperty: "transform",
        transitionDuration: "200ms",
        transitionDelay: "500ms",
      };
      if (
        this.desktopSettingService.get("taskbar.autoHide.enabled") === "true"
      ) {
        setContainerPosition(
          result,
          this.desktopSettingService.get("taskbar.position"),
          this.desktopSettingService.get("taskbar.autoHide.forceShow") ===
            "true",
        );
      }
      return result;
    })
    .addDynamic(
      "taskbar",
      () => {
        const result: CSSStyle = {};
        return setContainerPosition(
          result,
          this.desktopSettingService.get("taskbar.position"),
          true,
        );
      },
      { pseudoClasses: "hover" },
    );

  setup() {
    this.desktopService.taskbarInst = this as any;
  }

  render(): VNodeChild {
    const { styles } = this;
    return (
      <div ref={"el"} class={styles.classNames.taskbar}>
        <StartButton />
        <ContentArea />
        <InfoArea />
        {this.desktopSettingService.get("taskbar.lock") === "true" ? null : (
          <PromptLine />
        )}
      </div>
    );
  }
}

export default toNative<TaskbarProps>(TaskbarInst);
