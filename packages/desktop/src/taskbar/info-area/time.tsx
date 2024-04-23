import { DownOutlined, UpOutlined } from "@ant-design/icons-vue";
import { createPopper, Instance } from "@popperjs/core";
import { Button, Flex } from "ant-design-vue";
import { dynamic, Styles } from "styles";
import { CSSProperties, nextTick, type VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  Link,
  Mut,
  toNative,
  VueComponent,
  type VueComponentBaseProps,
  Watcher,
} from "vue-class";
import {
  BACKGROUND_COLOR,
  PRIMARY_COLOR,
  PRIMARY_HOVER_COLOR,
} from "../../constants";
import { rem, useBehavior, useDesktop, useTaskbarSetting } from "../../stores";

const weekTexts = ["日", "一", "二", "三", "四", "五", "六"];
const baseCalendarGridStyle: CSSProperties = {
  width: rem(40),
  height: rem(40),
  boxSizing: "border-box",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

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
const fullTimeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  hour12: false,
  minute: "2-digit",
  second: "2-digit",
});
const weekFormatter = new Intl.DateTimeFormat(undefined, { weekday: "short" });

function getChineseMonthDay(date: Date) {
  const string = chineseDateFormatter.format(date);
  const si = string.indexOf("年"),
    ei = string.indexOf("星");
  return string.substring(si + 1, ei);
}

function getChineseDay(date: Date) {
  const string = chineseDateFormatter.format(date);
  const si = string.indexOf("月"),
    ei = string.indexOf("星");
  return string.substring(si + 1, ei);
}

function getChineseMonth(date: Date) {
  const string = chineseDateFormatter.format(date);
  const si = string.indexOf("年"),
    ei = string.indexOf("月");
  return string.substring(si + 1, ei + 1);
}

export interface TimeProps extends VueComponentBaseProps {}

@Component()
export class TimeInst extends VueComponent<TimeProps> {
  static readonly defineProps: ComponentProps<TimeProps> = ["inst"];

  readonly styles = new Styles<
    | "time"
    | "hoverableTime"
    | "popper"
    | "popperHeader"
    | "popperHeaderTime"
    | "popperCalendar"
    | "arrow"
    | "calendarGrid"
    | "calendarGrid_inner"
    | "isToday"
    | "isToday_inner"
    | "isAnotherMonth"
  >()
    .add("isToday_inner", {
      border: "3px solid white",
      boxSizing: "border-box",
    })
    .add("calendarGrid", {
      ...baseCalendarGridStyle,
      border: "2px solid transparent",
    })
    .add(
      "calendarGrid",
      {
        border: "2px solid white",
      },
      "hover",
    )
    .add("calendarGrid_inner", {
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
    })
    .add("isAnotherMonth", {
      opacity: "0.5",
    })
    .add("isToday", {
      color: "white",
      background: PRIMARY_COLOR,
      border: `2px solid ${PRIMARY_COLOR}`,
    })
    .add(
      "isToday",
      {
        border: "2px solid black",
      },
      "hover",
    )
    .add("arrow", { transition: "all 0.3s" })
    .add(
      "arrow",
      {
        color: PRIMARY_HOVER_COLOR,
      },
      "hover",
    )
    .add("popperCalendar", {
      padding: rem(10),
      borderBottom: "1px solid #aaa",
    })
    .add("popperHeaderTime", {
      fontSize: rem(40),
    })
    .add("popperHeader", {
      padding: rem(10),
      borderBottom: "1px solid #aaa",
      textAlign: "left",
    })
    .addDynamic("time", () => {
      const { deputySizeProp } = useTaskbarSetting();
      return {
        fontSize: "0.75rem",
        userSelect: "none",
        [deputySizeProp]: "100%",
        display: "flex",
        alignItems: "center",
        textAlign: "center",
      };
    })
    .addDynamic("hoverableTime", () => {
      const { deputySizeProp } = useTaskbarSetting();
      return {
        width: "100%",
        height: "100%",
        padding: dynamic(deputySizeProp === "width" ? "5px 0" : "0 5px"),
        display: "flex",
        alignItems: "center",
      };
    })
    .add(
      "hoverableTime",
      {
        background: "rgba(255,255,255,0.5)",
      },
      "hover",
    )
    .addDynamic("popper", () => {
      const value = useTaskbarSetting().value;
      return {
        width: "300px",
        background: BACKGROUND_COLOR,
        backdropFilter: "blur(10px)",
        boxShadow: "0 2px 12px 0 rgba(0, 0, 0, 0.1)",
      };
    });

  @Link() timeEl: HTMLElement;
  @Link() popperEl: HTMLElement;
  @Mut() showPopper: boolean = false;
  @Mut() calendars: Array<
    Array<{
      timestamp: number;
      chineseDay: string;
      day: number;
      month: number;
      isToday: boolean;
    }>
  > = [];
  popperInstance?: Instance;
  year: number;
  month: number;

  @Watcher() updateCalendars() {
    this.calendars.length = 0;
    const monthOneDay = new Date(`${this.year}/${this.month}/1`);
    const today = new Date(useDesktop().timestamp);
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    const todayTimestamp = today.setMilliseconds(0);
    const oneDayMs = 86400000;
    let time = monthOneDay.getTime() - oneDayMs * monthOneDay.getDay();
    for (let i = 0; i < 6; i++) {
      const arr: any[] = [];
      this.calendars.push(arr);
      for (let j = 0; j < 7; j++) {
        const date = new Date(time);
        let chineseDay = getChineseDay(date);
        if (chineseDay === "初一") chineseDay = getChineseMonth(date);
        arr.push({
          timestamp: time,
          day: date.getDate(),
          month: date.getMonth() + 1,
          chineseDay,
          isToday: todayTimestamp === time,
        });
        time += oneDayMs;
      }
    }
  }

  jumpMonth(offset: number) {
    this.month += offset;
    if (this.month <= 0) {
      this.month = 12;
      this.year--;
    } else if (this.month > 12) {
      this.month = 1;
      this.year++;
    }
  }

  @Watcher() setupPopper() {
    if (this.showPopper) {
      if (this.popperInstance) return;
      const date = useDesktop().timestamp;
      this.year = date.getFullYear();
      this.month = date.getMonth() + 1;
      nextTick(() => {
        const popper = createPopper(this.timeEl, this.popperEl, {
          placement: "top",
          strategy: "absolute",
        });
        popper.update();
        this.popperInstance = popper;
        setTimeout(() => (enabled = true), 100);
      });
      let enabled = false;
      useBehavior()
        .wrapEventTarget(window)
        .addEventListener(
          "click",
          () => {
            if (enabled) this.showPopper = false;
          },
          {
            key: this,
          },
        );
    } else {
      this.popperInstance?.destroy();
      this.popperInstance = undefined;
      useBehavior()
        .wrapEventTarget(window)
        .removeEventListener("click", { key: this });
    }
  }

  onUnmounted() {
    this.styles.dispose();
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
        <div
          class={styles.classNames.hoverableTime}
          title={cnDate + "\n" + week}
        >
          {timeFormatter.format(desktop.timestamp)}
          <br />
          {dateFormatter.format(desktop.timestamp)}
        </div>
        {this.showPopper ? (
          <div
            ref={"popperEl"}
            class={styles.classNames.popper}
            onClick={(e) => e.stopPropagation()}
          >
            <div class={styles.classNames.popperHeader}>
              <div class={styles.classNames.popperHeaderTime}>
                {fullTimeFormatter.format(desktop.timestamp)}
              </div>
              <Button type={"link"}>
                {cnDate + " " + getChineseMonthDay(desktop.timestamp)}
              </Button>
            </div>
            <div class={styles.classNames.popperCalendar}>
              <Flex justify={"space-between"} align={"center"}>
                <div>{this.year + "年" + this.month + "月"}</div>
                <Flex>
                  <div
                    class={styles.classNames.arrow}
                    style={baseCalendarGridStyle}
                    onClick={() => this.jumpMonth(-1)}
                  >
                    <UpOutlined />
                  </div>
                  <div
                    class={styles.classNames.arrow}
                    style={baseCalendarGridStyle}
                    onClick={() => this.jumpMonth(1)}
                  >
                    <DownOutlined />
                  </div>
                </Flex>
              </Flex>
              <Flex>
                {weekTexts.map((val) => (
                  <span style={baseCalendarGridStyle}>{val}</span>
                ))}
              </Flex>
              {this.calendars.map((arr) => (
                <Flex>
                  {arr.map((item) => (
                    <div
                      class={
                        styles.classNames.calendarGrid +
                        " " +
                        (item.isToday ? styles.classNames.isToday : "")
                      }
                    >
                      <div
                        class={
                          styles.classNames.calendarGrid_inner +
                          " " +
                          (item.isToday
                            ? styles.classNames.isToday_inner
                            : "") +
                          (item.month !== this.month
                            ? styles.classNames.isAnotherMonth
                            : "")
                        }
                      >
                        <div>{item.day}</div>
                        <div style={"opacity:0.6;font-size:0.75rem;"}>
                          {item.chineseDay}
                        </div>
                      </div>
                    </div>
                  ))}
                </Flex>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default toNative<TimeProps>(TimeInst);
