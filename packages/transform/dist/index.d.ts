import { default as default_2 } from 'eventemitter3';

export declare let ANGLE_ORDER: string;

export declare let ARRAY_TYPE: Float32ArrayConstructor | ArrayConstructor;

export declare const EPSILON = 0.000001;

/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 *
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */
export declare function equals(a: number, b: number): boolean;

declare interface IndexedCollection extends Iterable<number> {
    readonly length: number;
    [index: number]: number;
}

export declare type Mat2 = [
number,
number,
number,
number
] | IndexedCollection;

export declare type Mat2d = [
number,
number,
number,
number,
number,
number
] | IndexedCollection;

/**
 * 2x3 Matrix
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, b,
 *  c, d,
 *  tx, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, b, 0,
 *  c, d, 0,
 *  tx, ty, 1]
 * </pre>
 * The last column is ignored so the array is shorter and operations are faster.
 */
export declare namespace mat2d {
    /**
     * Creates a new identity Mat2d
     *
     * @returns {Mat2d} a new 2x3 matrix
     */
    export function create(): Mat2d;
    /**
     * Creates a new Mat2d initialized with values from an existing matrix
     *
     * @param {ReadonlyMat2d} a matrix to clone
     * @returns {Mat2d} a new 2x3 matrix
     */
    export function clone(a: ReadonlyMat2d): Mat2d;
    /**
     * Copy the values from one Mat2d to another
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the source matrix
     * @returns {Mat2d} out
     */
    export function copy(out: Mat2d, a: ReadonlyMat2d): Mat2d;
    /**
     * Set a Mat2d to the identity matrix
     *
     * @param {Mat2d} out the receiving matrix
     * @returns {Mat2d} out
     */
    export function identity(out: Mat2d): Mat2d;
    /**
     * Create a new Mat2d with the given values
     *
     * @param {Number} a Component A (index 0)
     * @param {Number} b Component B (index 1)
     * @param {Number} c Component C (index 2)
     * @param {Number} d Component D (index 3)
     * @param {Number} tx Component TX (index 4)
     * @param {Number} ty Component TY (index 5)
     * @returns {Mat2d} A new Mat2d
     */
    export function fromValues(a: number, b: number, c: number, d: number, tx: number, ty: number): any[] | Float32Array;
    /**
     * Set the components of a Mat2d to the given values
     *
     * @param {Mat2d} out the receiving matrix
     * @param {Number} a Component A (index 0)
     * @param {Number} b Component B (index 1)
     * @param {Number} c Component C (index 2)
     * @param {Number} d Component D (index 3)
     * @param {Number} tx Component TX (index 4)
     * @param {Number} ty Component TY (index 5)
     * @returns {Mat2d} out
     */
    export function set(out: Mat2d, a: number, b: number, c: number, d: number, tx: number, ty: number): Mat2d;
    /**
     * Inverts a Mat2d
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the source matrix
     * @returns {Mat2d} out
     */
    export function invert(out: Mat2d, a: ReadonlyMat2d): Mat2d | null;
    /**
     * Calculates the determinant of a Mat2d
     *
     * @param {ReadonlyMat2d} a the source matrix
     * @returns {Number} determinant of a
     */
    export function determinant(a: ReadonlyMat2d): number;
    /**
     * Multiplies two Mat2d's
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the first operand
     * @param {ReadonlyMat2d} b the second operand
     * @returns {Mat2d} out
     */
    export function multiply(out: Mat2d, a: ReadonlyMat2d, b: ReadonlyMat2d): Mat2d;
    /**
     * Rotates a Mat2d by the given angle
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {Mat2d} out
     */
    export function rotate(out: Mat2d, a: ReadonlyMat2d, rad: number): Mat2d;
    /**
     * Scales the Mat2d by the dimensions in the given vec2
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the matrix to translate
     * @param {ReadonlyVec2} v the vec2 to scale the matrix by
     * @returns {Mat2d} out
     **/
    export function scale(out: Mat2d, a: ReadonlyMat2d, v: ReadonlyVec2): Mat2d;
    /**
     * Translates the Mat2d by the dimensions in the given vec2
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the matrix to translate
     * @param {ReadonlyVec2} v the vec2 to translate the matrix by
     * @returns {Mat2d} out
     **/
    export function translate(out: Mat2d, a: ReadonlyMat2d, v: ReadonlyVec2): Mat2d;
    /**
     * Creates a matrix from a given angle
     * This is equivalent to (but much faster than):
     *
     *     Mat2d.identity(dest);
     *     Mat2d.rotate(dest, dest, rad);
     *
     * @param {Mat2d} out Mat2d receiving operation result
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {Mat2d} out
     */
    export function fromRotation(out: Mat2d, rad: number): Mat2d;
    /**
     * Creates a matrix from a vector scaling
     * This is equivalent to (but much faster than):
     *
     *     Mat2d.identity(dest);
     *     Mat2d.scale(dest, dest, vec);
     *
     * @param {Mat2d} out Mat2d receiving operation result
     * @param {ReadonlyVec2} v Scaling vector
     * @returns {Mat2d} out
     */
    export function fromScaling(out: Mat2d, v: ReadonlyVec2): Mat2d;
    /**
     * Creates a matrix from a vector translation
     * This is equivalent to (but much faster than):
     *
     *     Mat2d.identity(dest);
     *     Mat2d.translate(dest, dest, vec);
     *
     * @param {Mat2d} out Mat2d receiving operation result
     * @param {ReadonlyVec2} v Translation vector
     * @returns {Mat2d} out
     */
    export function fromTranslation(out: Mat2d, v: ReadonlyVec2): Mat2d;
    /**
     * Returns a string representation of a Mat2d
     *
     * @param {ReadonlyMat2d} a matrix to represent as a string
     * @returns {String} string representation of the matrix
     */
    export function str(a: ReadonlyMat2d): string;
    /**
     * Returns Frobenius norm of a Mat2d
     *
     * @param {ReadonlyMat2d} a the matrix to calculate Frobenius norm of
     * @returns {Number} Frobenius norm
     */
    export function frob(a: ReadonlyMat2d): number;
    /**
     * Adds two Mat2d's
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the first operand
     * @param {ReadonlyMat2d} b the second operand
     * @returns {Mat2d} out
     */
    export function add(out: Mat2d, a: ReadonlyMat2d, b: ReadonlyMat2d): Mat2d;
    /**
     * Subtracts matrix b from matrix a
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the first operand
     * @param {ReadonlyMat2d} b the second operand
     * @returns {Mat2d} out
     */
    export function subtract(out: Mat2d, a: ReadonlyMat2d, b: ReadonlyMat2d): Mat2d;
    /**
     * Multiply each element of the matrix by a scalar.
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the matrix to scale
     * @param {Number} b amount to scale the matrix's elements by
     * @returns {Mat2d} out
     */
    export function multiplyScalar(out: Mat2d, a: ReadonlyMat2d, b: number): Mat2d;
    /**
     * Adds two Mat2d's after multiplying each element of the second operand by a scalar value.
     *
     * @param {Mat2d} out the receiving vector
     * @param {ReadonlyMat2d} a the first operand
     * @param {ReadonlyMat2d} b the second operand
     * @param {Number} scale the amount to scale b's elements by before adding
     * @returns {Mat2d} out
     */
    export function multiplyScalarAndAdd(out: Mat2d, a: ReadonlyMat2d, b: ReadonlyMat2d, scale: number): Mat2d;
    /**
     * Returns whether the matrices have exactly the same elements in the same position (when compared with ===)
     *
     * @param {ReadonlyMat2d} a The first matrix.
     * @param {ReadonlyMat2d} b The second matrix.
     * @returns {Boolean} True if the matrices are equal, false otherwise.
     */
    export function exactEquals(a: ReadonlyMat2d, b: ReadonlyMat2d): boolean;
    /**
     * Returns whether or not the matrices have approximately the same elements in the same position.
     *
     * @param {ReadonlyMat2d} a The first matrix.
     * @param {ReadonlyMat2d} b The second matrix.
     * @returns {Boolean} True if the matrices are equal, false otherwise.
     */
    export function equals(a: ReadonlyMat2d, b: ReadonlyMat2d): boolean;
}

export declare type Mat3 = [
number,
number,
number,
number,
number,
number,
number,
number,
number
] | IndexedCollection;

export declare type Mat4 = [
number,
number,
number,
number,
number,
number,
number,
number,
number,
number,
number,
number,
number,
number,
number,
number
] | IndexedCollection;

export declare type Quat = [number, number, number, number] | IndexedCollection;

export declare type Quat2 = [
number,
number,
number,
number,
number,
number,
number,
number
] | IndexedCollection;

export declare let RANDOM: () => number;

export declare type ReadonlyMat2 = readonly [
number,
number,
number,
number
] | IndexedCollection;

export declare type ReadonlyMat2d = readonly [
number,
number,
number,
number,
number,
number
] | IndexedCollection;

export declare type ReadonlyMat3 = readonly [
number,
number,
number,
number,
number,
number,
number,
number,
number
] | IndexedCollection;

export declare type ReadonlyMat4 = readonly [
number,
number,
number,
number,
number,
number,
number,
number,
number,
number,
number,
number,
number,
number,
number,
number
] | IndexedCollection;

export declare type ReadonlyQuat = readonly [number, number, number, number] | IndexedCollection;

export declare type ReadonlyQuat2 = readonly [number, number, number, number, number, number, number, number] | IndexedCollection;

export declare type ReadonlyVec2 = readonly [number, number] | IndexedCollection;

export declare type ReadonlyVec3 = readonly [number, number, number] | IndexedCollection;

export declare type ReadonlyVec4 = readonly [number, number, number, number] | IndexedCollection;

/**
 * Symmetric round
 * see https://www.npmjs.com/package/round-half-up-symmetric#user-content-detailed-background
 *
 * @param {Number} a value to round
 */
export declare function round(a: number): number;

/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Float32ArrayConstructor | ArrayConstructor} type Array type, such as Float32Array or Array
 */
export declare function setMatrixArrayType(type: Float32ArrayConstructor | ArrayConstructor): void;

/**
 * Convert Degree To Radian
 *
 * @param {Number} a Angle in Degrees
 */
export declare function toRadian(a: number): number;

export declare class Transform extends default_2<{
    worldMatrixUpdated: () => void;
    parentChanged: () => void;
}> {
    protected _defaultParent?: Transform;
    protected _localMatrix: Mat2d;
    protected _needUpdateLocalMatrix: boolean;
    protected _needUpdateWorldMatrix: boolean;
    protected _origin: Vec2;
    protected _parent?: Transform;
    protected _rotation: number;
    protected _scale: Vec2;
    protected _translate: Vec2;
    protected _translateOffset: Vec2;
    protected _worldMatrix: Mat2d;
    constructor(defaultParent?: Transform);
    copyFrom(src: Transform): this;
    getLocalMatrix(): Mat2d;
    getOrigin(): Vec2;
    getParent(): Transform | undefined;
    getRotation(): number;
    getScale(): Vec2;
    getTranslateOffset(): ReadonlyVec2;
    getTranslation(): Vec2;
    getWorldMatrix(): Mat2d;
    refreshMatrix(): this;
    rotate(angle: number): this;
    rotateByDegree(degree: number): this;
    rotateTo(angle: number): this;
    rotateToByDegree(degree: number): this;
    scale(x: number, y: number): this;
    scaleTo(x: number, y: number): this;
    setDefaultParent(val?: Transform): this;
    setOrigin(x: number, y: number): this;
    setParent(parent?: Transform): this;
    setTranslateOffset(x: number, y: number): this;
    toLocal(p: Vec2, out?: Vec2): Vec2;
    toStringLocal(): string;
    toStringWorld(): string;
    toWorld(p: Vec2, out?: Vec2): Vec2;
    translate(x: number, y: number): this;
    translateTo(x?: number, y?: number): this;
    protected _computeLocalMatrix(): void;
    protected _computeWorldMatrix(): void;
    protected _onParentUpdateWorldMatrix(): void;
}

export declare type Vec2 = [number, number] | IndexedCollection;

export declare namespace vec2 {
    /**
     * Creates a new, empty Vec2
     *
     * @returns {Vec2} a new 2D vector
     */
    export function create(): Vec2;
    /**
     * Creates a new Vec2 initialized with values from an existing vector
     *
     * @param {ReadonlyVec2} a vector to clone
     * @returns {Vec2} a new 2D vector
     */
    export function clone(a: ReadonlyVec2): Vec2;
    /**
     * Creates a new Vec2 initialized with the given values
     *
     * @param {Number} x X component
     * @param {Number} y Y component
     * @returns {Vec2} a new 2D vector
     */
    export function fromValues(x: number, y: number): Vec2;
    /**
     * Copy the values from one Vec2 to another
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the source vector
     * @returns {Vec2} out
     */
    export function copy(out: Vec2, a: ReadonlyVec2): Vec2;
    /**
     * Set the components of a Vec2 to the given values
     *
     * @param {Vec2} out the receiving vector
     * @param {Number} x X component
     * @param {Number} y Y component
     * @returns {Vec2} out
     */
    export function set(out: Vec2, x: number, y: number): Vec2;
    /**
     * Adds two Vec2's
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Vec2} out
     */
    export function add(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2;
    /**
     * Subtracts vector b from vector a
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Vec2} out
     */
    export function subtract(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2;
    /**
     * Multiplies two Vec2's
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Vec2} out
     */
    export function multiply(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2;
    /**
     * Divides two Vec2's
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Vec2} out
     */
    export function divide(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2;
    /**
     * Math.ceil the components of a Vec2
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a vector to ceil
     * @returns {Vec2} out
     */
    export function ceil(out: Vec2, a: ReadonlyVec2): Vec2;
    /**
     * Math.floor the components of a Vec2
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a vector to floor
     * @returns {Vec2} out
     */
    export function floor(out: Vec2, a: ReadonlyVec2): Vec2;
    /**
     * Returns the minimum of two Vec2's
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Vec2} out
     */
    export function min(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2;
    /**
     * Returns the maximum of two Vec2's
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Vec2} out
     */
    export function max(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2;
    /**
     * symmetric round the components of a Vec2
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a vector to round
     * @returns {Vec2} out
     */
    export function rounds(out: Vec2, a: ReadonlyVec2): Vec2;
    /**
     * Scales a Vec2 by a scalar number
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the vector to scale
     * @param {Number} b amount to scale the vector by
     * @returns {Vec2} out
     */
    export function scale(out: Vec2, a: ReadonlyVec2, b: number): Vec2;
    /**
     * Adds two Vec2's after scaling the second operand by a scalar value
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @param {Number} scale the amount to scale b by before adding
     * @returns {Vec2} out
     */
    export function scaleAndAdd(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2, scale: number): Vec2;
    /**
     * Calculates the euclidian distance between two Vec2's
     *
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Number} distance between a and b
     */
    export function distance(a: ReadonlyVec2, b: ReadonlyVec2): number;
    /**
     * Calculates the squared euclidian distance between two Vec2's
     *
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Number} squared distance between a and b
     */
    export function squaredDistance(a: ReadonlyVec2, b: ReadonlyVec2): number;
    /**
     * Calculates the length of a Vec2
     *
     * @param {ReadonlyVec2} a vector to calculate length of
     * @returns {Number} length of a
     */
    export function length(a: ReadonlyVec2): number;
    /**
     * Calculates the squared length of a Vec2
     *
     * @param {ReadonlyVec2} a vector to calculate squared length of
     * @returns {Number} squared length of a
     */
    export function squaredLength(a: ReadonlyVec2): number;
    /**
     * Negates the components of a Vec2
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a vector to negate
     * @returns {Vec2} out
     */
    export function negate(out: Vec2, a: ReadonlyVec2): Vec2;
    /**
     * Returns the inverse of the components of a Vec2
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a vector to invert
     * @returns {Vec2} out
     */
    export function inverse(out: Vec2, a: ReadonlyVec2): Vec2;
    /**
     * Normalize a Vec2
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a vector to normalize
     * @returns {Vec2} out
     */
    export function normalize(out: Vec2, a: ReadonlyVec2): Vec2;
    /**
     * Calculates the dot product of two Vec2's
     *
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Number} dot product of a and b
     */
    export function dot(a: ReadonlyVec2, b: ReadonlyVec2): number;
    /**
     * Computes the cross product of two Vec2's
     * Note that the cross product must by definition produce a 3D vector
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Vec3} out
     */
    export function cross(out: Vec3, a: ReadonlyVec2, b: ReadonlyVec2): Vec3;
    /**
     * Performs a linear interpolation between two Vec2's
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @returns {Vec2} out
     */
    export function lerp(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2, t: number): Vec2;
    /**
     * Generates a random vector with the given scale
     *
     * @param {Vec2} out the receiving vector
     * @param {Number} [scale] Length of the resulting vector. If omitted, a unit vector will be returned
     * @returns {Vec2} out
     */
    export function random(out: Vec2, scale: number): Vec2;
    /**
     * Transforms the Vec2 with a mat2
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the vector to transform
     * @param {ReadonlyMat2} m matrix to transform with
     * @returns {Vec2} out
     */
    export function transformMat2(out: Vec2, a: ReadonlyVec2, m: ReadonlyMat2): Vec2;
    /**
     * Transforms the Vec2 with a mat2d
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the vector to transform
     * @param {ReadonlyMat2d} m matrix to transform with
     * @returns {Vec2} out
     */
    export function transformMat2d(out: Vec2, a: ReadonlyVec2, m: ReadonlyMat2d): Vec2;
    /**
     * Transforms the Vec2 with a mat3
     * 3rd vector component is implicitly '1'
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the vector to transform
     * @param {ReadonlyMat3} m matrix to transform with
     * @returns {Vec2} out
     */
    export function transformMat3(out: Vec2, a: ReadonlyVec2, m: ReadonlyVec3): Vec2;
    /**
     * Transforms the Vec2 with a mat4
     * 3rd vector component is implicitly '0'
     * 4th vector component is implicitly '1'
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the vector to transform
     * @param {ReadonlyMat4} m matrix to transform with
     * @returns {Vec2} out
     */
    export function transformMat4(out: Vec2, a: ReadonlyVec2, m: ReadonlyVec2): Vec2;
    /**
     * Rotate a 2D vector
     * @param {Vec2} out The receiving Vec2
     * @param {ReadonlyVec2} a The Vec2 point to rotate
     * @param {ReadonlyVec2} b The origin of the rotation
     * @param {Number} rad The angle of rotation in radians
     * @returns {Vec2} out
     */
    export function rotate(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2, rad: number): Vec2;
    /**
     * Get the angle between two 2D vectors
     * @param {ReadonlyVec2} a The first operand
     * @param {ReadonlyVec2} b The second operand
     * @returns {Number} The angle in radians
     */
    export function angle(a: ReadonlyVec2, b: ReadonlyVec2): number;
    /**
     * Set the components of a Vec2 to zero
     *
     * @param {Vec2} out the receiving vector
     * @returns {Vec2} out
     */
    export function zero(out: Vec2): Vec2;
    /**
     * Returns a string representation of a vector
     *
     * @param {ReadonlyVec2} a vector to represent as a string
     * @returns {String} string representation of the vector
     */
    export function str(a: ReadonlyVec2): string;
    /**
     * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
     *
     * @param {ReadonlyVec2} a The first vector.
     * @param {ReadonlyVec2} b The second vector.
     * @returns {Boolean} True if the vectors are equal, false otherwise.
     */
    export function exactEquals(a: ReadonlyVec2, b: ReadonlyVec2): boolean;
    /**
     * Returns whether or not the vectors have approximately the same elements in the same position.
     *
     * @param {ReadonlyVec2} a The first vector.
     * @param {ReadonlyVec2} b The second vector.
     * @returns {Boolean} True if the vectors are equal, false otherwise.
     */
    export function equals(a: ReadonlyVec2, b: ReadonlyVec2): boolean;
    /**
     * Perform some operation over an array of Vec2s.
     *
     * @param {Array} a the array of vectors to iterate over
     * @param {Number} stride Number of elements between the start of each Vec2. If 0 assumes tightly packed
     * @param {Number} offset Number of elements to skip at the beginning of the array
     * @param {Number} count Number of Vec2s to iterate over. If 0 iterates over entire array
     * @param {Function} fn Function to call for each vector in the array
     * @param {Object} [arg] additional argument to pass to fn
     * @returns {Array} a
     * @function
     */
    const forEach: (a: number[], stride: number, offset: number, count: number, fn: (v1: Vec2, v2: Vec2, arg: any) => void, arg?: any) => number[];
}

export declare type Vec3 = [number, number, number] | IndexedCollection;

export declare type Vec4 = [number, number, number, number] | IndexedCollection;

export { }


/**
 * 2x3 Matrix
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, b,
 *  c, d,
 *  tx, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, b, 0,
 *  c, d, 0,
 *  tx, ty, 1]
 * </pre>
 * The last column is ignored so the array is shorter and operations are faster.
 */
export declare namespace mat2d {
    /**
     * Creates a new identity Mat2d
     *
     * @returns {Mat2d} a new 2x3 matrix
     */
    function create(): Mat2d;
    /**
     * Creates a new Mat2d initialized with values from an existing matrix
     *
     * @param {ReadonlyMat2d} a matrix to clone
     * @returns {Mat2d} a new 2x3 matrix
     */
    function clone(a: ReadonlyMat2d): Mat2d;
    /**
     * Copy the values from one Mat2d to another
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the source matrix
     * @returns {Mat2d} out
     */
    function copy(out: Mat2d, a: ReadonlyMat2d): Mat2d;
    /**
     * Set a Mat2d to the identity matrix
     *
     * @param {Mat2d} out the receiving matrix
     * @returns {Mat2d} out
     */
    function identity(out: Mat2d): Mat2d;
    /**
     * Create a new Mat2d with the given values
     *
     * @param {Number} a Component A (index 0)
     * @param {Number} b Component B (index 1)
     * @param {Number} c Component C (index 2)
     * @param {Number} d Component D (index 3)
     * @param {Number} tx Component TX (index 4)
     * @param {Number} ty Component TY (index 5)
     * @returns {Mat2d} A new Mat2d
     */
    function fromValues(a: number, b: number, c: number, d: number, tx: number, ty: number): any[] | Float32Array;
    /**
     * Set the components of a Mat2d to the given values
     *
     * @param {Mat2d} out the receiving matrix
     * @param {Number} a Component A (index 0)
     * @param {Number} b Component B (index 1)
     * @param {Number} c Component C (index 2)
     * @param {Number} d Component D (index 3)
     * @param {Number} tx Component TX (index 4)
     * @param {Number} ty Component TY (index 5)
     * @returns {Mat2d} out
     */
    function set(out: Mat2d, a: number, b: number, c: number, d: number, tx: number, ty: number): Mat2d;
    /**
     * Inverts a Mat2d
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the source matrix
     * @returns {Mat2d} out
     */
    function invert(out: Mat2d, a: ReadonlyMat2d): Mat2d | null;
    /**
     * Calculates the determinant of a Mat2d
     *
     * @param {ReadonlyMat2d} a the source matrix
     * @returns {Number} determinant of a
     */
    function determinant(a: ReadonlyMat2d): number;
    /**
     * Multiplies two Mat2d's
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the first operand
     * @param {ReadonlyMat2d} b the second operand
     * @returns {Mat2d} out
     */
    function multiply(out: Mat2d, a: ReadonlyMat2d, b: ReadonlyMat2d): Mat2d;
    /**
     * Rotates a Mat2d by the given angle
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {Mat2d} out
     */
    function rotate(out: Mat2d, a: ReadonlyMat2d, rad: number): Mat2d;
    /**
     * Scales the Mat2d by the dimensions in the given vec2
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the matrix to translate
     * @param {ReadonlyVec2} v the vec2 to scale the matrix by
     * @returns {Mat2d} out
     **/
    function scale(out: Mat2d, a: ReadonlyMat2d, v: ReadonlyVec2): Mat2d;
    /**
     * Translates the Mat2d by the dimensions in the given vec2
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the matrix to translate
     * @param {ReadonlyVec2} v the vec2 to translate the matrix by
     * @returns {Mat2d} out
     **/
    function translate(out: Mat2d, a: ReadonlyMat2d, v: ReadonlyVec2): Mat2d;
    /**
     * Creates a matrix from a given angle
     * This is equivalent to (but much faster than):
     *
     *     Mat2d.identity(dest);
     *     Mat2d.rotate(dest, dest, rad);
     *
     * @param {Mat2d} out Mat2d receiving operation result
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {Mat2d} out
     */
    function fromRotation(out: Mat2d, rad: number): Mat2d;
    /**
     * Creates a matrix from a vector scaling
     * This is equivalent to (but much faster than):
     *
     *     Mat2d.identity(dest);
     *     Mat2d.scale(dest, dest, vec);
     *
     * @param {Mat2d} out Mat2d receiving operation result
     * @param {ReadonlyVec2} v Scaling vector
     * @returns {Mat2d} out
     */
    function fromScaling(out: Mat2d, v: ReadonlyVec2): Mat2d;
    /**
     * Creates a matrix from a vector translation
     * This is equivalent to (but much faster than):
     *
     *     Mat2d.identity(dest);
     *     Mat2d.translate(dest, dest, vec);
     *
     * @param {Mat2d} out Mat2d receiving operation result
     * @param {ReadonlyVec2} v Translation vector
     * @returns {Mat2d} out
     */
    function fromTranslation(out: Mat2d, v: ReadonlyVec2): Mat2d;
    /**
     * Returns a string representation of a Mat2d
     *
     * @param {ReadonlyMat2d} a matrix to represent as a string
     * @returns {String} string representation of the matrix
     */
    function str(a: ReadonlyMat2d): string;
    /**
     * Returns Frobenius norm of a Mat2d
     *
     * @param {ReadonlyMat2d} a the matrix to calculate Frobenius norm of
     * @returns {Number} Frobenius norm
     */
    function frob(a: ReadonlyMat2d): number;
    /**
     * Adds two Mat2d's
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the first operand
     * @param {ReadonlyMat2d} b the second operand
     * @returns {Mat2d} out
     */
    function add(out: Mat2d, a: ReadonlyMat2d, b: ReadonlyMat2d): Mat2d;
    /**
     * Subtracts matrix b from matrix a
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the first operand
     * @param {ReadonlyMat2d} b the second operand
     * @returns {Mat2d} out
     */
    function subtract(out: Mat2d, a: ReadonlyMat2d, b: ReadonlyMat2d): Mat2d;
    /**
     * Multiply each element of the matrix by a scalar.
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the matrix to scale
     * @param {Number} b amount to scale the matrix's elements by
     * @returns {Mat2d} out
     */
    function multiplyScalar(out: Mat2d, a: ReadonlyMat2d, b: number): Mat2d;
    /**
     * Adds two Mat2d's after multiplying each element of the second operand by a scalar value.
     *
     * @param {Mat2d} out the receiving vector
     * @param {ReadonlyMat2d} a the first operand
     * @param {ReadonlyMat2d} b the second operand
     * @param {Number} scale the amount to scale b's elements by before adding
     * @returns {Mat2d} out
     */
    function multiplyScalarAndAdd(out: Mat2d, a: ReadonlyMat2d, b: ReadonlyMat2d, scale: number): Mat2d;
    /**
     * Returns whether the matrices have exactly the same elements in the same position (when compared with ===)
     *
     * @param {ReadonlyMat2d} a The first matrix.
     * @param {ReadonlyMat2d} b The second matrix.
     * @returns {Boolean} True if the matrices are equal, false otherwise.
     */
    function exactEquals(a: ReadonlyMat2d, b: ReadonlyMat2d): boolean;
    /**
     * Returns whether or not the matrices have approximately the same elements in the same position.
     *
     * @param {ReadonlyMat2d} a The first matrix.
     * @param {ReadonlyMat2d} b The second matrix.
     * @returns {Boolean} True if the matrices are equal, false otherwise.
     */
    function equals(a: ReadonlyMat2d, b: ReadonlyMat2d): boolean;
}


export declare namespace vec2 {
    /**
     * Creates a new, empty Vec2
     *
     * @returns {Vec2} a new 2D vector
     */
    function create(): Vec2;
    /**
     * Creates a new Vec2 initialized with values from an existing vector
     *
     * @param {ReadonlyVec2} a vector to clone
     * @returns {Vec2} a new 2D vector
     */
    function clone(a: ReadonlyVec2): Vec2;
    /**
     * Creates a new Vec2 initialized with the given values
     *
     * @param {Number} x X component
     * @param {Number} y Y component
     * @returns {Vec2} a new 2D vector
     */
    function fromValues(x: number, y: number): Vec2;
    /**
     * Copy the values from one Vec2 to another
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the source vector
     * @returns {Vec2} out
     */
    function copy(out: Vec2, a: ReadonlyVec2): Vec2;
    /**
     * Set the components of a Vec2 to the given values
     *
     * @param {Vec2} out the receiving vector
     * @param {Number} x X component
     * @param {Number} y Y component
     * @returns {Vec2} out
     */
    function set(out: Vec2, x: number, y: number): Vec2;
    /**
     * Adds two Vec2's
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Vec2} out
     */
    function add(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2;
    /**
     * Subtracts vector b from vector a
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Vec2} out
     */
    function subtract(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2;
    /**
     * Multiplies two Vec2's
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Vec2} out
     */
    function multiply(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2;
    /**
     * Divides two Vec2's
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Vec2} out
     */
    function divide(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2;
    /**
     * Math.ceil the components of a Vec2
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a vector to ceil
     * @returns {Vec2} out
     */
    function ceil(out: Vec2, a: ReadonlyVec2): Vec2;
    /**
     * Math.floor the components of a Vec2
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a vector to floor
     * @returns {Vec2} out
     */
    function floor(out: Vec2, a: ReadonlyVec2): Vec2;
    /**
     * Returns the minimum of two Vec2's
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Vec2} out
     */
    function min(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2;
    /**
     * Returns the maximum of two Vec2's
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Vec2} out
     */
    function max(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2;
    /**
     * symmetric round the components of a Vec2
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a vector to round
     * @returns {Vec2} out
     */
    function rounds(out: Vec2, a: ReadonlyVec2): Vec2;
    /**
     * Scales a Vec2 by a scalar number
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the vector to scale
     * @param {Number} b amount to scale the vector by
     * @returns {Vec2} out
     */
    function scale(out: Vec2, a: ReadonlyVec2, b: number): Vec2;
    /**
     * Adds two Vec2's after scaling the second operand by a scalar value
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @param {Number} scale the amount to scale b by before adding
     * @returns {Vec2} out
     */
    function scaleAndAdd(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2, scale: number): Vec2;
    /**
     * Calculates the euclidian distance between two Vec2's
     *
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Number} distance between a and b
     */
    function distance(a: ReadonlyVec2, b: ReadonlyVec2): number;
    /**
     * Calculates the squared euclidian distance between two Vec2's
     *
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Number} squared distance between a and b
     */
    function squaredDistance(a: ReadonlyVec2, b: ReadonlyVec2): number;
    /**
     * Calculates the length of a Vec2
     *
     * @param {ReadonlyVec2} a vector to calculate length of
     * @returns {Number} length of a
     */
    function length(a: ReadonlyVec2): number;
    /**
     * Calculates the squared length of a Vec2
     *
     * @param {ReadonlyVec2} a vector to calculate squared length of
     * @returns {Number} squared length of a
     */
    function squaredLength(a: ReadonlyVec2): number;
    /**
     * Negates the components of a Vec2
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a vector to negate
     * @returns {Vec2} out
     */
    function negate(out: Vec2, a: ReadonlyVec2): Vec2;
    /**
     * Returns the inverse of the components of a Vec2
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a vector to invert
     * @returns {Vec2} out
     */
    function inverse(out: Vec2, a: ReadonlyVec2): Vec2;
    /**
     * Normalize a Vec2
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a vector to normalize
     * @returns {Vec2} out
     */
    function normalize(out: Vec2, a: ReadonlyVec2): Vec2;
    /**
     * Calculates the dot product of two Vec2's
     *
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Number} dot product of a and b
     */
    function dot(a: ReadonlyVec2, b: ReadonlyVec2): number;
    /**
     * Computes the cross product of two Vec2's
     * Note that the cross product must by definition produce a 3D vector
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Vec3} out
     */
    function cross(out: Vec3, a: ReadonlyVec2, b: ReadonlyVec2): Vec3;
    /**
     * Performs a linear interpolation between two Vec2's
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @returns {Vec2} out
     */
    function lerp(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2, t: number): Vec2;
    /**
     * Generates a random vector with the given scale
     *
     * @param {Vec2} out the receiving vector
     * @param {Number} [scale] Length of the resulting vector. If omitted, a unit vector will be returned
     * @returns {Vec2} out
     */
    function random(out: Vec2, scale: number): Vec2;
    /**
     * Transforms the Vec2 with a mat2
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the vector to transform
     * @param {ReadonlyMat2} m matrix to transform with
     * @returns {Vec2} out
     */
    function transformMat2(out: Vec2, a: ReadonlyVec2, m: ReadonlyMat2): Vec2;
    /**
     * Transforms the Vec2 with a mat2d
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the vector to transform
     * @param {ReadonlyMat2d} m matrix to transform with
     * @returns {Vec2} out
     */
    function transformMat2d(out: Vec2, a: ReadonlyVec2, m: ReadonlyMat2d): Vec2;
    /**
     * Transforms the Vec2 with a mat3
     * 3rd vector component is implicitly '1'
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the vector to transform
     * @param {ReadonlyMat3} m matrix to transform with
     * @returns {Vec2} out
     */
    function transformMat3(out: Vec2, a: ReadonlyVec2, m: ReadonlyVec3): Vec2;
    /**
     * Transforms the Vec2 with a mat4
     * 3rd vector component is implicitly '0'
     * 4th vector component is implicitly '1'
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the vector to transform
     * @param {ReadonlyMat4} m matrix to transform with
     * @returns {Vec2} out
     */
    function transformMat4(out: Vec2, a: ReadonlyVec2, m: ReadonlyVec2): Vec2;
    /**
     * Rotate a 2D vector
     * @param {Vec2} out The receiving Vec2
     * @param {ReadonlyVec2} a The Vec2 point to rotate
     * @param {ReadonlyVec2} b The origin of the rotation
     * @param {Number} rad The angle of rotation in radians
     * @returns {Vec2} out
     */
    function rotate(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2, rad: number): Vec2;
    /**
     * Get the angle between two 2D vectors
     * @param {ReadonlyVec2} a The first operand
     * @param {ReadonlyVec2} b The second operand
     * @returns {Number} The angle in radians
     */
    function angle(a: ReadonlyVec2, b: ReadonlyVec2): number;
    /**
     * Set the components of a Vec2 to zero
     *
     * @param {Vec2} out the receiving vector
     * @returns {Vec2} out
     */
    function zero(out: Vec2): Vec2;
    /**
     * Returns a string representation of a vector
     *
     * @param {ReadonlyVec2} a vector to represent as a string
     * @returns {String} string representation of the vector
     */
    function str(a: ReadonlyVec2): string;
    /**
     * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
     *
     * @param {ReadonlyVec2} a The first vector.
     * @param {ReadonlyVec2} b The second vector.
     * @returns {Boolean} True if the vectors are equal, false otherwise.
     */
    function exactEquals(a: ReadonlyVec2, b: ReadonlyVec2): boolean;
    /**
     * Returns whether or not the vectors have approximately the same elements in the same position.
     *
     * @param {ReadonlyVec2} a The first vector.
     * @param {ReadonlyVec2} b The second vector.
     * @returns {Boolean} True if the vectors are equal, false otherwise.
     */
    function equals(a: ReadonlyVec2, b: ReadonlyVec2): boolean;
    /**
     * Perform some operation over an array of Vec2s.
     *
     * @param {Array} a the array of vectors to iterate over
     * @param {Number} stride Number of elements between the start of each Vec2. If 0 assumes tightly packed
     * @param {Number} offset Number of elements to skip at the beginning of the array
     * @param {Number} count Number of Vec2s to iterate over. If 0 iterates over entire array
     * @param {Function} fn Function to call for each vector in the array
     * @param {Object} [arg] additional argument to pass to fn
     * @returns {Array} a
     * @function
     */
    const forEach: (a: number[], stride: number, offset: number, count: number, fn: (v1: Vec2, v2: Vec2, arg: any) => void, arg?: any) => number[];
}

