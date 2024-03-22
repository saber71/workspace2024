import { vec2 } from 'transform';
import { shape, intersect } from 'svg-intersections';

const pi = Math.PI, tau = 2 * pi, epsilon = 1e-6, tauEpsilon = tau - epsilon;
class PathBuilder {
    _d;
    _end = vec2.create();
    _start = vec2.create();
    constructor(d = ""){
        this._d = d;
    }
    toString() {
        return this._d;
    }
    a(radiusX, radiusY, rotation, largeArc, sweep, endX, endY) {
        this._end = vec2.fromValues(endX, endY);
        const value = ` A ${radiusX},${radiusY},${rotation},${largeArc ? 1 : 0},${sweep ? 1 : 0},${endX},${endY}`;
        this._d += value;
        return this;
    }
    append(builder) {
        this._d += " " + builder._d;
        this._end = builder._end;
        return this;
    }
    addPoints(points, option = {}) {
        if (points.length === 0) return this;
        let { cornerRadius = 0, close = false } = option;
        if (points.length <= 2) {
            close = false;
            cornerRadius = 0;
        }
        if (!close || cornerRadius === 0) {
            if (!this._d) this.moveTo(points[0][0], points[0][1]);
        }
        if (cornerRadius === 0) {
            for(let i = 1; i < points.length; i++){
                this.lineTo(points[i][0], points[i][1]);
            }
            if (close) this.closePath();
        } else {
            if (close) {
                const ps = points.slice();
                ps.unshift(points.at(-1));
                ps.push(points[0]);
                points = ps;
            }
            for(let i = 1; i < points.length - 1; i++){
                this.roundCorner(points[i - 1], points[i], points[i + 1], cornerRadius);
            }
            if (close) this.closePath();
            else {
                const last = points.at(-1);
                this.lineTo(last[0], last[1]);
            }
        }
        return this;
    }
    arc(x, y, r, startAngle, endAngle, ccw = false, move) {
        const dx = r * Math.cos(startAngle), dy = r * Math.sin(startAngle), x0 = x + dx, y0 = y + dy, cw = 1 ^ ccw;
        let da = ccw ? startAngle - endAngle : endAngle - startAngle;
        // Is the radius negative? Error.
        if (r < 0) throw new Error("negative radius: " + r);
        // Is this path empty? Move to (x0,y0).
        if (!this._d || move) {
            const value = "M" + x0 + "," + y0;
            this._d += value;
            this._end = vec2.fromValues(x0, y0);
        } else if (Math.abs(this._end[0] - x0) > epsilon || Math.abs(this._end[1] - y0) > epsilon) {
            const value = "L" + x0 + "," + y0;
            this._d += value;
            this._end = vec2.fromValues(x0, 0);
        }
        // Is this arc empty? We’re done.
        if (!r) return this;
        // Does the angle go the wrong way? Flip the direction.
        if (da < 0) da = da % tau + tau;
        // Is this a complete circle? Draw two arcs to complete the circle.
        if (da > tauEpsilon) {
            this._end = vec2.fromValues(x0, y0);
            const value1 = "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy);
            const value2 = "A" + r + "," + r + ",0,1," + cw + "," + x0 + "," + y0;
            this._d += value1 + value2;
        } else if (da > epsilon) {
            this._end = vec2.fromValues(x + r * Math.cos(endAngle), y + r * Math.sin(endAngle));
            const value = "A" + r + "," + r + ",0," + +(da >= pi) + "," + cw + "," + this._end[0] + "," + this._end[1];
            this._d += value;
        }
        return this;
    }
    arcTo(x1, y1, x2, y2, r) {
        const x0 = this._end[0], y0 = this._end[1], x21 = x2 - x1, y21 = y2 - y1, x01 = x0 - x1, y01 = y0 - y1, l01_2 = x01 * x01 + y01 * y01;
        // Is the radius negative? Error.
        if (r < 0) throw new Error("negative radius: " + r);
        // Is this path empty? Move to (x1,y1).
        if (!this._d) {
            this._end = vec2.fromValues(x1, y1);
            const value = "M" + x1 + "," + y1;
            this._d += value;
        } else if (!(l01_2 > epsilon)) ; else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
            // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
            // Equivalently, is (x1,y1) coincident with (x2,y2)?
            // Or, is the radius zero? Line to (x1,y1).
            this._end = vec2.fromValues(x1, y1);
            const value = "L" + x1 + "," + y1;
            this._d += value;
        } else {
            const x20 = x2 - x0, y20 = y2 - y0, l21_2 = x21 * x21 + y21 * y21, l20_2 = x20 * x20 + y20 * y20, l21 = Math.sqrt(l21_2), l01 = Math.sqrt(l01_2), l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2), t01 = l / l01, t21 = l / l21;
            // If the start tangent is not coincident with (x0,y0), line to.
            if (Math.abs(t01 - 1) > epsilon) {
                const value = "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
                this._end = vec2.fromValues(x1 + t01 * x01, y1 + t01 * y01);
                this._d += value;
            }
            this._end = vec2.fromValues(x1 + t21 * x21, y1 + t21 * y21);
            const value = "A" + r + "," + r + ",0,0," + +(y01 * x20 > x01 * y20) + "," + this._end[0] + "," + this._end[1];
            this._d += value;
        }
        return this;
    }
    bezierCurveTo(x1, y1, x2, y2, x, y) {
        this._end = vec2.fromValues(x, y);
        const value = "C" + +x1 + "," + +y1 + "," + +x2 + "," + +y2 + "," + x + "," + y;
        this._d += value;
        return this;
    }
    clear() {
        this._d = "";
        this._start = this._end = vec2.create();
        return this;
    }
    closePath() {
        if (this._d) {
            this._end = this._start;
            this._d += "Z";
        }
        return this;
    }
    ellipse(centerX, centerY, radiusX, radiusY) {
        return this.moveTo(centerX + radiusX, centerY).a(radiusX, radiusY, 0, true, false, centerX - radiusX, centerY).a(radiusX, radiusY, 0, true, false, centerX + radiusX, centerY).closePath();
    }
    lineTo(x, y) {
        this._end = vec2.fromValues(x, y);
        const value = "L" + x + "," + y;
        this._d += value;
        return this;
    }
    moveTo(x, y) {
        if (!this._d) this._start = this._end = vec2.fromValues(x, y);
        const value = "M" + x + "," + y;
        this._d += value;
        return this;
    }
    quadraticCurveTo(controlX, controlY, x, y) {
        this._end = vec2.fromValues(x, y);
        const value = "Q" + +controlX + "," + +controlY + "," + x + "," + y;
        this._d += value;
        return this;
    }
    rect(x, y, w, h) {
        return this.moveTo(x, y).lineTo(x + w, y).lineTo(x + w, h + y).lineTo(x, h + y).lineTo(x, y).closePath();
    }
    roundRect(x, y, width, height, corner) {
        const cornerRadius = {
            leftTop: 0,
            rightTop: 0,
            leftBottom: 0,
            rightBottom: 0
        };
        if (typeof corner === "object" && corner) Object.assign(cornerRadius, corner);
        else if (typeof corner === "number") cornerRadius.leftTop = cornerRadius.leftBottom = cornerRadius.rightBottom = cornerRadius.rightTop = corner;
        this.moveTo(x + cornerRadius.leftTop, y);
        this.lineTo(x + width - cornerRadius.rightTop, y);
        this.quadraticCurveTo(x + width, y, x + width, y + cornerRadius.rightTop);
        this.lineTo(x + width, y + height - cornerRadius.rightBottom);
        this.quadraticCurveTo(x + width, y + height, x + width - cornerRadius.rightBottom, y + height);
        this.lineTo(x + cornerRadius.leftBottom, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - cornerRadius.leftBottom);
        this.lineTo(x, y + cornerRadius.leftTop);
        this.quadraticCurveTo(x, y, x + cornerRadius.leftTop, y);
        return this;
    }
    roundCorner(prevP, curP, nextP, radius) {
        if (radius === 0) this.lineTo(curP[0], curP[1]);
        else {
            vec2.subtract(direction1, prevP, curP);
            vec2.subtract(direction2, nextP, curP);
            vec2.normalize(direction1, direction1);
            vec2.normalize(direction2, direction2);
            const p1 = [
                curP[0] + radius * direction1[0],
                curP[1] + radius * direction1[1]
            ];
            const p2 = [
                curP[0] + radius * direction2[0],
                curP[1] + radius * direction2[1]
            ];
            if (!this._d) this.moveTo(p1[0], p1[1]);
            else this.lineTo(p1[0], p1[1]);
            this.quadraticCurveTo(curP[0], curP[1], p2[0], p2[1]);
            return {
                start: p1,
                end: p2
            };
        }
    }
}
const direction1 = vec2.create();
const direction2 = vec2.create();

let pathEl;
class Shape {
    eventEmitter;
    constructor(props = {}, eventEmitter){
        this.eventEmitter = eventEmitter;
        this._svgPath = "";
        this.setProps(props);
    }
    static getPoints(svgPath) {
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
        const result = [];
        for(let i = 0; i < len; i += step){
            pickPosition(i);
        }
        pickPosition(len);
        return result;
        function pickPosition(len) {
            const p = pathEl.getPointAtLength(len);
            result.push(vec2.fromValues(p.x, p.y));
        }
    }
    _props;
    get props() {
        return this._props;
    }
    _points;
    get points() {
        if (!this._points) this._points = Shape.getPoints(this.svgPath);
        return this._points;
    }
    _svgPath;
    get svgPath() {
        if (!this._svgPath) {
            if (this._points) this._svgPath = new PathBuilder().addPoints(this._points).toString();
            else throw new ShapeError("No svg path provided");
        }
        return this._svgPath;
    }
    _svgShape;
    get svgShape() {
        if (!this._svgShape) this._svgShape = shape("path", {
            d: this.svgPath
        });
        return this._svgShape;
    }
    apply(transform) {
        this.update(this.points.map((p)=>transform.toWorld(p)));
    }
    applyInverse(transform) {
        this.update(this.points.map((p)=>transform.toLocal(p)));
    }
    intersect(other) {
        const result = this.intersectPoint(other);
        return !!result.points.length || result.status === "Inside" || result.status === "Outside" || result.status === "Coincident";
    }
    intersectPoint(other) {
        return intersect(this.svgShape, other.svgShape);
    }
    update(arg) {
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
    setProps(props) {
        let isChanged = false;
        for(let key in props){
            if (this._props[key] !== props[key]) {
                isChanged = true;
                break;
            }
        }
        if (isChanged) {
            Object.assign(this._props, props);
            this._onPropsChanged();
        }
    }
}
class ShapeError extends Error {
}

class Circle extends Shape {
    _onPropsChanged() {
        const { cx = 0, cy = 0, r = 0 } = this.props;
        if (r === 0) this.update("");
        else {
            this.update(new PathBuilder().arc(cx, cy, r, 0, Math.PI * 2).toString());
        }
    }
}

class Ellipse extends Shape {
    _onPropsChanged() {
        const { cx = 0, cy = 0, rx = 0, ry = 0 } = this.props;
        if (rx === 0 || ry === 0) this.update("");
        else this.update(new PathBuilder().ellipse(cx, cy, rx, ry).toString());
    }
}

class Polygon extends Shape {
    _onPropsChanged() {
        const { points, cornerRadius } = this.props;
        if (!points.length) this.update("");
        else this.update(new PathBuilder().addPoints(points, {
            cornerRadius,
            close: true
        }).toString());
    }
}

class Polyline extends Shape {
    _onPropsChanged() {
        const { points, cornerRadius, close } = this.props;
        if (!points.length) this.update("");
        else this.update(new PathBuilder().addPoints(points, {
            cornerRadius,
            close
        }).toString());
    }
}

class Rect extends Shape {
    _onPropsChanged() {
        const { x = 0, y = 0, width = 0, height = 0 } = this.props;
        if (width <= 0 || height <= 0) this.update("");
        else this.update(new PathBuilder().roundRect(x, y, width, height, this.props.radius).toString());
    }
}

export { Circle, Ellipse, PathBuilder, Polygon, Polyline, Rect, Shape, ShapeError };
