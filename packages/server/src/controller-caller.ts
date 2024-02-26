import { Container } from "dependency-injection";
import { getOrCreateControllerMethod } from "./common";

export class ControllerCaller<Controller extends object = object> {
  constructor(
    readonly controller: Controller,
    readonly methodName: string,
  ) {}

  call(container: Container) {
    const controllerMethod = getOrCreateControllerMethod(
      this.controller.constructor,
      this.methodName,
    );
    return (container as any)[this.methodName](
      ...controllerMethod.paramtypes.map(
        (type, index) =>
          controllerMethod.paramGetters[index]?.(container) ??
          container.getValue(type),
      ),
    );
  }
}
