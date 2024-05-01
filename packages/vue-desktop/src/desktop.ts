import { Container } from "dependency-injection";
import { h, ref } from "vue";
import { VueDesktopConstants } from "./constants";
import type { RenderExtra } from "./types";

export class Desktop {
  constructor(parentContainer: Container) {
    this.container
      .extend(parentContainer)
      .bindInstance(this)
      .bindValue(VueDesktopConstants.RENDER_EXTRA, this.renderExtra);
  }

  readonly container = new Container();
  readonly renderExtra = ref<RenderExtra>([]);

  render() {
    const component = this.container.getValue(
      VueDesktopConstants.APP_COMPONENT,
    );
    return h(component, { renderExtra: this.renderExtra.value });
  }
}
