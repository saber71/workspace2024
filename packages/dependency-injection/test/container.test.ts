import { describe, test, expect } from "@jest/globals";
import {
  Inject,
  Injectable,
  Container,
  ContainerRepeatLoadError,
  NotExistLabelError,
  InvalidValueError,
} from "../src";

describe("container.test", () => {
  test("检查依赖注入是否正常", () => {
    @Injectable({
      singleton: true,
      createImmediately: true,
    })
    class Parent {
      @Inject()
      cc: string = "";
    }

    @Injectable()
    class B {}

    type great = "123" | "sa" | number;

    @Injectable({
      moduleName: "不生效",
      singleton: true,
      createImmediately: true,
    })
    class None {}

    let count = 0;

    @Injectable({
      paramtypes: { 0: "不生效", 1: "greet" },
      moduleName: "test",
      singleton: true,
      createImmediately: true,
    })
    class A extends Parent {
      @Inject("greet")
      b: great;
      @Inject("aaa")
      aaa: string = "";

      constructor(
        //@ts-ignore
        @Inject("aaa")
        readonly a: string,
        readonly bb: great,
        readonly bbb: B,
      ) {
        super();
      }
    }

    @Injectable()
    class CC {}

    let factoryCount = 0;
    const container = new Container();
    container
      .bindValue("String", "String")
      .bindGetter("aaa", () => {
        expect(count).toEqual(0);
        count++;
        return "aaa";
      })
      .bindFactory("greet", () => {
        factoryCount++;
        return 0;
      });
    try {
      container.bindValue("pos", undefined);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValueError);
    }

    container.bindFactory("无效的factory", () => undefined);
    container.bindGetter("无效的getter", () => undefined);

    try {
      container.getValue("无效的factory");
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValueError);
    }

    try {
      container.getValue("无效的getter");
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValueError);
    }

    container.load({ moduleName: "test" });

    try {
      container.load({ moduleName: "不生效" });
    } catch (e) {
      expect(e).toBeInstanceOf(ContainerRepeatLoadError);
    }

    try {
      container.getValue(None);
    } catch (e) {
      expect(e).toBeInstanceOf(NotExistLabelError);
    }

    try {
      container.getValue("123");
    } catch (e) {
      expect(e).toBeInstanceOf(NotExistLabelError);
    }

    const a = container.getValue<A>(A);
    const parent = container.getValue(Parent);
    expect(a).toBeTruthy();
    expect(a === parent).toEqual(true);
    expect(container.getValue(A) === a).toBeTruthy();
    expect(a.a).toEqual("aaa");
    expect(a.aaa).toEqual("aaa");
    expect(a.bb).toEqual(0);
    expect(a.b).toEqual(0);
    expect(a.bbb).toBeInstanceOf(B);
    expect(factoryCount > 0).toEqual(true);
    expect(container.getValue(CC) !== container.getValue(CC)).toEqual(true);
  });
});
