import logo from "@/assets/logo.svg";
import { Flex } from "ant-design-vue";
import { IoC } from "ioc";
import { type HTMLAttributes, provide, type VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  Mut,
  toNative,
  VueComponent,
} from "vue-class";
import { RouterView } from "vue-router";

@Component()
export class LogoFormLayoutInst extends VueComponent {
  static readonly defineProps: ComponentProps<Partial<HTMLAttributes>> = [];

  static readonly key = Symbol("LogoFormLayoutInst");

  @Mut()
  errorMsg = "";

  [IoC.Initializer]() {
    provide(LogoFormLayoutInst.key, this);
  }

  render(): VNodeChild {
    return (
      <Flex class={"w-full h-full"} justify={"center"} align={"center"}>
        <div class={"w-96"}>
          <Flex justify={"center"}>
            <img src={logo} width={96} height={96} />
          </Flex>
          <div class={"text-center font-bold mt-2 text-lg"}>YouTrack</div>
          {this.errorMsg ? (
            <div class={"text-red-400 text-center"}>{this.errorMsg}</div>
          ) : null}
          <RouterView class={"mt-2"} />
        </div>
      </Flex>
    );
  }
}

export default toNative<Partial<HTMLAttributes>>(LogoFormLayoutInst);

export const Meta = {};
