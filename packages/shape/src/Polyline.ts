import { PathBuilder } from "./PathBuilder";
import { Shape } from "./Shape";

export class Polyline extends Shape<{
  points: ReadonlyArray<Vec2>;
  cornerRadius?: number;
  close?: boolean;
}> {
  protected _onPropsChanged(): void {
    const { points, cornerRadius, close } = this.props;
    if (!points.length) this.update("");
    else
      this.update(
        new PathBuilder().addPoints(points, { cornerRadius, close }).toString(),
      );
  }
}
