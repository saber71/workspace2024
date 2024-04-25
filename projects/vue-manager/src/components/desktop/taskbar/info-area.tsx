import { dynamic, Styles } from "styles";
import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
} from "vue-class";
import { useTaskbarSetting } from "../stores";
import Time from "./info-area/time";

export interface InfoAreaProps extends VueComponentBaseProps {}

@Component()
export class InfoAreaInst extends VueComponent<InfoAreaProps> {
  static readonly defineProps: ComponentProps<InfoAreaProps> = ["inst"];

  readonly styles = new Styles<"infoArea" | "blank">()
    .addDynamic("infoArea", () => {
      const { deputySizeProp, isHorizon } = useTaskbarSetting();
      return {
        flexShrink: 0,
        flexBasis: "100px",
        [deputySizeProp]: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        flexDirection: dynamic(isHorizon ? "column" : "row"),
        overflow: "hidden",
        gap: "3px",
      };
    })
    .add(
      "blank",
      {
        boxShadow: "-2px -2px 2px 0 rgba(0,0,0,0.2)",
      },
      "hover",
    )
    .addDynamic("blank", () => {
      const { deputySizeProp } = useTaskbarSetting();
      return {
        flexBasis: "5px",
        [deputySizeProp]: "100%",
        transition: "all 0.1s",
      };
    });

  onBeforeUnmounted(): void {
    this.styles.dispose();
  }

  render(): VNodeChild {
    const styles = this.styles;
    return (
      <div class={styles.classNames.infoArea}>
        <Time />
        <div class={styles.classNames.blank}></div>
      </div>
    );
  }
}

export default toNative<InfoAreaProps>(InfoAreaInst);
