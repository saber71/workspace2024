import { removeHeadTailChar } from "./removeHeadTailChar";

/* 组装url */
export function composeUrl(...items: string[]) {
  return (
    "/" +
    items
      .map((str) => removeHeadTailChar(str, "/"))
      .filter((str) => str.length > 0)
      .join("/")
  );
}
