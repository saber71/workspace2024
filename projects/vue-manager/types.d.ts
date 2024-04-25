/// <reference types="vite/client" />
///<reference types="server-user/types.d.ts"/>

declare module "*.vue" {
  import { ComponentOptions } from "vue";
  const componentOptions: ComponentOptions;
  export default componentOptions;
}

declare interface ViewMeta {
  title: string;
  order?: number;
  hidden?: boolean;
  icon?: any;
  openInBlank?: boolean;
}
