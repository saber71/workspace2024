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
import Main from "./main-area";
import { useDesktop, useTaskbarSetting } from "./stores";
import Taskbar from "./taskbar";

export interface DesktopProps extends VueComponentBaseProps {}

@Component()
export class DesktopInst extends VueComponent<DesktopProps> {
  static readonly defineProps: ComponentProps<DesktopProps> = ["inst"];

  @Link() wrapperEl: HTMLElement;

  readonly styles = new Styles<"container" | "wrapper">()
    .add("container", {
      width: "100%",
      height: "100%",
      overflow: "auto",
      color: "black",
    })
    .addDynamic("wrapper", () => {
      const settings = useTaskbarSetting().value;
      let flexDirection: any;
      if (settings.position === "left") flexDirection = "row-reverse";
      else if (settings.position === "right") flexDirection = "row";
      else if (settings.position === "top") flexDirection = "column-reverse";
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
    useDesktop().desktopInst = this as any;
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
