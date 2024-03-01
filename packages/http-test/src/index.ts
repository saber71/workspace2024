import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { expect } from "vitest";

/* 调用axios发起请求，返回准备对Response内容进行测试的对象 */
export function httpTest<Data = any>(config: AxiosRequestConfig) {
  return new ExpectResponse<Data>(axios.request(config));
}

/* 对Response内容进行测试的对象 */
export class ExpectResponse<Data> {
  constructor(
    /* 待接受测试的对象 */
    private readonly _res: Response<Data> | Promise<Response<Data>>,
  ) {}

  /* 期待的响应头内容 */
  private readonly _expectHeaders: Array<[string | number, any]> = [];

  /* 期待的状态码 */
  private _expectStatus?: number;

  /* 期待的响应体 */
  private _expectBody?: Data;

  /* 是否对响应体进行测试 */
  private _toTestBody = false;

  /* 设置期待的响应头 */
  expectHeader(
    key: keyof AxiosResponse["headers"],
    expectValue: string | RegExp,
  ) {
    this._expectHeaders.push([key, expectValue]);
    return this;
  }

  /* 设置期待的状态码 */
  expectStatus(code: number) {
    this._expectStatus = code;
    return this;
  }

  /* 设置期待的响应体 */
  expectBody(data: Data) {
    this._expectBody = data;
    this._toTestBody = true;
    return this;
  }

  /* 开始进行测试 */
  async done() {
    const res = await this._res;
    for (let item of this._expectHeaders) {
      ExpectResponse._toBe(res.headers[item[0]], item[1]);
    }
    if (typeof this._expectStatus === "number")
      expect(res.status).toEqual(this._expectStatus);
    if (this._toTestBody) expect(res.data).toEqual(this._expectBody);
  }

  /* 测试字符串是否满足期待 */
  private static _toBe(value: string, expectValue: string | RegExp) {
    if (expectValue instanceof RegExp)
      expect(expectValue.test(value)).toEqual(true);
    else expect(value).toEqual(expectValue);
  }
}

/* 待测试的Response对象类型 */
interface Response<Data>
  extends Pick<AxiosResponse<Data>, "headers" | "data" | "status"> {}
