///<reference types="transform/types.d.ts"/>

declare type EventEmitter = import("events").EventEmitter<{
  updateShape: () => void;
}>;

declare interface Corner {
  leftTop: number;
  rightTop: number;
  leftBottom: number;
  rightBottom: number;
}
