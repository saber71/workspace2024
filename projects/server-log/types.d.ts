/// <reference types="server/types"/>
/// <reference types="server-store/types"/>

declare interface LogModel extends StoreItem {
  creator: string;
  createTime: number;
  description: string;
  data?: any;
}
