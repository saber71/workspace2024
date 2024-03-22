import { PathBuilder } from "./PathBuilder";
import { Shape } from "./Shape";

export class Rect extends Shape<{
  width: number;
  height: number;
  x: number;
  y: number;
  radius?: number | Corner;
}> {
  protected _onPropsChanged(): void {
    const { x = 0, y = 0, width = 0, height = 0 } = this.props;
    if (width <= 0 || height <= 0) this.update("");
    else
      this.update(
        new PathBuilder()
          .roundRect(x, y, width, height, this.props.radius)
          .toString(),
      );
  }
}
