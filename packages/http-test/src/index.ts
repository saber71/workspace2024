import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { expect } from "vitest";
import axiosCookieJarSupport from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

const axiosInstance = axiosCookieJarSupport.wrapper(axios);

const cookieJar = new CookieJar();

/* 调用axios发起请求，返回准备对Response内容进行测试的对象 */
export function httpTest<Data = any>(
  config: AxiosRequestConfig | (() => AxiosRequestConfig),
) {
  if (typeof config === "function") config = config();
  return new ExpectResponse<Data>(
    axiosInstance
      .request({
        baseURL: "http://localhost:4000/",
        withCredentials: true,
        jar: cookieJar,
        validateStatus: () => true,
        ...config,
      })
      .then((res) => ({
        status: res.status,
        headers: res.headers,
        data: res.data,
        href: res.request.path,
      })),
  );
}

/* 对Response内容进行测试的对象 */
export class ExpectResponse<Data> {
  constructor(
    /* 待接受测试的对象 */
    private readonly _res: Response<Data> | Promise<Response<Data>>,
  ) {}

  /* 缓存作为Promise结果的Response对象 */
  private _response: Response<Data>;

  /* 期待的响应头内容 */
  private readonly _expectHeaders: Array<[string, any]> = [];

  /* 期待在响应头中存在的key */
  private readonly _expectHasHeaderKeys: string[] = [];

  /* 期待的状态码 */
  private _expectStatus?: number;

  /* 期待的响应体 */
  private _expectBody?: Data;

  /* 是否对响应体进行测试 */
  private _toTestBody = false;

  private _filterBody?: (data: any) => any;

  /* 设置期待的在响应头中存在的key */
  expectHasHeader(key: keyof AxiosResponse["headers"]) {
    this._expectHasHeaderKeys.push(key as string);
    return this;
  }

  /* 设置期待的响应头 */
  expectHeader(
    key: keyof AxiosResponse["headers"],
    expectValue: string | RegExp,
  ) {
    this._expectHeaders.push([key as string, expectValue]);
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

  /* 设置期待的响应体数据结构中的data字段，数据结构中的其他字段设为成功时的默认值 */
  expectBodyData(data: any) {
    return this.expectBody({
      object: data,
      success: true,
      code: 200,
      msg: "ok",
    } as Data);
  }

  filterBody(cb: (data: any) => any) {
    this._filterBody = cb;
    return this;
  }

  /* 开始进行测试 */
  async done() {
    const res = await this._res;
    this._response = res;
    for (let item of this._expectHeaders) {
      this._toBe(res, res.headers[item[0].toLowerCase()], item[1]);
    }
    for (let key of this._expectHasHeaderKeys) {
      const builder = this._buildHasHeaderKeyObject(key);
      expect(builder(res.headers[key])).toBeTruthy();
    }
    if (typeof this._expectStatus === "number")
      expect(this._buildStatusObject(res.status)).toEqual(
        this._buildStatusObject(this._expectStatus),
      );
    if (this._filterBody) res.data = this._filterBody(res.data);
    if (this._toTestBody)
      expect(this._buildBodyObject(res.data)).toEqual(
        this._buildBodyObject(this._expectBody),
      );
  }

  /* 测试字符串是否满足期待 */
  private _toBe(
    res: Response<Data>,
    value: string,
    expectValue: string | RegExp,
  ) {
    const builder = this._buildToBeObject(value, expectValue);
    if (expectValue instanceof RegExp)
      expect(builder(expectValue.test(value))).toEqual(builder(true));
    else expect(builder(value === expectValue)).toEqual(builder(true));
  }

  /* 构建_toBe方法所需的数据结构 */
  private _buildToBeObject(value: string, expectValue: string | RegExp) {
    return (test: boolean) => ({
      value,
      expectValue,
      test,
      href: this._response.href,
    });
  }

  /* 构建进行状态码测试用的数据结构 */
  private _buildStatusObject(status: number) {
    return { href: this._response.href, status };
  }

  /* 构建进行响应头测试用的数据结构 */
  private _buildBodyObject(body?: Data) {
    return { href: this._response.href, body };
  }

  /* 构建进行响应头是否存在指定key的测试用的数据结构 */
  private _buildHasHeaderKeyObject(key: string) {
    return (test: boolean) => ({
      href: this._response.href,
      headerKey: key,
      test,
    });
  }
}

/* 待测试的Response对象类型 */
interface Response<Data>
  extends Pick<AxiosResponse<Data>, "headers" | "data" | "status"> {
  href: string;
}
