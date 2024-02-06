import { expect, test } from "vitest";
import { IoC } from "../src";

class A {}

@IoC.Injectable()
class B extends A {}

class A1 {}

@IoC.Injectable({
  singleton: true,
})
class B1 extends A1 {}

class A2 {}

let instance: any;

@IoC.Injectable({
  onCreate: (instance1) => (instance = instance1),
  singleton: true,
  createOnLoad: true,
})
class B2 extends A2 {}

IoC.load();

test("IoC:getInstance", () => {
  const a = IoC.getInstance(A);
  const b = IoC.getInstance(B);
  const b2 = IoC.getInstance(B);

  expect(b).toBeTruthy();
  expect(b).toBeInstanceOf(B);
  expect(b).toEqual(a);
  expect(b === b2).toEqual(false);
});

test("IoC:singleton", () => {
  const b = IoC.getInstance(B1);
  const b2 = IoC.getInstance(B1);
  expect(b).toEqual(b2);
});

test("IoC:onCreate and createOnLoad", () => {
  expect(instance).toBeTruthy();
  const b = IoC.getInstance(B2);
  expect(b).toEqual(instance);
});
