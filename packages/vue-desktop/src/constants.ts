import { containerLabel } from "dependency-injection";
import type { DefineSetupFnComponent, Ref } from "vue";
import type { RenderExtra } from "./types";

export namespace VueDesktopConstants {
  export const APP_COMPONENT = containerLabel<
    DefineSetupFnComponent<{
      renderExtra: RenderExtra;
    }>
  >("vue-desktop:app-component");
  export const RENDER_EXTRA = containerLabel<Ref<RenderExtra>>(
    "vue-desktop:render-extra",
  );
}
