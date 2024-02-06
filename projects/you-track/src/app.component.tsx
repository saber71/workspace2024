import { StyleProvider } from "ant-design-vue";
import type { VNodeChild } from "vue";
import { VueComponent, toNative, Component } from "vue-class";
import { RouterView } from "vue-router";

@Component()
class AppComponent extends VueComponent {
  render(): VNodeChild {
    return (
      <StyleProvider>
        <div class={"text-amber-800 bg-black"}>123</div>
        <RouterView />
      </StyleProvider>
    );
  }
}

export default toNative(AppComponent);
