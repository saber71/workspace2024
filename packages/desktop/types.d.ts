declare interface TaskbarSetting {
  /* default false */
  lock: boolean;
  /* default empty string */
  deputySize: number | string;
  /* default false */
  autoHide: boolean;
  /* default false */
  small: boolean;
  /* default "bottom" */
  position: "top" | "right" | "bottom" | "left";
}
