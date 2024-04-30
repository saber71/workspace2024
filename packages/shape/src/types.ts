import type EventEmitter from "eventemitter3";

export type EventEmitters = EventEmitter<{
  updateShape: () => void;
}>;

export interface Corner {
  leftTop: number;
  rightTop: number;
  leftBottom: number;
  rightBottom: number;
}
