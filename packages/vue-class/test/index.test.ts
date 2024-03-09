import { LoadableContainer } from "dependency-injection";
import { expect, test } from "vitest";
import { isRef } from "vue";
import {
  Computed,
  ModuleName,
  Mut,
  Readonly,
  Service,
  VueClass,
  VueComponent,
  Watcher,
} from "../src";

VueComponent.__test__ = true;

@Service()
class A {
  @Mut()
  a = 0;

  c = 0;

  @Readonly()
  obj = { a: 12 };

  @Computed()
  get b() {
    this.c++;
    return this.c;
  }

  @Watcher({ source: "a" })
  watch() {
    expect(this.a).toEqual(1);
  }
}

const container = new LoadableContainer();
container.load({ moduleName: ModuleName });

test("vue-class:Service", () => {
  const a = VueClass.getInstance(A);
  a.a++;
  a.obj.a = 0;

  expect(a.b).toEqual(2);
  expect(a.c === a.b).toEqual(true);
  expect(a.obj.a).toEqual(12);
  expect(isRef(a[Symbol.for("a")])).toEqual(true);
});
