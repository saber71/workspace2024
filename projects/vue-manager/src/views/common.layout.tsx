import { ROUTE_RECORDS } from "@/constant.ts";
import { useTheme } from "@/stores";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons-vue";
import {
  type ItemType,
  Layout,
  LayoutSider,
  Menu,
  Switch,
} from "ant-design-vue";
import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
  VueInject,
  Computed,
  Mut,
} from "vue-class";
import { type RouteRecordRaw, RouterView } from "vue-router";

export interface CommonLayoutProps extends VueComponentBaseProps {}

@Component()
export class CommonLayoutInst extends VueComponent<CommonLayoutProps> {
  static readonly defineProps: ComponentProps<CommonLayoutProps> = ["inst"];

  @VueInject(ROUTE_RECORDS) readonly routeRecords: RouteRecordRaw;

  @Mut() siderCollapsed: boolean = false;

  themeStore = useTheme();

  @Computed() get menu() {
    return filter(this.routeRecords.children!);

    function filter(routes: RouteRecordRaw[]) {
      const result: any[] = [];
      for (let route of routes) {
        if (route.meta && route.meta.hidden !== false) {
          const item: ItemType = {
            icon: route.meta.icon as any,
            label: route.meta.title,
            key: route.name as string,
            title: route.meta.title as string,
          };
          if (route.children?.length)
            (item as any).children = filter(route.children);
          result.push(item);
        }
      }
      return result;
    }
  }

  render(): VNodeChild {
    return (
      <Layout class={"h-full"}>
        <LayoutSider
          collapsed={this.siderCollapsed}
          collapsible={true}
          trigger={null}
        >
          <div class={"logo-title"}>
            <img src={"/vite.svg"} />
            <span class={"text-red-500"}>Vue Manager</span>
          </div>
          <Menu items={this.menu} mode={"inline"} theme={"dark"}></Menu>
        </LayoutSider>
        <Layout>
          <div class={"header bg-secondary h-12 flex items-center"}>
            {this.siderCollapsed ? (
              <MenuUnfoldOutlined
                onClick={() => (this.siderCollapsed = false)}
              />
            ) : (
              <MenuFoldOutlined onClick={() => (this.siderCollapsed = true)} />
            )}
            header
            <Switch
              checked={this.themeStore.isDark}
              onUpdate:checked={(val) => (this.themeStore.isDark = !!val)}
            ></Switch>
          </div>
          <div class={"bg-base p-6"}>
            content
            <RouterView />
          </div>
        </Layout>
      </Layout>
    );
  }
}

export default toNative<CommonLayoutProps>(CommonLayoutInst);
