import { rem } from "@/components/desktop/constants.ts";
import {
  DesktopSettingService,
  TaskbarHelper,
} from "@/components/desktop/services";
import StartMenu from "@/components/desktop/taskbar/start-button/start-menu.tsx";
import { WindowsFilled } from "@ant-design/icons-vue";
import { dynamic, Styles } from "styles";
import { type VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
  Inject,
  Disposable,
  Mut,
  Link,
} from "vue-class";

export interface StartButtonProps extends VueComponentBaseProps {}

@Component()
export class StartButtonInst extends VueComponent<StartButtonProps> {
  static readonly defineProps: ComponentProps<StartButtonProps> = ["inst"];

  @Inject() taskbarHelper: TaskbarHelper;
  @Inject() desktopSettingService: DesktopSettingService;
  @Mut() showPopper = false;
  @Disposable() styles = new Styles<"start-button" | "start-button-wrapper">()
    .addDynamic("start-button", () => {
      const { deputySizeProp } = this.taskbarHelper;
      return {
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexBasis: dynamic(rem(50)),
        [deputySizeProp]: "100%",
      };
    })
    .addDynamic("start-button-wrapper", () => {
      return {
        transition: "all 0.3s linear",
        fontSize: dynamic(rem(18)),
        background: dynamic(
          this.showPopper ? "rgba(255, 255, 255, 0.5)" : "transparent",
        ),
      };
    })
    .add(
      "start-button-wrapper",
      {
        background: "rgba(255, 255, 255, 0.5)",
      },
      "hover",
    );
  @Link() el: HTMLElement;

  render(): VNodeChild {
    const styles = this.styles;
    return (
      <div
        ref={"el"}
        class={styles.classNames["start-button"]}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          class={
            "w-full h-full flex justify-center items-center " +
            styles.classNames["start-button-wrapper"]
          }
          title={"开始"}
          onClick={() => (this.showPopper = !this.showPopper)}
        >
          <WindowsFilled />
        </div>
        {this.showPopper ? (
          <StartMenu
            reference={this.el}
            show={this.showPopper}
            onUpdateShow={(val) => (this.showPopper = val)}
            popperOption={{ placement: "top-start" }}
          />
        ) : null}
      </div>
    );
  }
}

export default toNative<StartButtonProps>(StartButtonInst);
