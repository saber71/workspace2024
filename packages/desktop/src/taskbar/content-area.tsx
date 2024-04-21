import { Styles } from "styles";
import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
} from "vue-class";
import { useTaskbarSetting } from "../stores";

export interface ContentAreaProps extends VueComponentBaseProps {}

@Component()
export class ContentAreaInst extends VueComponent<ContentAreaProps> {
  static readonly defineProps: ComponentProps<ContentAreaProps> = ["inst"];

  readonly styles = new Styles<"contentArea">().addDynamic(
    "contentArea",
    () => {
      const { deputySizeProp } = useTaskbarSetting();
      return {
        flexGrow: 1,
        [deputySizeProp]: "100%",
      };
    },
  );

  render(): VNodeChild {
    return <div class={this.styles.classNames.contentArea}></div>;
  }
}

export default toNative<ContentAreaProps>(ContentAreaInst);
