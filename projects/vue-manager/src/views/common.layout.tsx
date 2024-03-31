import { ROUTE_RECORDS } from "@/constant.ts";
import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
  VueInject,
  Computed,
} from "vue-class";
import type { RouteRecordRaw } from "vue-router";

export interface CommonLayoutProps extends VueComponentBaseProps {}

@Component()
export class CommonLayoutInst extends VueComponent<CommonLayoutProps> {
  static readonly defineProps: ComponentProps<CommonLayoutProps> = ["inst"];

  @VueInject(ROUTE_RECORDS) readonly routeRecords: RouteRecordRaw;

  @Computed() get menu() {
    for (let child of this.routeRecords.children!) {
    }
    return [];
  }

  render(): VNodeChild {
    return <div></div>;
  }
}

export default toNative<CommonLayoutProps>(CommonLayoutInst);
