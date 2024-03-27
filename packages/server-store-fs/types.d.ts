///<reference types="server-store/types.d.ts"/>

declare interface Collection {
  path: string;
  data: Record<string, StoreItem>;
}
