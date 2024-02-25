import { describe, test, expect } from "@jest/globals";
import { Inject, Injectable, Metadata } from "../src";

describe("decorator", () => {
  test("检查Metadata中的类型信息", () => {
    class Parent {
      @Inject()
      cc: string = "";
    }

    class B {}

    type great = "123" | "sa" | number;

    @Injectable({ 0: "不生效", 1: "String" })
    class A extends Parent {
      @Inject()
      b: great = "123";
      @Inject("Number")
      aaa: string = "";

      constructor(
        //@ts-ignore
        @Inject("aaa")
        readonly a: string,
        bb: great,
        bbb: B,
      ) {
        super();
      }
    }

    const metadata = new Metadata(A);
    metadata.constructorParameterTypes.push("aaa", "String", "B");
    metadata.fieldTypes["b"] = "Object";
    metadata.fieldTypes["aaa"] = "Number";
    metadata.fieldTypes["cc"] = "String";
    metadata.parentClassNames.push("Parent");
    metadata.injectable = true;

    expect(Metadata.getOrCreateMetadata(A)).toEqual(metadata);
  });
});
