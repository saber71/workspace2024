import { Inject } from "vue-class";

export class A {}

export class Service {
  @Inject() a: A;
}
