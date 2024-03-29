import { ServerResponse } from "./response";

const filePath = Symbol("__FilePath__");

/* 将要返回的响应体内容 */
export class ResponseBodyImpl implements ResponseBody {
  /* 从Error对象生成响应体内容 */
  static fromError(error: Error): ResponseBodyImpl {
    return new ResponseBodyImpl(
      {},
      false,
      (error as any).code ?? 500,
      error.message,
    );
  }

  /* 从值生成响应体内容 */
  static from(value: any) {
    if (value instanceof Error) return this.fromError(value);
    else if (value instanceof ResponseBodyImpl) return value;
    return new ResponseBodyImpl(value);
  }

  static fromFilePath(filePath: string): ResponseBodyImpl {
    return this.from({ filePath, [filePath]: true });
  }

  constructor(
    readonly object: any,
    readonly success: boolean = true,
    readonly code: number = 200,
    readonly msg: string = "ok",
  ) {}

  send(res: ServerResponse) {
    res.statusCode = this.code;
    if (this.object?.[filePath]) return res.sendFile(this.object.filePath);
    else return res.body(this);
  }
}
