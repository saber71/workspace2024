import { createPopper, Instance } from "@popperjs/core";
import { dynamic, Styles } from "styles";
import { nextTick, type VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
  Link,
  Mut,
  Watcher,
} from "vue-class";
import { useDesktop, useTaskbarSetting } from "../../stores";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "numeric",
  day: "2-digit",
});
const cnDateFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "2-digit",
});
const chineseDateFormatter = new Intl.DateTimeFormat("zh-u-ca-chinese", {
  dateStyle: "full",
});
const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  hour12: false,
  minute: "2-digit",
});
const weekFormatter = new Intl.DateTimeFormat(undefined, { weekday: "short" });

export interface TimeProps extends VueComponentBaseProps {}

@Component()
export class TimeInst extends VueComponent<TimeProps> {
  static readonly defineProps: ComponentProps<TimeProps> = ["inst"];

  readonly styles = new Styles<"time" | "popper">()
    .addDynamic("time", () => {
      const { deputySizeProp } = useTaskbarSetting();
      return {
        fontSize: "0.75rem",
        userSelect: "none",
        [deputySizeProp]: "100%",
        padding: dynamic(deputySizeProp === "width" ? "5px 0" : "0 5px"),
        display: "flex",
        alignItems: "center",
        textAlign: "center",
      };
    })
    .add(
      "time",
      {
        background: "rgba(255,255,255,0.5)",
      },
      "hover",
    )
    .add("popper", {
      width: "300px",
      height: "100px",
      background: "red",
    });

  @Link() timeEl: HTMLElement;
  @Link() popperEl: HTMLElement;
  @Mut() showPopper: boolean = false;
  popperInstance?: Instance;

  @Watcher() show() {
    if (this.showPopper) {
      nextTick(() => {
        const popper = createPopper(this.timeEl, this.popperEl, {
          placement: "top",
          strategy: "fixed",
        });
        popper.update();
        this.popperInstance = popper;
      });
    } else {
      this.popperInstance?.destroy();
      this.popperInstance = undefined;
    }
  }

  render(): VNodeChild {
    const styles = this.styles;
    const desktop = useDesktop();
    const cnDate = cnDateFormatter.format(desktop.timestamp);
    const week = weekFormatter.format(desktop.timestamp).replace("周", "星期");
    return (
      <div
        ref={"timeEl"}
        class={styles.classNames.time}
        onClick={() => (this.showPopper = !this.showPopper)}
      >
        <div title={cnDate + "\n" + week}>
          {timeFormatter.format(desktop.timestamp)}
          <br />
          {dateFormatter.format(desktop.timestamp)}
        </div>
        {this.showPopper ? (
          <div ref={"popperEl"} class={styles.classNames.popper}>
            {chineseDateFormatter.format(desktop.timestamp)}
          </div>
        ) : null}
      </div>
    );
  }
}

export default toNative<TimeProps>(TimeInst);
