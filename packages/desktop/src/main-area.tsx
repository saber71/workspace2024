import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
} from "vue-class";
import { useDesktop, useDesktopStyles } from "./stores";

export interface MainAreaProps extends VueComponentBaseProps {}

@Component()
export class MainAreaInst extends VueComponent<MainAreaProps> {
  static readonly defineProps: ComponentProps<MainAreaProps> = ["inst"];

  setup() {
    useDesktop().mainAreaInst = this as any;
  }

  render(): VNodeChild {
    const styles = useDesktopStyles().mainAreaStyles;
    return <div style={styles.container}></div>;
  }
}

export default toNative<MainAreaProps>(MainAreaInst);
