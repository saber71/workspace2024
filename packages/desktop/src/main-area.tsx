import { Styles } from "styles";
import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
} from "vue-class";
import { useDesktop, useTaskbarSetting } from "./stores";

export interface MainAreaProps extends VueComponentBaseProps {}

@Component()
export class MainAreaInst extends VueComponent<MainAreaProps> {
  static readonly defineProps: ComponentProps<MainAreaProps> = ["inst"];

  readonly styles = new Styles<"container">().addDynamic("container", () => {
    const { deputySizeProp } = useTaskbarSetting();
    return {
      position: "relative",
      flexGrow: "1",
      [deputySizeProp]: "100%",
    };
  });

  setup() {
    useDesktop().mainAreaInst = this as any;
  }

  render(): VNodeChild {
    return <div class={this.styles.classNames.container}></div>;
  }
}

export default toNative<MainAreaProps>(MainAreaInst);
