import { SessionKeyNotExistError } from "./errors";
import { ServerRequest } from "./request";
import { ServerResponse } from "./response";

/* 读取/更新会话对象 */
export class Session<T extends Record<string, any>> {
  constructor(
    readonly req: ServerRequest,
    readonly res: ServerResponse,
  ) {}

  /* 删除session中指定的key */
  deleteKey<Key extends keyof T>(key: Key) {
    this.set(key, null as any);
    return this;
  }

  /* 更新会话对象 */
  set<Key extends keyof T>(key: Key, value: T[Key]) {
    if (!this.res.session) this.res.session = {};
    (this.res.session as any)[key] = value;
    return this;
  }

  /* 读取会话对象 */
  get<Key extends keyof T>(key: Key): T[Key] | undefined {
    return (this.req.session as any)?.[key];
  }

  /**
   * 读取会话对象
   * @throws SessionKeyNotExistError 当在session上找不到key时抛出
   */
  fetch<Key extends keyof T>(key: Key): T[Key] {
    if (!this.has(key))
      throw new SessionKeyNotExistError(
        `在session上找不到key ` + (key as string),
      );
    return this.get(key)!;
  }

  /* 判断会话上是否存在指定的key */
  has<Key extends keyof T>(key: Key) {
    if (!this.req.session) return false;
    return key in this.req.session;
  }

  /* 删除会话对象 */
  destroy() {
    this.res.session = null;
  }
}
