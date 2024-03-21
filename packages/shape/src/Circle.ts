import { PathBuilder } from "./1";
import { Shape } from "./Shape";

export class Circle extends Shape<{ cx: number; cy: number; r: number }> {
  protected _onPropsChanged(): void {
    const { cx = 0, cy = 0, r = 0 } = this.props;
    if (r === 0) this.setPoints([]);
    else {
      this.setPoints(
        Shape.getPoints(
          new PathBuilder().arc(cx, cy, r, 0, Math.PI * 2).toString(),
        ),
      );
    }
  }
}
