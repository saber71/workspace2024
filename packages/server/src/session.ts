import { ServerError, SessionKeyNotExistError } from "./errors";
import { ServerRequest } from "./request";
import { ServerResponse } from "./response";
import jwt from "jsonwebtoken";

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
    /* 在express-session中，id似乎是只读的，不能修改。干脆直接把对id的修改给禁了 */
    if (key === "id") throw new ServerError("Session.id是只读属性不能修改");
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

/* 使用jwt生成、验证、传输token */
export class JwtSession<T extends Record<string, any>> extends Session<T> {
  constructor(req: ServerRequest, res: ServerResponse) {
    super(req, res);
    const token = req.headers[this.tokenKey];
    res.headers[this.tokenKey] = token;
    if (typeof token === "string") {
      try {
        const result = jwt.verify(token, this.secretKey) as any;
        if (result && typeof result === "object") this._data = result;
      } catch (e) {}
    }
  }

  readonly tokenKey = "Authorized";
  readonly secretKey = "Secret";
  private _data?: T;

  set<Key extends keyof T>(key: Key, value: T[Key]) {
    if (!this._data) this._data = {} as T;
    if (value === null) delete this._data[key];
    else this._data[key] = value;
    this.res.headers[this.tokenKey] = this.toString();
    return super.set(key, value);
  }

  get<Key extends keyof T>(key: Key): T[Key] | undefined {
    return this._data?.[key];
  }

  has<Key extends keyof T>(key: Key) {
    if (!this._data) return false;
    return key in this._data;
  }

  destroy() {
    this._data = undefined;
    this.res.headers[this.tokenKey] = this.toString();
    super.destroy();
  }

  toString() {
    return this._data
      ? jwt.sign(this._data, this.secretKey, { expiresIn: "8h" })
      : "";
  }
}
