import { vec2 } from "transform";
import { Shape } from "./Shape";

export class Rect extends Shape<{
  width: number;
  height: number;
  x: number;
  y: number;
}> {
  protected _onPropsChanged(): void {
    const { x = 0, y = 0, width = 0, height = 0 } = this.props;
    if (width <= 0 || height <= 0) this.setPoints([]);
    else
      this.setPoints([
        vec2.fromValues(x, y),
        vec2.fromValues(x + width, y),
        vec2.fromValues(x + width, y + height),
        vec2.fromValues(x, y + height),
        vec2.fromValues(x, y),
      ]);
  }
}
