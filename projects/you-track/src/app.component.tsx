import { StyleProvider } from "ant-design-vue";
import type { VNodeChild } from "vue";
import {
  VueComponent,
  toNative,
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
} from "vue-class";
import { RouterView } from "vue-router";

@Component()
class AppComponent extends VueComponent {
  static defineProps: ComponentProps<VueComponentBaseProps> = ["inst"];

  render(): VNodeChild {
    return (
      <StyleProvider>
        <RouterView />
      </StyleProvider>
    );
  }
}

export default toNative<VueComponentBaseProps>(AppComponent);
