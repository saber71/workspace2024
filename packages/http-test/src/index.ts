import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { expect } from "vitest";

export function httpTest(config: AxiosRequestConfig) {
  return new ExpectResponse(axios.request(config));
}

export class ExpectResponse<Data> {
  constructor(
    private readonly _res: Response<Data> | Promise<Response<Data>>,
  ) {}

  private readonly _expectHeaders: Array<[string | number, any]> = [];

  private _expectStatus?: number;

  private _expectBody?: Data;

  private _toTestBody = false;

  expectHeader(
    key: keyof AxiosResponse["headers"],
    expectValue: string | RegExp,
  ) {
    this._expectHeaders.push([key, expectValue]);
    return this;
  }

  expectStatus(code: number) {
    this._expectStatus = code;
    return this;
  }

  expectBody(data: Data) {
    this._expectBody = data;
    this._toTestBody = true;
    return this;
  }

  async done() {
    const res = await this._res;
    for (let item of this._expectHeaders) {
      ExpectResponse._toBe(res.headers[item[0]], item[1]);
    }
    if (typeof this._expectStatus === "number")
      expect(res.status).toEqual(this._expectStatus);
    if (this._toTestBody) expect(res.data).toEqual(this._expectBody);
  }

  private static _toBe(value: string, expectValue: string | RegExp) {
    if (expectValue instanceof RegExp)
      expect(expectValue.test(value)).toEqual(true);
    else expect(value).toEqual(expectValue);
  }
}

interface Response<Data>
  extends Pick<
    import("axios").AxiosResponse<Data>,
    "headers" | "data" | "status"
  > {}
