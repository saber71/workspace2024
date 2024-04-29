import type {
  DesktopService,
  DesktopSettingService,
} from "@/components/desktop/services";
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
} from "vue-class";
import Main from "./main-area";
import Taskbar from "./taskbar";
import "./linker";
import "./setting-store";
import "./services";

export interface DesktopProps extends VueComponentBaseProps {}

@Component()
export class DesktopInst extends VueComponent<DesktopProps> {
  static readonly defineProps: ComponentProps<DesktopProps> = ["inst"];

  @Link() wrapperEl: HTMLElement;
  @Inject("DesktopService") desktopService: DesktopService;
  @Inject("DesktopSettingService") desktopSettingService: DesktopSettingService;

  readonly styles = new Styles<"container" | "wrapper">()
    .add("container", {
      width: "100%",
      height: "100%",
      overflow: "auto",
      color: "black",
    })
    .addDynamic("wrapper", () => {
      const position = this.desktopSettingService.get("taskbar.position");
      let flexDirection: any;
      if (position === "left") flexDirection = "row-reverse";
      else if (position === "right") flexDirection = "row";
      else if (position === "top") flexDirection = "column-reverse";
      else flexDirection = "column";
      return {
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: dynamic(flexDirection),
        background: "wheat",
        cursor: "default",
        overflow: "hidden",
      };
    });

  setup() {
    this.desktopService.desktopInst = this;
  }

  onUnmounted() {
    this.desktopService.eventBus.emit("close");
  }

  render(): VNodeChild {
    return (
      <div id={"desktop-container"} class={this.styles.classNames.container}>
        <div ref={"wrapperEl"} class={this.styles.classNames.wrapper}>
          <Main></Main>
          <Taskbar></Taskbar>
        </div>
      </div>
    );
  }
}

export default toNative<DesktopProps>(DesktopInst);
