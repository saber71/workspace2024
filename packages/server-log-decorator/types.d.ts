/// <reference types="server/types"/>
/// <reference types="server-store/types"/>

declare interface LogModel extends StoreItem {
  creator: string;
  createTime: number;
  description: string;
  query: any;
  body: any;
  url: string;
  data?: any;
}
