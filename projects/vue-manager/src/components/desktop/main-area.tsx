import { DesktopService, TaskbarHelper } from "@/components/desktop/services";
import { Styles } from "styles";
import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
  Inject,
} from "vue-class";

export interface MainAreaProps extends VueComponentBaseProps {}

@Component()
export class MainAreaInst extends VueComponent<MainAreaProps> {
  static readonly defineProps: ComponentProps<MainAreaProps> = ["inst"];

  @Inject() desktopService: DesktopService;
  @Inject() taskbarHelper: TaskbarHelper;
  readonly styles = new Styles<"container">().addDynamic("container", () => {
    const { deputySizeProp } = this.taskbarHelper;
    return {
      position: "relative",
      flexGrow: "1",
      [deputySizeProp]: "100%",
    };
  });

  setup() {
    this.desktopService.mainAreaInst = this;
  }

  render(): VNodeChild {
    return <div class={this.styles.classNames.container}>main-area</div>;
  }
}

export default toNative<MainAreaProps>(MainAreaInst);
