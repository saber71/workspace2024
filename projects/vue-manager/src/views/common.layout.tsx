import { ROUTE_RECORDS, ROUTER } from "@/constant.ts";
import { useUser } from "@/stores";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons-vue";
import {
  Breadcrumb,
  BreadcrumbItem,
  Flex,
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
  Watcher,
} from "vue-class";
import {
  type Router,
  type RouteRecordRaw,
  RouterLink,
  RouterView,
} from "vue-router";

export interface CommonLayoutProps extends VueComponentBaseProps {}

@Component({ provideThis: true })
export class CommonLayoutInst extends VueComponent<CommonLayoutProps> {
  static readonly defineProps: ComponentProps<CommonLayoutProps> = ["inst"];

  @VueInject(ROUTE_RECORDS) readonly routeRecords: RouteRecordRaw;

  @Mut() sideCollapsed: boolean = false;

  @VueInject(ROUTER) router: Router;

  @Mut() breadcrumbItems: { title: string; routeName?: string }[] = [];

  readonly userStore = useUser();

  @Computed() get curRouteName() {
    let result = "";
    let menus: any[] = this.menu;
    for (let breadcrumbItem of this.breadcrumbItems.slice(1)) {
      if (breadcrumbItem.routeName) {
        const subMenu = menus.find(
          (item) => item.key === breadcrumbItem.routeName,
        );
        if (subMenu.children) menus = subMenu;
        else {
          result = breadcrumbItem.routeName;
          break;
        }
      }
    }
    return [result];
  }

  @Computed() get menu() {
    return filter(
      this.routeRecords.children!.filter(
        (item) => item.name === CommonLayoutInst.name,
      )[0].children!,
    );

    function filter(routes: RouteRecordRaw[]) {
      const result: any[] = [];
      for (let route of routes) {
        if (route.meta && route.meta.hidden !== true) {
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

  @Watcher<CommonLayoutInst>({
    source: (instance) => instance.router.currentRoute.value.name,
    option: { immediate: true },
  })
  updateBreadcrumb() {
    const curRouteName = this.router.currentRoute.value.name!;
    const result: CommonLayoutInst["breadcrumbItems"] = [];
    findRoutes(this.routeRecords.children!, result);
    result.unshift({
      title: "首页",
    });
    this.breadcrumbItems = result;

    function findRoutes(
      itemTypes: RouteRecordRaw[],
      result: CommonLayoutInst["breadcrumbItems"],
    ) {
      for (let item of itemTypes) {
        if (item.children?.length) findRoutes(item.children, result);
        if (result.length || item.name === curRouteName) {
          if (item.meta) {
            result.unshift({
              title: item.meta.title as string,
              routeName: item.name as string,
            });
          }
          break;
        }
      }
    }
  }

  render(): VNodeChild {
    return (
      <Layout class={"h-full"}>
        <LayoutSider
          collapsed={this.sideCollapsed}
          collapsible={true}
          trigger={null}
        >
          {/*顶部logo和系统名*/}
          <Flex class={"p-2 select-none"} align={"center"} justify={"center"}>
            <img src={"/vite.svg"} />
            {/*侧边栏收起时不显示系统名*/}
            {this.sideCollapsed ? null : (
              <div class={"text-white whitespace-nowrap text-2xl ml-1"}>
                Vue-Manager
              </div>
            )}
          </Flex>
          {/*菜单栏*/}
          <Menu
            items={this.menu}
            selectedKeys={this.curRouteName}
            mode={"inline"}
            theme={"dark"}
          ></Menu>
        </LayoutSider>
        <Layout>
          <header
            class={
              "bg-secondary h-12 flex items-center flex-shrink-0 px-6 justify-between"
            }
          >
            {/*头部左侧*/}
            <Flex align={"center"}>
              {/*侧边栏收起/展开触发器*/}
              {this.sideCollapsed ? (
                <MenuUnfoldOutlined
                  onClick={() => (this.sideCollapsed = false)}
                />
              ) : (
                <MenuFoldOutlined onClick={() => (this.sideCollapsed = true)} />
              )}
              {/*面包屑*/}
              <Breadcrumb class={"ml-3"}>
                {this.breadcrumbItems.map((item) => (
                  <BreadcrumbItem>
                    {item.routeName ? (
                      <RouterLink to={{ name: item.routeName }}>
                        {item.title}
                      </RouterLink>
                    ) : (
                      item.title
                    )}
                  </BreadcrumbItem>
                ))}
              </Breadcrumb>
              <Switch
                checked={this.userStore.isDarkTheme()}
                onUpdate:checked={(val) => this.userStore.setDarkTheme(!!val)}
              ></Switch>
            </Flex>
            {/*头部右侧*/}
            <div>user</div>
          </header>
          <main class={"bg-base p-6 flex-grow overflow-auto"}>
            <RouterView class={"bg-secondary h-full"} />
          </main>
        </Layout>
      </Layout>
    );
  }
}

export default toNative<CommonLayoutProps>(CommonLayoutInst);