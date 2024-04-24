export namespace DesktopTypes {
  export interface TaskbarSetting {
    /* 是否锁定任务栏 default false */
    lock: boolean;
    /* 任务栏的尺寸，鼠标拉缩任务栏时修改此处 default empty string */
    deputySize: number | string;
    /* 是否在鼠标离开任务栏时自动隐藏任务栏 */
    autoHide: {
      /* default false */
      enabled: boolean;
      /* 强制显示任务栏。在enabled为true时生效。 default false */
      forceShow: boolean;
    };
    /* 是否整体缩小任务栏 default false */
    small: boolean;
    /* 设置任务栏在桌面上的位置。 default "bottom" */
    position: "top" | "right" | "bottom" | "left";
  }
}
