import type { DesktopTypes } from "@/components/desktop/types.ts";
import { readonly } from "vue";

export namespace DesktopConstants {
  // size
  export const TASKBAR_INIT_HEIGHT = 40;
  export const TASKBAR_INIT_WIDTH = 70;
  export const BASE_FONT_SIZE = 16;

  // theme
  export const PRIMARY_COLOR = "#1677ff";
  export const PRIMARY_HOVER_COLOR = "#69b1ff";
  export const BACKGROUND_COLOR = "rgba(245,245,235,0.3)";
  export const BOX_SHADOW = "0 2px 12px 0 rgba(0, 0, 0, 0.25)";

  // 配置
  export const InitSetting = readonly<DesktopTypes.Setting>({
    "taskbar.position": "bottom",
    "taskbar.small": "false",
    "taskbar.lock": "false",
    "taskbar.autoHide.forceShow": "false",
    "taskbar.autoHide.enabled": "false",
    "taskbar.deputySize": "",
    "start-button:popper-width": "",
    "start-button:popper-height": "",
  });
  export const SettingKeys = readonly<Array<keyof DesktopTypes.Setting>>(
    Object.keys(InitSetting) as any,
  );

  // 容器标签
  export const Label_Linker = "Linker";
  export const Label_SettingStore = "SettingStore";

  // Linker相关
  export const LinkerKeyPrefix = readonly<RegExp[]>([/^desktop-setting:/]);
}

export function rem(px: number) {
  return px / DesktopConstants.BASE_FONT_SIZE + "rem";
}
