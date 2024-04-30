import { containerLabel } from "dependency-injection";
import type { DefineSetupFnComponent, Ref, VNodeChild } from "vue";
import type { RenderExtra } from "./types";

export namespace DesktopConstants {
  export const APP_COMPONENT = containerLabel<
    DefineSetupFnComponent<{
      renderExtra: RenderExtra;
    }>
  >("vue-desktop:app-component");
  export const RENDER_EXTRA = containerLabel<Ref<RenderExtra>>(
    "vue-desktop:render-extra",
  );
}
