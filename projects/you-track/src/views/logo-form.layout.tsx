import logo from "@/assets/logo.svg";
import { Flex } from "ant-design-vue";
import { type VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  Mut,
  toNative,
  VueComponent,
  type VueComponentBaseProps,
} from "vue-class";
import { RouterView } from "vue-router";

@Component({ provideThis: true })
export class LogoFormLayoutInst extends VueComponent {
  static readonly defineProps: ComponentProps<VueComponentBaseProps> = ["inst"];

  @Mut()
  errorMsg = "";

  render(): VNodeChild {
    return (
      <Flex class={"w-full h-full"} justify={"center"} align={"center"}>
        <div class={"w-96"}>
          <Flex justify={"center"}>
            <img src={logo} width={96} height={96} />
          </Flex>
          <div class={"text-center font-bold mt-1 text-lg"}>YouTrack</div>
          {this.errorMsg ? (
            <div class={"text-red-400 text-center mt-2"}>{this.errorMsg}</div>
          ) : null}
          <RouterView class={"mt-3"} />
        </div>
      </Flex>
    );
  }
}

export default toNative<VueComponentBaseProps>(LogoFormLayoutInst);

export const Meta = {};
