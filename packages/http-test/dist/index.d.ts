import { AxiosRequestConfig } from 'axios';
import { AxiosResponse } from 'axios';

export declare class ExpectResponse<Data> {
    private readonly _res;
    constructor(_res: Response_2<Data> | Promise<Response_2<Data>>);
    private readonly _expectHeaders;
    private _expectStatus?;
    private _expectBody?;
    private _toTestBody;
    expectHeader(key: keyof AxiosResponse["headers"], expectValue: string | RegExp): this;
    expectStatus(code: number): this;
    expectBody(data: Data): this;
    done(): Promise<void>;
    private static _toBe;
}

export declare function httpTest<Data = any>(config: AxiosRequestConfig): ExpectResponse<Data>;

declare interface Response_2<Data> extends Pick<AxiosResponse<Data>, "headers" | "data" | "status"> {
}

export { }
