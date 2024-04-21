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

export interface PromptLineProps extends VueComponentBaseProps {}

@Component()
export class PromptLineInst extends VueComponent<PromptLineProps> {
  static readonly defineProps: ComponentProps<PromptLineProps> = ["inst"];

  readonly styles = new Styles<"promptLine">().addDynamic("promptLine", () => {
    const {
      promptLinePositions,
      deputySizeProp,
      principalSizeProp,
      isHorizon,
    } = useTaskbarSetting();
    return {
      position: "absolute",
      [promptLinePositions[0]]: 0,
      [promptLinePositions[1]]: 0,
      [principalSizeProp]: "100%",
      [deputySizeProp]: "3px",
      transform: dynamic(isHorizon ? "translateX(-50%)" : "translateY(-50%)"),
      cursor: dynamic(isHorizon ? "col-resize" : "row-resize"),
    };
  });

  render(): VNodeChild {
    return <div class={this.styles.classNames.promptLine}></div>;
  }
}

export default toNative<PromptLineProps>(PromptLineInst);
