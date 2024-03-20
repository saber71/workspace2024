interface IndexedCollection extends Iterable<number> {
  readonly length: number;
  [index: number]: number;
}

// prettier-ignore
declare type Mat2 =
  | [number, number,
  number, number]
  | IndexedCollection;

// prettier-ignore
declare type Mat2d =
  | [number, number,
  number, number,
  number, number]
  | IndexedCollection;

// prettier-ignore
declare type Mat3 =
  | [number, number, number,
  number, number, number,
  number, number, number]
  | IndexedCollection;

// prettier-ignore
declare type Mat4 =
  | [number, number, number, number,
  number, number, number, number,
  number, number, number, number,
  number, number, number, number]
  | IndexedCollection;

declare type Quat = [number, number, number, number] | IndexedCollection;

// prettier-ignore
declare type Quat2 =
  | [number, number, number, number,
  number, number, number, number]
  | IndexedCollection;

declare type Vec2 = [number, number] | IndexedCollection;
declare type Vec3 = [number, number, number] | IndexedCollection;
declare type Vec4 = [number, number, number, number] | IndexedCollection;

// prettier-ignore
declare type ReadonlyMat2 =
  | readonly [
  number, number,
  number, number
]
  | IndexedCollection;

// prettier-ignore
declare type ReadonlyMat2d =
  | readonly [
  number, number,
  number, number,
  number, number
]
  | IndexedCollection;

// prettier-ignore
declare type ReadonlyMat3 =
  | readonly [
  number, number, number,
  number, number, number,
  number, number, number
]
  | IndexedCollection;

// prettier-ignore
declare type ReadonlyMat4 =
  | readonly [
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
  number, number, number, number
]
  | IndexedCollection;

declare type ReadonlyQuat =
  | readonly [number, number, number, number]
  | IndexedCollection;

declare type ReadonlyQuat2 =
  | readonly [number, number, number, number, number, number, number, number]
  | IndexedCollection;

declare type ReadonlyVec2 = readonly [number, number] | IndexedCollection;
declare type ReadonlyVec3 =
  | readonly [number, number, number]
  | IndexedCollection;
declare type ReadonlyVec4 =
  | readonly [number, number, number, number]
  | IndexedCollection;
