import { DeveloperError } from "./common";
import { ServerRequest } from "./request";
import { ServerResponse } from "./response";

export class Session<T extends object> {
  constructor(
    readonly req: ServerRequest,
    readonly res: ServerResponse,
  ) {}

  set<Key extends keyof T>(key: Key, value: T[Key]) {
    if (!this.res.session) this.res.session = {};
    (this.res.session as any)[key] = value;
    return this;
  }

  get<Key extends keyof T>(key: Key): T[Key] | undefined {
    return (this.req.session as any)?.[key];
  }

  fetch<Key extends keyof T>(key: Key): T[Key] {
    if (!this.has(key)) throw new SessionKeyNotExistError();
    return (this.req.session as any)[key];
  }

  has<Key extends keyof T>(key: Key) {
    if (!this.req.session) return false;
    return key in this.req.session;
  }

  destroy() {
    this.res.session = null;
  }
}

export class SessionKeyNotExistError extends DeveloperError {}
