import { TaskbarHelper } from "@/components/desktop/services";
import { Styles } from "styles";
import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
  Inject,
  Disposable,
} from "vue-class";

export interface ContentAreaProps extends VueComponentBaseProps {}

@Component()
export class ContentAreaInst extends VueComponent<ContentAreaProps> {
  static readonly defineProps: ComponentProps<ContentAreaProps> = ["inst"];

  @Inject() taskbarHelper: TaskbarHelper;
  @Disposable() styles = new Styles<"contentArea">().addDynamic(
    "contentArea",
    () => {
      const { deputySizeProp } = this.taskbarHelper;
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
