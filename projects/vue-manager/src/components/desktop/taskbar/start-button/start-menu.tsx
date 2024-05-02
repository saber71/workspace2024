import {
  BasePopperInst,
  type BasePopperProps,
} from "@/components/BasePopper.tsx";
import { DesktopConstants, rem } from "@/components/desktop/constants.ts";
import { DesktopSettingService } from "@/components/desktop/services";
import { UnorderedListOutlined } from "@ant-design/icons-vue";
import { dynamic, Styles } from "styles";
import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  Disposable,
  Inject,
  Link,
  toNative,
} from "vue-class";

export interface StartMenuProps extends BasePopperProps {}

const actionBarWidth = 100;
const appListWidth = 200;

@Component()
export class StartMenuInst extends BasePopperInst<StartMenuProps> {
  static readonly defineProps: ComponentProps<StartMenuProps> = [
    ...(BasePopperInst.defineProps as any),
  ];

  @Inject() desktopSettingService: DesktopSettingService;
  @Disposable() styles = new Styles<
    "popper" | "action-bar" | "app-list" | "magnet-area"
  >()
    .add("app-list", {
      width: rem(appListWidth),
      height: "100%",
    })
    .add("action-bar", {
      width: rem(actionBarWidth),
      height: "100%",
    })
    .addDynamic("popper", () => {
      return {
        width: dynamic(
          this.desktopSettingService.get("start-button:popper-width"),
        ),
        height: dynamic(
          this.desktopSettingService.get("start-button:popper-height"),
        ),
        minWidth: rem(actionBarWidth + appListWidth),
        minHeight: rem(500),
        background: DesktopConstants.BACKGROUND_COLOR,
        backdropFilter: "blur(10px)",
        display: "flex",
        boxShadow: DesktopConstants.BOX_SHADOW,
      };
    });
  @Link() popperEl: HTMLElement;

  render(): VNodeChild {
    const styles = this.styles;
    return (
      <div class={styles.classNames.popper} ref={"popperEl"}>
        <div class={styles.classNames["action-bar"]}>
          <UnorderedListOutlined />
        </div>
        <div class={styles.classNames["app-list"]}>应用列表</div>
        <div class={styles.classNames["magnet-area"]}>磁贴区域</div>
      </div>
    );
  }
}

export default toNative<StartMenuProps>(StartMenuInst);
