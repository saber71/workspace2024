import "./common.layout.ant-design-vue.scss";
import "./common.layout.theme.css";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { userApi } from "@/api.ts";
import { DesktopViewInst } from "@/views/desktop.view.tsx";
import { ROUTE_RECORDS } from "@/constant.ts";
import { useUser } from "@/stores";
import LoginView from "@/views/login.view.tsx";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import {
  Avatar,
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  Flex,
  type ItemType,
  Layout,
  LayoutSider,
  Menu,
  MenuItem,
  Space,
  SubMenu,
  Switch,
  Button,
  ConfigProvider,
} from "ant-design-vue";
import { nextTick, type VNodeChild } from "vue";
import {
  BindThis,
  Component,
  type ComponentProps,
  Computed,
  Inject,
  Mut,
  toNative,
  VueComponent,
  type VueComponentBaseProps,
  Watcher,
} from "vue-class";
import { type RouteRecordRaw, RouterLink, RouterView } from "vue-router";

export interface CommonLayoutProps extends VueComponentBaseProps {}

@Component({ provideThis: true })
export class CommonLayoutInst extends VueComponent<CommonLayoutProps> {
  static readonly defineProps: ComponentProps<CommonLayoutProps> = ["inst"];

  @Inject(ROUTE_RECORDS) readonly routeRecords: RouteRecordRaw;
  @Mut() sideCollapsed: boolean = false;
  @Mut() breadcrumbItems: {
    title: string;
    routeName: string;
    enableJump?: boolean;
  }[] = [];
  @Mut() theme = {
    token: {
      colorBgBase: "white",
      colorTextBase: "black",
      colorBorder: "#d9d9d9",
    },
  };

  readonly userStore = useUser();

  get userAvatar() {
    return this.userStore.info.avatar;
  }

  @Computed() get activeMenuItem() {
    const result: any = [];
    let menus: any[] = this.menu;
    for (let breadcrumbItem of this.breadcrumbItems.slice(1)) {
      const subMenu = menus.find((item) => item.title === breadcrumbItem.title);
      result.push(breadcrumbItem.routeName);
      if (subMenu.children) menus = subMenu.children;
      else break;
    }
    return result;
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
            //@ts-ignore
            order: route.meta.order ?? 0,
            openInBlank: route.meta.openInBlank,
          };
          if (route.children?.length)
            (item as any).children = filter(route.children);
          result.push(item);
        }
      }
      return result.sort((a, b) => {
        const result = a.order - b.order;
        if (result === 0) return a.title.localeCompare(b.title);
        return result;
      });
    }
  }

  @Watcher() updateTheme() {
    const userStore = useUser();
    const theme = this.theme;
    const isDark = userStore.isDarkTheme();
    document.body.className = isDark ? "dark" : "light";
    nextTick(() => {
      const docStyle = getComputedStyle(document.body);
      theme.token.colorBgBase = docStyle.getPropertyValue("--bg-base");
      theme.token.colorTextBase = docStyle.getPropertyValue("--text-base");
      theme.token.colorBorder = docStyle.getPropertyValue("--border-base");
    });
  }

  @Watcher<CommonLayoutInst>({
    source: (instance) => instance.route.name,
    option: { immediate: true },
  })
  updateBreadcrumb() {
    const curRouteName = this.router.currentRoute.value.name!;
    const result: CommonLayoutInst["breadcrumbItems"] = [];
    findRoutes(this.routeRecords.children!, result);
    result.unshift({
      title: "首页",
      enableJump: false,
      routeName: "",
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
              enableJump:
                item.name !== curRouteName && !!item.name && !!item.component,
            });
          }
          break;
        }
      }
    }
  }

  @BindThis() onClickUserDropdown({ key }: any) {
    switch (key) {
      case "logout":
        userApi("logout").then((data) => {
          if (data.success) {
            this.userStore.token = "";
            this.userStore.isAuth = false;
            this.router.push({ name: LoginView.name });
          }
        });
        break;
      case "theme-light":
        this.userStore.setDarkTheme(false);
        break;
      case "theme-dark":
        this.userStore.setDarkTheme(true);
        break;
    }
  }

  @BindThis() onClickMenuItem(data: any) {
    const { key } = data;
    const openInBlank = data.item.openInBlank;
    if (key !== this.route.name) {
      if (openInBlank) {
        const url = this.router.resolve({ name: key });
        window.open(url.path, "_blank");
      } else {
        this.router.push({ name: key });
      }
    }
  }

  @BindThis() toDesktop() {
    const url = this.router.resolve({ name: DesktopViewInst.name });
    window.open(url.path, "_blank");
  }

  render(): VNodeChild {
    return (
      <ConfigProvider locale={zhCN} theme={this.theme}>
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
                <div class={"text-white whitespace-nowrap text-xl ml-1"}>
                  Vue-Manager
                </div>
              )}
            </Flex>
            {/*菜单栏*/}
            <Menu
              items={this.menu}
              selectedKeys={this.activeMenuItem}
              openKeys={this.activeMenuItem}
              mode={"inline"}
              theme={"dark"}
              onClick={this.onClickMenuItem}
            ></Menu>
          </LayoutSider>
          <Layout>
            <header
              class={
                "bg-base h-12 flex items-center flex-shrink-0 px-6 justify-between"
              }
            >
              {/*头部左侧*/}
              <Space>
                {/*侧边栏收起/展开触发器*/}
                {this.sideCollapsed ? (
                  <MenuUnfoldOutlined
                    onClick={() => (this.sideCollapsed = false)}
                  />
                ) : (
                  <MenuFoldOutlined
                    onClick={() => (this.sideCollapsed = true)}
                  />
                )}
                {/*面包屑*/}
                <Breadcrumb class={"ml-3 select-none"}>
                  {this.breadcrumbItems.map((item, index) => (
                    <BreadcrumbItem>
                      {item.enableJump ? (
                        <RouterLink
                          to={{ name: item.routeName }}
                          class={"hover:bg-opacity-0 hover:bg-amber-200"}
                        >
                          {item.title}
                        </RouterLink>
                      ) : (
                        <span class={index === 0 ? "not-link" : "cur-path"}>
                          {item.title}
                        </span>
                      )}
                    </BreadcrumbItem>
                  ))}
                </Breadcrumb>
                <Switch
                  checked={this.userStore.isDarkTheme()}
                  onUpdate:checked={(val) => this.userStore.setDarkTheme(!!val)}
                ></Switch>
              </Space>
              {/*头部右侧*/}
              <Space>
                <Button type={"link"} onClick={this.toDesktop}>
                  Desktop
                </Button>
                <Dropdown
                  arrow
                  placement={"bottom"}
                  trigger={"click"}
                  overlay={
                    <Menu onClick={this.onClickUserDropdown}>
                      <SubMenu key={"sub1"} title={"主题"}>
                        <MenuItem key={"theme-light"}>浅色</MenuItem>
                        <MenuItem key={"theme-dark"}>暗色</MenuItem>
                      </SubMenu>
                      <MenuItem key={"logout"}>退出登陆</MenuItem>
                    </Menu>
                  }
                >
                  <Space class={"cursor-pointer"}>
                    <Avatar
                      src={this.userAvatar}
                      size={"small"}
                      icon={this.userAvatar ? null : <UserOutlined />}
                    />
                    {this.userStore.info.name}
                  </Space>
                </Dropdown>
              </Space>
            </header>
            <main class={"bg-secondary flex-grow relative"}>
              <div class={"absolute top-0 left-0 w-full h-full p-6 box-border"}>
                <RouterView
                  class={"bg-base h-full w-full p-6 box-border overflow-auto"}
                />
              </div>
            </main>
          </Layout>
        </Layout>
      </ConfigProvider>
    );
  }
}

export default toNative<CommonLayoutProps>(CommonLayoutInst);
