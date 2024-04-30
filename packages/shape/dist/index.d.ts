import { default as default_2 } from 'eventemitter3';
import { Intersection } from 'svg-intersections';
import { Shape as Shape_2 } from 'svg-intersections';
import { Transform } from 'transform';

export declare class Circle extends Shape<{
    cx: number;
    cy: number;
    r: number;
}> {
    protected _onPropsChanged(): void;
}

export declare interface Corner {
    leftTop: number;
    rightTop: number;
    leftBottom: number;
    rightBottom: number;
}

declare interface CornerStartEnd {
    start: Vec2;
    end: Vec2;
}

export declare class Ellipse extends Shape<{
    cx: number;
    cy: number;
    rx: number;
    ry: number;
}> {
    protected _onPropsChanged(): void;
}

export declare type EventEmitters = default_2<{
    updateShape: () => void;
}>;

export declare class PathBuilder {
    private _d;
    private _end;
    private _start;
    constructor(d?: string);
    toString(): string;
    a(radiusX: number, radiusY: number, rotation: number, largeArc: boolean | number, sweep: boolean | number, endX: number, endY: number): this;
    append(builder: PathBuilder): this;
    addPoints(points: ReadonlyArray<Vec2>, option?: {
        cornerRadius?: number;
        close?: boolean;
    }): this;
    arc(x: number, y: number, r: number, startAngle: number, endAngle: number, ccw?: boolean, move?: boolean): this;
    arcTo(x1: number, y1: number, x2: number, y2: number, r: number): this;
    bezierCurveTo(x1: number, y1: number, x2: number, y2: number, x: number, y: number): this;
    clear(): this;
    closePath(): this;
    ellipse(centerX: number, centerY: number, radiusX: number, radiusY: number): PathBuilder;
    lineTo(x: number, y: number): this;
    moveTo(x: number, y: number): this;
    quadraticCurveTo(controlX: number, controlY: number, x: number, y: number): this;
    rect(x: number, y: number, w: number, h: number): this;
    roundRect(x: number, y: number, width: number, height: number, corner?: Partial<Corner> | number): this;
    roundCorner(prevP: Vec2, curP: Vec2, nextP: Vec2, radius: number): CornerStartEnd | undefined;
}

export declare class Polygon extends Shape<{
    points: ReadonlyArray<Vec2>;
    cornerRadius?: number;
}> {
    protected _onPropsChanged(): void;
}

export declare class Polyline extends Shape<{
    points: ReadonlyArray<Vec2>;
    cornerRadius?: number;
    close?: boolean;
}> {
    protected _onPropsChanged(): void;
}

export declare class Rect extends Shape<{
    width: number;
    height: number;
    x: number;
    y: number;
    radius?: number | Corner;
}> {
    protected _onPropsChanged(): void;
}

export declare abstract class Shape<Props = any> {
    readonly eventEmitter?: EventEmitters | undefined;
    protected constructor(props?: Props, eventEmitter?: EventEmitters | undefined);
    static getPoints(svgPath: string): Vec2[];
    private readonly _props;
    get props(): Readonly<Props>;
    private _points?;
    get points(): ReadonlyArray<Vec2>;
    private _svgPath;
    get svgPath(): string;
    private _svgShape?;
    get svgShape(): Shape_2;
    apply(transform: Transform): void;
    applyInverse(transform: Transform): void;
    intersect(other: Shape): boolean;
    intersectPoint(other: Shape): Intersection;
    update(arg: string | Vec2[]): void;
    setProps(props: Partial<Props>): void;
    protected abstract _onPropsChanged(): void;
}

export declare class ShapeError extends Error {
}

export { }
