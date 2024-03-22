import { type Transform, vec2 } from "transform";
import { intersect, shape, Shape as SvgShape } from "svg-intersections";
import { PathBuilder } from "./PathBuilder";

let pathEl: SVGPathElement | undefined;

export abstract class Shape<Props = any> {
  protected constructor(
    props: Props = {} as any,
    readonly eventEmitter?: EventEmitter,
  ) {
    this.setProps(props);
  }

  static getPoints(svgPath: string) {
    if (!svgPath) return [];
    if (!pathEl) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      document.body.append(svg);
      pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
      svg.appendChild(pathEl);
    }
    pathEl.setAttribute("d", svgPath);
    const len = pathEl.getTotalLength();
    let step = 10;
    if (len <= step) step = 1 / len;
    const result: Vec2[] = [];
    for (let i = 0; i < len; i += step) {
      pickPosition(i);
    }
    pickPosition(len);
    return result;

    function pickPosition(len: number) {
      const p = (pathEl as any).getPointAtLength(len);
      result.push(vec2.fromValues(p.x, p.y));
    }
  }

  private readonly _props: Props;
  get props(): Readonly<Props> {
    return this._props;
  }

  private _points?: Vec2[];
  get points(): ReadonlyArray<Vec2> {
    if (!this._points) this._points = Shape.getPoints(this.svgPath);
    return this._points;
  }

  private _svgPath: string = "";
  get svgPath(): string {
    if (!this._svgPath) {
      if (this._points)
        this._svgPath = new PathBuilder().addPoints(this._points).toString();
      else throw new ShapeError("No svg path provided");
    }
    return this._svgPath;
  }

  private _svgShape?: SvgShape;
  get svgShape(): SvgShape {
    if (!this._svgShape) this._svgShape = shape("path", { d: this.svgPath });
    return this._svgShape;
  }

  apply(transform: Transform) {
    this.update(this.points.map((p) => transform.toWorld(p)));
  }

  applyInverse(transform: Transform) {
    this.update(this.points.map((p) => transform.toLocal(p)));
  }

  intersect(other: Shape) {
    const result = this.intersectPoint(other);
    return (
      !!result.points.length ||
      result.status === "Inside" ||
      result.status === "Outside" ||
      result.status === "Coincident"
    );
  }

  intersectPoint(other: Shape) {
    return intersect(this.svgShape, other.svgShape);
  }

  update(arg: string | Vec2[]) {
    if (typeof arg === "string") {
      if (this._svgPath === arg) return;
      this._svgPath = arg;
      this._points = undefined;
    } else {
      if (arg.length === 0 && this._points?.length === 0) return;
      this._points = arg;
      this._svgPath = "";
    }
    this._svgShape = undefined;
    //@ts-ignore
    this.eventEmitter?.emit("updateShape");
  }

  setProps(props: Partial<Props>) {
    let isChanged = false;
    for (let key in props) {
      if (this._props[key] !== props[key]) {
        isChanged = true;
        break;
      }
    }
    if (isChanged) {
      Object.assign(this._props as any, props);
      this._onPropsChanged();
    }
  }

  protected abstract _onPropsChanged(): void;
}

export class ShapeError extends Error {}
