///<reference types="server/types"/>
///<reference types="server-store/types.d.ts"/>

declare interface FsItem extends StoreItem {
  path: string;
  content: any;
}
