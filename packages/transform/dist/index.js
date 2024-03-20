import EventEmitter from 'eventemitter3';

// Configuration Constants
const EPSILON = 0.000001;
let ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
let RANDOM = Math.random;
let ANGLE_ORDER = "zyx";
/**
 * Symmetric round
 * see https://www.npmjs.com/package/round-half-up-symmetric#user-content-detailed-background
 *
 * @param {Number} a value to round
 */ function round(a) {
    if (a >= 0) return Math.round(a);
    return a % 0.5 === 0 ? Math.floor(a) : Math.round(a);
}
/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Float32ArrayConstructor | ArrayConstructor} type Array type, such as Float32Array or Array
 */ function setMatrixArrayType(type) {
    ARRAY_TYPE = type;
}
const degree = Math.PI / 180;
/**
 * Convert Degree To Radian
 *
 * @param {Number} a Angle in Degrees
 */ function toRadian(a) {
    return a * degree;
}
/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 *
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */ function equals(a, b) {
    return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
}

var mat2d;
(function(mat2d) {
    function create() {
        const out = new ARRAY_TYPE(6);
        if (ARRAY_TYPE != Float32Array) {
            out[1] = 0;
            out[2] = 0;
            out[4] = 0;
            out[5] = 0;
        }
        out[0] = 1;
        out[3] = 1;
        return out;
    }
    /**
   * Creates a new identity Mat2d
   *
   * @returns {Mat2d} a new 2x3 matrix
   */ mat2d.create = create;
    function clone(a) {
        const out = new ARRAY_TYPE(6);
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[4] = a[4];
        out[5] = a[5];
        return out;
    }
    /**
   * Creates a new Mat2d initialized with values from an existing matrix
   *
   * @param {ReadonlyMat2d} a matrix to clone
   * @returns {Mat2d} a new 2x3 matrix
   */ mat2d.clone = clone;
    function copy(out, a) {
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[4] = a[4];
        out[5] = a[5];
        return out;
    }
    /**
   * Copy the values from one Mat2d to another
   *
   * @param {Mat2d} out the receiving matrix
   * @param {ReadonlyMat2d} a the source matrix
   * @returns {Mat2d} out
   */ mat2d.copy = copy;
    function identity(out) {
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        out[4] = 0;
        out[5] = 0;
        return out;
    }
    /**
   * Set a Mat2d to the identity matrix
   *
   * @param {Mat2d} out the receiving matrix
   * @returns {Mat2d} out
   */ mat2d.identity = identity;
    function fromValues(a, b, c, d, tx, ty) {
        const out = new ARRAY_TYPE(6);
        out[0] = a;
        out[1] = b;
        out[2] = c;
        out[3] = d;
        out[4] = tx;
        out[5] = ty;
        return out;
    }
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
   */ mat2d.fromValues = fromValues;
    function set(out, a, b, c, d, tx, ty) {
        out[0] = a;
        out[1] = b;
        out[2] = c;
        out[3] = d;
        out[4] = tx;
        out[5] = ty;
        return out;
    }
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
   */ mat2d.set = set;
    function invert(out, a) {
        const aa = a[0], ab = a[1], ac = a[2], ad = a[3];
        const atx = a[4], aty = a[5];
        let det = aa * ad - ab * ac;
        if (!det) {
            return null;
        }
        det = 1.0 / det;
        out[0] = ad * det;
        out[1] = -ab * det;
        out[2] = -ac * det;
        out[3] = aa * det;
        out[4] = (ac * aty - ad * atx) * det;
        out[5] = (ab * atx - aa * aty) * det;
        return out;
    }
    /**
   * Inverts a Mat2d
   *
   * @param {Mat2d} out the receiving matrix
   * @param {ReadonlyMat2d} a the source matrix
   * @returns {Mat2d} out
   */ mat2d.invert = invert;
    function determinant(a) {
        return a[0] * a[3] - a[1] * a[2];
    }
    /**
   * Calculates the determinant of a Mat2d
   *
   * @param {ReadonlyMat2d} a the source matrix
   * @returns {Number} determinant of a
   */ mat2d.determinant = determinant;
    function multiply(out, a, b) {
        const a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
        const b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
        out[0] = a0 * b0 + a2 * b1;
        out[1] = a1 * b0 + a3 * b1;
        out[2] = a0 * b2 + a2 * b3;
        out[3] = a1 * b2 + a3 * b3;
        out[4] = a0 * b4 + a2 * b5 + a4;
        out[5] = a1 * b4 + a3 * b5 + a5;
        return out;
    }
    /**
   * Multiplies two Mat2d's
   *
   * @param {Mat2d} out the receiving matrix
   * @param {ReadonlyMat2d} a the first operand
   * @param {ReadonlyMat2d} b the second operand
   * @returns {Mat2d} out
   */ mat2d.multiply = multiply;
    function rotate(out, a, rad) {
        const a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        out[0] = a0 * c + a2 * s;
        out[1] = a1 * c + a3 * s;
        out[2] = a0 * -s + a2 * c;
        out[3] = a1 * -s + a3 * c;
        out[4] = a4;
        out[5] = a5;
        return out;
    }
    /**
   * Rotates a Mat2d by the given angle
   *
   * @param {Mat2d} out the receiving matrix
   * @param {ReadonlyMat2d} a the matrix to rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {Mat2d} out
   */ mat2d.rotate = rotate;
    function scale(out, a, v) {
        const a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
        const v0 = v[0], v1 = v[1];
        out[0] = a0 * v0;
        out[1] = a1 * v0;
        out[2] = a2 * v1;
        out[3] = a3 * v1;
        out[4] = a4;
        out[5] = a5;
        return out;
    }
    /**
   * Scales the Mat2d by the dimensions in the given vec2
   *
   * @param {Mat2d} out the receiving matrix
   * @param {ReadonlyMat2d} a the matrix to translate
   * @param {ReadonlyVec2} v the vec2 to scale the matrix by
   * @returns {Mat2d} out
   **/ mat2d.scale = scale;
    function translate(out, a, v) {
        const a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
        const v0 = v[0], v1 = v[1];
        out[0] = a0;
        out[1] = a1;
        out[2] = a2;
        out[3] = a3;
        out[4] = a0 * v0 + a2 * v1 + a4;
        out[5] = a1 * v0 + a3 * v1 + a5;
        return out;
    }
    /**
   * Translates the Mat2d by the dimensions in the given vec2
   *
   * @param {Mat2d} out the receiving matrix
   * @param {ReadonlyMat2d} a the matrix to translate
   * @param {ReadonlyVec2} v the vec2 to translate the matrix by
   * @returns {Mat2d} out
   **/ mat2d.translate = translate;
    function fromRotation(out, rad) {
        const s = Math.sin(rad), c = Math.cos(rad);
        out[0] = c;
        out[1] = s;
        out[2] = -s;
        out[3] = c;
        out[4] = 0;
        out[5] = 0;
        return out;
    }
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
   */ mat2d.fromRotation = fromRotation;
    function fromScaling(out, v) {
        out[0] = v[0];
        out[1] = 0;
        out[2] = 0;
        out[3] = v[1];
        out[4] = 0;
        out[5] = 0;
        return out;
    }
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
   */ mat2d.fromScaling = fromScaling;
    function fromTranslation(out, v) {
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        out[4] = v[0];
        out[5] = v[1];
        return out;
    }
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
   */ mat2d.fromTranslation = fromTranslation;
    function str(a) {
        return "Mat2d(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ")";
    }
    /**
   * Returns a string representation of a Mat2d
   *
   * @param {ReadonlyMat2d} a matrix to represent as a string
   * @returns {String} string representation of the matrix
   */ mat2d.str = str;
    function frob(a) {
        return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3] + a[4] * a[4] + a[5] * a[5] + 1);
    }
    /**
   * Returns Frobenius norm of a Mat2d
   *
   * @param {ReadonlyMat2d} a the matrix to calculate Frobenius norm of
   * @returns {Number} Frobenius norm
   */ mat2d.frob = frob;
    function add(out, a, b) {
        out[0] = a[0] + b[0];
        out[1] = a[1] + b[1];
        out[2] = a[2] + b[2];
        out[3] = a[3] + b[3];
        out[4] = a[4] + b[4];
        out[5] = a[5] + b[5];
        return out;
    }
    /**
   * Adds two Mat2d's
   *
   * @param {Mat2d} out the receiving matrix
   * @param {ReadonlyMat2d} a the first operand
   * @param {ReadonlyMat2d} b the second operand
   * @returns {Mat2d} out
   */ mat2d.add = add;
    function subtract(out, a, b) {
        out[0] = a[0] - b[0];
        out[1] = a[1] - b[1];
        out[2] = a[2] - b[2];
        out[3] = a[3] - b[3];
        out[4] = a[4] - b[4];
        out[5] = a[5] - b[5];
        return out;
    }
    /**
   * Subtracts matrix b from matrix a
   *
   * @param {Mat2d} out the receiving matrix
   * @param {ReadonlyMat2d} a the first operand
   * @param {ReadonlyMat2d} b the second operand
   * @returns {Mat2d} out
   */ mat2d.subtract = subtract;
    function multiplyScalar(out, a, b) {
        out[0] = a[0] * b;
        out[1] = a[1] * b;
        out[2] = a[2] * b;
        out[3] = a[3] * b;
        out[4] = a[4] * b;
        out[5] = a[5] * b;
        return out;
    }
    /**
   * Multiply each element of the matrix by a scalar.
   *
   * @param {Mat2d} out the receiving matrix
   * @param {ReadonlyMat2d} a the matrix to scale
   * @param {Number} b amount to scale the matrix's elements by
   * @returns {Mat2d} out
   */ mat2d.multiplyScalar = multiplyScalar;
    function multiplyScalarAndAdd(out, a, b, scale) {
        out[0] = a[0] + b[0] * scale;
        out[1] = a[1] + b[1] * scale;
        out[2] = a[2] + b[2] * scale;
        out[3] = a[3] + b[3] * scale;
        out[4] = a[4] + b[4] * scale;
        out[5] = a[5] + b[5] * scale;
        return out;
    }
    /**
   * Adds two Mat2d's after multiplying each element of the second operand by a scalar value.
   *
   * @param {Mat2d} out the receiving vector
   * @param {ReadonlyMat2d} a the first operand
   * @param {ReadonlyMat2d} b the second operand
   * @param {Number} scale the amount to scale b's elements by before adding
   * @returns {Mat2d} out
   */ mat2d.multiplyScalarAndAdd = multiplyScalarAndAdd;
    function exactEquals(a, b) {
        return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];
    }
    /**
   * Returns whether the matrices have exactly the same elements in the same position (when compared with ===)
   *
   * @param {ReadonlyMat2d} a The first matrix.
   * @param {ReadonlyMat2d} b The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */ mat2d.exactEquals = exactEquals;
    function equals(a, b) {
        const a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
        const b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
        return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5));
    }
    /**
   * Returns whether or not the matrices have approximately the same elements in the same position.
   *
   * @param {ReadonlyMat2d} a The first matrix.
   * @param {ReadonlyMat2d} b The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */ mat2d.equals = equals;
})(mat2d || (mat2d = {}));

var vec2;
(function(vec2) {
    function create() {
        const out = new ARRAY_TYPE(2);
        if (ARRAY_TYPE != Float32Array) {
            out[0] = 0;
            out[1] = 0;
        }
        return out;
    }
    /**
   * Creates a new, empty Vec2
   *
   * @returns {Vec2} a new 2D vector
   */ vec2.create = create;
    function clone(a) {
        const out = new ARRAY_TYPE(2);
        out[0] = a[0];
        out[1] = a[1];
        return out;
    }
    /**
   * Creates a new Vec2 initialized with values from an existing vector
   *
   * @param {ReadonlyVec2} a vector to clone
   * @returns {Vec2} a new 2D vector
   */ vec2.clone = clone;
    function fromValues(x, y) {
        const out = new ARRAY_TYPE(2);
        out[0] = x;
        out[1] = y;
        return out;
    }
    /**
   * Creates a new Vec2 initialized with the given values
   *
   * @param {Number} x X component
   * @param {Number} y Y component
   * @returns {Vec2} a new 2D vector
   */ vec2.fromValues = fromValues;
    function copy(out, a) {
        out[0] = a[0];
        out[1] = a[1];
        return out;
    }
    /**
   * Copy the values from one Vec2 to another
   *
   * @param {Vec2} out the receiving vector
   * @param {ReadonlyVec2} a the source vector
   * @returns {Vec2} out
   */ vec2.copy = copy;
    function set(out, x, y) {
        out[0] = x;
        out[1] = y;
        return out;
    }
    /**
   * Set the components of a Vec2 to the given values
   *
   * @param {Vec2} out the receiving vector
   * @param {Number} x X component
   * @param {Number} y Y component
   * @returns {Vec2} out
   */ vec2.set = set;
    function add(out, a, b) {
        out[0] = a[0] + b[0];
        out[1] = a[1] + b[1];
        return out;
    }
    /**
   * Adds two Vec2's
   *
   * @param {Vec2} out the receiving vector
   * @param {ReadonlyVec2} a the first operand
   * @param {ReadonlyVec2} b the second operand
   * @returns {Vec2} out
   */ vec2.add = add;
    function subtract(out, a, b) {
        out[0] = a[0] - b[0];
        out[1] = a[1] - b[1];
        return out;
    }
    /**
   * Subtracts vector b from vector a
   *
   * @param {Vec2} out the receiving vector
   * @param {ReadonlyVec2} a the first operand
   * @param {ReadonlyVec2} b the second operand
   * @returns {Vec2} out
   */ vec2.subtract = subtract;
    function multiply(out, a, b) {
        out[0] = a[0] * b[0];
        out[1] = a[1] * b[1];
        return out;
    }
    /**
   * Multiplies two Vec2's
   *
   * @param {Vec2} out the receiving vector
   * @param {ReadonlyVec2} a the first operand
   * @param {ReadonlyVec2} b the second operand
   * @returns {Vec2} out
   */ vec2.multiply = multiply;
    function divide(out, a, b) {
        out[0] = a[0] / b[0];
        out[1] = a[1] / b[1];
        return out;
    }
    /**
   * Divides two Vec2's
   *
   * @param {Vec2} out the receiving vector
   * @param {ReadonlyVec2} a the first operand
   * @param {ReadonlyVec2} b the second operand
   * @returns {Vec2} out
   */ vec2.divide = divide;
    function ceil(out, a) {
        out[0] = Math.ceil(a[0]);
        out[1] = Math.ceil(a[1]);
        return out;
    }
    /**
   * Math.ceil the components of a Vec2
   *
   * @param {Vec2} out the receiving vector
   * @param {ReadonlyVec2} a vector to ceil
   * @returns {Vec2} out
   */ vec2.ceil = ceil;
    function floor(out, a) {
        out[0] = Math.floor(a[0]);
        out[1] = Math.floor(a[1]);
        return out;
    }
    /**
   * Math.floor the components of a Vec2
   *
   * @param {Vec2} out the receiving vector
   * @param {ReadonlyVec2} a vector to floor
   * @returns {Vec2} out
   */ vec2.floor = floor;
    function min(out, a, b) {
        out[0] = Math.min(a[0], b[0]);
        out[1] = Math.min(a[1], b[1]);
        return out;
    }
    /**
   * Returns the minimum of two Vec2's
   *
   * @param {Vec2} out the receiving vector
   * @param {ReadonlyVec2} a the first operand
   * @param {ReadonlyVec2} b the second operand
   * @returns {Vec2} out
   */ vec2.min = min;
    function max(out, a, b) {
        out[0] = Math.max(a[0], b[0]);
        out[1] = Math.max(a[1], b[1]);
        return out;
    }
    /**
   * Returns the maximum of two Vec2's
   *
   * @param {Vec2} out the receiving vector
   * @param {ReadonlyVec2} a the first operand
   * @param {ReadonlyVec2} b the second operand
   * @returns {Vec2} out
   */ vec2.max = max;
    function rounds(out, a) {
        out[0] = round(a[0]);
        out[1] = round(a[1]);
        return out;
    }
    /**
   * symmetric round the components of a Vec2
   *
   * @param {Vec2} out the receiving vector
   * @param {ReadonlyVec2} a vector to round
   * @returns {Vec2} out
   */ vec2.rounds = rounds;
    function scale(out, a, b) {
        out[0] = a[0] * b;
        out[1] = a[1] * b;
        return out;
    }
    /**
   * Scales a Vec2 by a scalar number
   *
   * @param {Vec2} out the receiving vector
   * @param {ReadonlyVec2} a the vector to scale
   * @param {Number} b amount to scale the vector by
   * @returns {Vec2} out
   */ vec2.scale = scale;
    function scaleAndAdd(out, a, b, scale) {
        out[0] = a[0] + b[0] * scale;
        out[1] = a[1] + b[1] * scale;
        return out;
    }
    /**
   * Adds two Vec2's after scaling the second operand by a scalar value
   *
   * @param {Vec2} out the receiving vector
   * @param {ReadonlyVec2} a the first operand
   * @param {ReadonlyVec2} b the second operand
   * @param {Number} scale the amount to scale b by before adding
   * @returns {Vec2} out
   */ vec2.scaleAndAdd = scaleAndAdd;
    function distance(a, b) {
        var x = b[0] - a[0], y = b[1] - a[1];
        return Math.sqrt(x * x + y * y);
    }
    /**
   * Calculates the euclidian distance between two Vec2's
   *
   * @param {ReadonlyVec2} a the first operand
   * @param {ReadonlyVec2} b the second operand
   * @returns {Number} distance between a and b
   */ vec2.distance = distance;
    function squaredDistance(a, b) {
        var x = b[0] - a[0], y = b[1] - a[1];
        return x * x + y * y;
    }
    /**
   * Calculates the squared euclidian distance between two Vec2's
   *
   * @param {ReadonlyVec2} a the first operand
   * @param {ReadonlyVec2} b the second operand
   * @returns {Number} squared distance between a and b
   */ vec2.squaredDistance = squaredDistance;
    function length(a) {
        var x = a[0], y = a[1];
        return Math.sqrt(x * x + y * y);
    }
    /**
   * Calculates the length of a Vec2
   *
   * @param {ReadonlyVec2} a vector to calculate length of
   * @returns {Number} length of a
   */ vec2.length = length;
    function squaredLength(a) {
        var x = a[0], y = a[1];
        return x * x + y * y;
    }
    /**
   * Calculates the squared length of a Vec2
   *
   * @param {ReadonlyVec2} a vector to calculate squared length of
   * @returns {Number} squared length of a
   */ vec2.squaredLength = squaredLength;
    function negate(out, a) {
        out[0] = -a[0];
        out[1] = -a[1];
        return out;
    }
    /**
   * Negates the components of a Vec2
   *
   * @param {Vec2} out the receiving vector
   * @param {ReadonlyVec2} a vector to negate
   * @returns {Vec2} out
   */ vec2.negate = negate;
    function inverse(out, a) {
        out[0] = 1.0 / a[0];
        out[1] = 1.0 / a[1];
        return out;
    }
    /**
   * Returns the inverse of the components of a Vec2
   *
   * @param {Vec2} out the receiving vector
   * @param {ReadonlyVec2} a vector to invert
   * @returns {Vec2} out
   */ vec2.inverse = inverse;
    function normalize(out, a) {
        var x = a[0], y = a[1];
        var len = x * x + y * y;
        if (len > 0) {
            //TODO: evaluate use of glm_invsqrt here?
            len = 1 / Math.sqrt(len);
        }
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        return out;
    }
    /**
   * Normalize a Vec2
   *
   * @param {Vec2} out the receiving vector
   * @param {ReadonlyVec2} a vector to normalize
   * @returns {Vec2} out
   */ vec2.normalize = normalize;
    function dot(a, b) {
        return a[0] * b[0] + a[1] * b[1];
    }
    /**
   * Calculates the dot product of two Vec2's
   *
   * @param {ReadonlyVec2} a the first operand
   * @param {ReadonlyVec2} b the second operand
   * @returns {Number} dot product of a and b
   */ vec2.dot = dot;
    function cross(out, a, b) {
        const z = a[0] * b[1] - a[1] * b[0];
        out[0] = out[1] = 0;
        out[2] = z;
        return out;
    }
    /**
   * Computes the cross product of two Vec2's
   * Note that the cross product must by definition produce a 3D vector
   *
   * @param {Vec3} out the receiving vector
   * @param {ReadonlyVec2} a the first operand
   * @param {ReadonlyVec2} b the second operand
   * @returns {Vec3} out
   */ vec2.cross = cross;
    function lerp(out, a, b, t) {
        var ax = a[0], ay = a[1];
        out[0] = ax + t * (b[0] - ax);
        out[1] = ay + t * (b[1] - ay);
        return out;
    }
    /**
   * Performs a linear interpolation between two Vec2's
   *
   * @param {Vec2} out the receiving vector
   * @param {ReadonlyVec2} a the first operand
   * @param {ReadonlyVec2} b the second operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {Vec2} out
   */ vec2.lerp = lerp;
    function random(out, scale) {
        scale = scale === undefined ? 1.0 : scale;
        const r = RANDOM() * 2.0 * Math.PI;
        out[0] = Math.cos(r) * scale;
        out[1] = Math.sin(r) * scale;
        return out;
    }
    /**
   * Generates a random vector with the given scale
   *
   * @param {Vec2} out the receiving vector
   * @param {Number} [scale] Length of the resulting vector. If omitted, a unit vector will be returned
   * @returns {Vec2} out
   */ vec2.random = random;
    function transformMat2(out, a, m) {
        const x = a[0], y = a[1];
        out[0] = m[0] * x + m[2] * y;
        out[1] = m[1] * x + m[3] * y;
        return out;
    }
    /**
   * Transforms the Vec2 with a mat2
   *
   * @param {Vec2} out the receiving vector
   * @param {ReadonlyVec2} a the vector to transform
   * @param {ReadonlyMat2} m matrix to transform with
   * @returns {Vec2} out
   */ vec2.transformMat2 = transformMat2;
    function transformMat2d(out, a, m) {
        var x = a[0], y = a[1];
        out[0] = m[0] * x + m[2] * y + m[4];
        out[1] = m[1] * x + m[3] * y + m[5];
        return out;
    }
    /**
   * Transforms the Vec2 with a mat2d
   *
   * @param {Vec2} out the receiving vector
   * @param {ReadonlyVec2} a the vector to transform
   * @param {ReadonlyMat2d} m matrix to transform with
   * @returns {Vec2} out
   */ vec2.transformMat2d = transformMat2d;
    function transformMat3(out, a, m) {
        const x = a[0], y = a[1];
        out[0] = m[0] * x + m[3] * y + m[6];
        out[1] = m[1] * x + m[4] * y + m[7];
        return out;
    }
    /**
   * Transforms the Vec2 with a mat3
   * 3rd vector component is implicitly '1'
   *
   * @param {Vec2} out the receiving vector
   * @param {ReadonlyVec2} a the vector to transform
   * @param {ReadonlyMat3} m matrix to transform with
   * @returns {Vec2} out
   */ vec2.transformMat3 = transformMat3;
    function transformMat4(out, a, m) {
        const x = a[0];
        const y = a[1];
        out[0] = m[0] * x + m[4] * y + m[12];
        out[1] = m[1] * x + m[5] * y + m[13];
        return out;
    }
    /**
   * Transforms the Vec2 with a mat4
   * 3rd vector component is implicitly '0'
   * 4th vector component is implicitly '1'
   *
   * @param {Vec2} out the receiving vector
   * @param {ReadonlyVec2} a the vector to transform
   * @param {ReadonlyMat4} m matrix to transform with
   * @returns {Vec2} out
   */ vec2.transformMat4 = transformMat4;
    function rotate(out, a, b, rad) {
        //Translate point to the origin
        const p0 = a[0] - b[0], p1 = a[1] - b[1], sinC = Math.sin(rad), cosC = Math.cos(rad);
        //perform rotation and translate to correct position
        out[0] = p0 * cosC - p1 * sinC + b[0];
        out[1] = p0 * sinC + p1 * cosC + b[1];
        return out;
    }
    /**
   * Rotate a 2D vector
   * @param {Vec2} out The receiving Vec2
   * @param {ReadonlyVec2} a The Vec2 point to rotate
   * @param {ReadonlyVec2} b The origin of the rotation
   * @param {Number} rad The angle of rotation in radians
   * @returns {Vec2} out
   */ vec2.rotate = rotate;
    function angle(a, b) {
        const x1 = a[0], y1 = a[1], x2 = b[0], y2 = b[1], // mag is the product of the magnitudes of a and b
        mag = Math.sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2)), // mag &&.. short circuits if mag == 0
        cosine = mag && (x1 * x2 + y1 * y2) / mag;
        // Math.min(Math.max(cosine, -1), 1) clamps the cosine between -1 and 1
        return Math.acos(Math.min(Math.max(cosine, -1), 1));
    }
    /**
   * Get the angle between two 2D vectors
   * @param {ReadonlyVec2} a The first operand
   * @param {ReadonlyVec2} b The second operand
   * @returns {Number} The angle in radians
   */ vec2.angle = angle;
    function zero(out) {
        out[0] = 0.0;
        out[1] = 0.0;
        return out;
    }
    /**
   * Set the components of a Vec2 to zero
   *
   * @param {Vec2} out the receiving vector
   * @returns {Vec2} out
   */ vec2.zero = zero;
    function str(a) {
        return "Vec2(" + a[0] + ", " + a[1] + ")";
    }
    /**
   * Returns a string representation of a vector
   *
   * @param {ReadonlyVec2} a vector to represent as a string
   * @returns {String} string representation of the vector
   */ vec2.str = str;
    function exactEquals(a, b) {
        return a[0] === b[0] && a[1] === b[1];
    }
    /**
   * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
   *
   * @param {ReadonlyVec2} a The first vector.
   * @param {ReadonlyVec2} b The second vector.
   * @returns {Boolean} True if the vectors are equal, false otherwise.
   */ vec2.exactEquals = exactEquals;
    function equals(a, b) {
        const a0 = a[0], a1 = a[1];
        const b0 = b[0], b1 = b[1];
        return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1));
    }
    /**
   * Returns whether or not the vectors have approximately the same elements in the same position.
   *
   * @param {ReadonlyVec2} a The first vector.
   * @param {ReadonlyVec2} b The second vector.
   * @returns {Boolean} True if the vectors are equal, false otherwise.
   */ vec2.equals = equals;
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
   */ vec2.forEach = function() {
        const vec = create();
        return function(a, stride, offset, count, fn, arg) {
            let i, l;
            if (!stride) {
                stride = 2;
            }
            if (!offset) {
                offset = 0;
            }
            if (count) {
                l = Math.min(count * stride + offset, a.length);
            } else {
                l = a.length;
            }
            for(i = offset; i < l; i += stride){
                vec[0] = a[i];
                vec[1] = a[i + 1];
                fn(vec, vec, arg);
                a[i] = vec[0];
                a[i + 1] = vec[1];
            }
            return a;
        };
    }();
})(vec2 || (vec2 = {}));

const scratchInverseWorld = mat2d.create();
class Transform extends EventEmitter {
    _defaultParent;
    _localMatrix = mat2d.create();
    _needUpdateLocalMatrix = true;
    _needUpdateWorldMatrix = true;
    _origin = vec2.create();
    _parent;
    _rotation = 0;
    _scale = vec2.fromValues(1, 1);
    _translate = vec2.create();
    _translateOffset = vec2.create();
    _worldMatrix = mat2d.create();
    constructor(defaultParent){
        super();
        this._defaultParent = defaultParent;
    }
    copyFrom(src) {
        const translation = src.getTranslation();
        const scale = src.getScale();
        const offset = src.getTranslateOffset();
        const origin = src.getOrigin();
        return this.translateTo(translation[0], translation[1]).scaleTo(scale[0], scale[1]).rotateTo(src.getRotation()).setTranslateOffset(offset[0], offset[1]).setOrigin(origin[0], origin[1]);
    }
    getLocalMatrix() {
        if (this._needUpdateLocalMatrix) {
            this._needUpdateLocalMatrix = false;
            this._computeLocalMatrix();
        }
        return this._localMatrix;
    }
    getOrigin() {
        return this._origin;
    }
    getParent() {
        return this._parent;
    }
    getRotation() {
        return this._rotation;
    }
    getScale() {
        return this._scale;
    }
    getTranslateOffset() {
        return this._translateOffset;
    }
    getTranslation() {
        return this._translate;
    }
    getWorldMatrix() {
        if (this._needUpdateWorldMatrix) {
            this._needUpdateWorldMatrix = false;
            this._computeWorldMatrix();
        }
        return this._worldMatrix;
    }
    refreshMatrix() {
        const exist = !this._needUpdateLocalMatrix || !this._needUpdateWorldMatrix;
        this._needUpdateLocalMatrix = this._needUpdateWorldMatrix = true;
        if (exist) this.emit("worldMatrixUpdated");
        return this;
    }
    rotate(angle) {
        if (angle === 0) return this;
        this._rotation += angle;
        return this.refreshMatrix();
    }
    rotateByDegree(degree) {
        return this.rotate(degree / 180 * Math.PI);
    }
    rotateTo(angle) {
        return this.rotate(angle - this._rotation);
    }
    rotateToByDegree(degree) {
        return this.rotateTo(degree / 180 * Math.PI);
    }
    scale(x, y) {
        if (x === 0 && y === 0) return this;
        this._scale = vec2.fromValues(this._scale[0] + x, this._scale[1] + y);
        return this.refreshMatrix();
    }
    scaleTo(x, y) {
        return this.scale(x - this._scale[0], y - this._scale[1]);
    }
    setDefaultParent(val) {
        if (val === this._defaultParent) return this;
        const prevDefaultParent = this._defaultParent;
        this._defaultParent = val;
        if (!this._parent && val) this.setParent(this._defaultParent);
        else if (prevDefaultParent === this._parent) this.setParent(this._defaultParent);
        return this;
    }
    setOrigin(x, y) {
        if (x !== this._origin[0] || y !== this._origin[1]) {
            this._origin = vec2.fromValues(x, y);
            this.refreshMatrix();
        }
        return this;
    }
    setParent(parent) {
        const changed = parent !== this._parent;
        if (!changed) return this;
        if (this._parent) {
            this._parent.off("worldMatrixUpdated", this._onParentUpdateWorldMatrix, this);
        }
        this._parent = parent ?? this._defaultParent;
        if (this._parent) this._parent.on("worldMatrixUpdated", this._onParentUpdateWorldMatrix, this);
        if (changed) this.emit("parentChanged");
        return this.refreshMatrix();
    }
    setTranslateOffset(x, y) {
        if (x === this._translateOffset[0] && y === this._translateOffset[1]) return this;
        this._translateOffset[0] = x;
        this._translateOffset[1] = y;
        return this.refreshMatrix();
    }
    toLocal(p, out = vec2.create()) {
        mat2d.invert(scratchInverseWorld, this.getWorldMatrix());
        return vec2.transformMat2d(out, p, scratchInverseWorld);
    }
    toStringLocal() {
        return mat2d.str(this.getLocalMatrix());
    }
    toStringWorld() {
        return mat2d.str(this.getWorldMatrix());
    }
    toWorld(p, out = vec2.create()) {
        return vec2.transformMat2d(out, p, this.getWorldMatrix());
    }
    translate(x, y) {
        if (x === 0 && y === 0) return this;
        this._translate[0] += x;
        this._translate[1] += y;
        return this.refreshMatrix();
    }
    translateTo(x = this._translate[0], y = this._translate[1]) {
        return this.translate(x - this._translate[0], y - this._translate[1]);
    }
    _computeLocalMatrix() {
        const anchor = this._origin;
        mat2d.identity(this._localMatrix);
        mat2d.translate(this._localMatrix, this._localMatrix, vec2.fromValues(anchor[0] + this._translate[0] + this._translateOffset[0] * this._scale[0], anchor[1] + this._translate[1] + this._translateOffset[1] * this._scale[1]));
        mat2d.rotate(this._localMatrix, this._localMatrix, this._rotation);
        mat2d.scale(this._localMatrix, this._localMatrix, this._scale);
        mat2d.translate(this._localMatrix, this._localMatrix, vec2.fromValues(-anchor[0], -anchor[1]));
    }
    _computeWorldMatrix() {
        if (this._parent) {
            mat2d.copy(this._worldMatrix, this._parent.getWorldMatrix());
            mat2d.multiply(this._worldMatrix, this._worldMatrix, this.getLocalMatrix());
        } else {
            mat2d.copy(this._worldMatrix, this.getLocalMatrix());
        }
    }
    _onParentUpdateWorldMatrix() {
        this.refreshMatrix();
    }
}

export { ANGLE_ORDER, ARRAY_TYPE, EPSILON, RANDOM, Transform, equals, mat2d, round, setMatrixArrayType, toRadian, vec2 };
