/// <reference types="vite/client" />
///<reference types="server-user/types.d.ts"/>
///<reference types="server-log/types.d.ts"/>

declare module "*.vue" {
  import { ComponentOptions } from "vue";
  const componentOptions: ComponentOptions;
  export default componentOptions;
}

declare interface ViewMeta {
  title: string;
  hidden?: boolean;
  icon?: any;
}
