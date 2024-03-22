import { PathBuilder } from "./PathBuilder";
import { Shape } from "./Shape";

export class Ellipse extends Shape<{
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}> {
  protected _onPropsChanged(): void {
    const { cx = 0, cy = 0, rx = 0, ry = 0 } = this.props;
    if (rx === 0 || ry === 0) this.update("");
    else this.update(new PathBuilder().ellipse(cx, cy, rx, ry).toString());
  }
}
