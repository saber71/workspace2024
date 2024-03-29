import "reflect-metadata";

function Constructor() {
  return (clazz: any) => {
    console.log(clazz.name, Reflect.getMetadata("design:paramtypes", clazz));
  };
}

function Props() {
  return (target: any, prop?: any) => {
    console.log(prop, Reflect.getMetadata("design:type", target, prop));
  };
}

@Constructor()
class Main {
  constructor(a1: string, a2: number, a3: boolean) {}

  @Props() readonly name: string;
  @Props() b: number;
}
