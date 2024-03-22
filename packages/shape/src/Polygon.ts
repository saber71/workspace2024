import { PathBuilder } from "./PathBuilder";
import { Shape } from "./Shape";

export class Polygon extends Shape<{
  points: ReadonlyArray<Vec2>;
  cornerRadius?: number;
}> {
  protected _onPropsChanged(): void {
    const { points, cornerRadius } = this.props;
    if (!points.length) this.update("");
    else
      this.update(
        new PathBuilder()
          .addPoints(points, { cornerRadius, close: true })
          .toString(),
      );
  }
}
