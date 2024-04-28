import type { DesktopTypes } from "@/components/desktop/types.ts";
import { readonly } from "vue";

export namespace DesktopConstants {
  export const TASKBAR_INIT_HEIGHT = 40;
  export const TASKBAR_INIT_WIDTH = 70;
  export const BASE_FONT_SIZE = 16;
  export const PRIMARY_COLOR = "#1677ff";
  export const PRIMARY_HOVER_COLOR = "#69b1ff";
  export const BACKGROUND_COLOR = "rgba(245,245,235,0.3)";
  export const InitSetting = readonly<DesktopTypes.Setting>({
    "taskbar.position": "bottom",
    "taskbar.small": "false",
    "taskbar.lock": "false",
    "taskbar.autoHide.forceShow": "false",
    "taskbar.autoHide.enabled": "false",
    "taskbar.deputySize": "",
  });
  export const SettingKeys = readonly<Array<keyof DesktopTypes.Setting>>(
    Object.keys(InitSetting) as any,
  );
  export const Label_Linker = "Linker";
  export const Label_SettingStore = "SettingStore";
}
