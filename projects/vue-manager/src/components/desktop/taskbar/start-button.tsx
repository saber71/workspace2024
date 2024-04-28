import { rem } from "@/components/desktop/constants.ts";
import type { TaskbarHelper } from "@/components/desktop/services";
import { WindowsFilled } from "@ant-design/icons-vue";
import { dynamic, Styles } from "styles";
import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
  Inject,
} from "vue-class";

export interface StartButtonProps extends VueComponentBaseProps {}

@Component()
export class StartButtonInst extends VueComponent<StartButtonProps> {
  static readonly defineProps: ComponentProps<StartButtonProps> = ["inst"];

  @Inject("TaskbarHelper") taskbarHelper: TaskbarHelper;
  readonly styles = new Styles<"startButton">()
    .addDynamic("startButton", () => {
      const { deputySizeProp } = this.taskbarHelper;
      return {
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexBasis: dynamic(rem(50)),
        [deputySizeProp]: "100%",
        fontSize: dynamic(rem(18)),
        cursor: "pointer",
        transition: "all 0.3s linear",
      };
    })
    .add(
      "startButton",
      {
        background: "rgba(255, 255, 255, 0.5)",
      },
      "hover",
    );

  onBeforeUnmounted(): void {
    this.styles.dispose();
  }

  render(): VNodeChild {
    return (
      <div class={this.styles.classNames.startButton} title={"开始"}>
        <WindowsFilled />
      </div>
    );
  }
}

export default toNative<StartButtonProps>(StartButtonInst);
