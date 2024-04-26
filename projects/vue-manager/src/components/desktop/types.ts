export namespace DesktopTypes {
  export interface Events {
    close: () => void;
  }

  export interface TaskbarSetting {
    lock: boolean;
    deputySize: number | string;
    autoHide: {
      /* default false */
      enabled: boolean;
      forceShow: boolean;
    };
    small: boolean;
    position: "top" | "right" | "bottom" | "left";
  }

  type StringBoolean = "true" | "false";
  type StringNumber = `${number}`;
  type Px = `${number}px` | "";
  type TaskbarPosition = "top" | "right" | "bottom" | "left";

  export interface Setting {
    /* 是否锁定任务栏 default false */
    "taskbar.lock": StringBoolean;
    /* 任务栏的尺寸，鼠标拉缩任务栏时修改此处 default empty string */
    "taskbar.deputySize": Px;
    /* 是否在鼠标离开任务栏时自动隐藏任务栏 default false */
    "taskbar.autoHide.enabled": StringBoolean;
    /* 强制显示任务栏。在enabled为true时生效。 default false */
    "taskbar.autoHide.forceShow": StringBoolean;
    /* 是否整体缩小任务栏 default false */
    "taskbar.small": StringBoolean;
    /* 设置任务栏在桌面上的位置。 default bottom */
    "taskbar.position": TaskbarPosition;
  }
}
