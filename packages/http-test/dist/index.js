import axios from 'axios';
import { expect } from 'vitest';

function httpTest(config) {
    return new ExpectResponse(axios.request(config));
}
class ExpectResponse {
    _res;
    constructor(_res){
        this._res = _res;
        this._expectHeaders = [];
        this._toTestBody = false;
    }
    _expectHeaders;
    _expectStatus;
    _expectBody;
    _toTestBody;
    expectHeader(key, expectValue) {
        this._expectHeaders.push([
            key,
            expectValue
        ]);
        return this;
    }
    expectStatus(code) {
        this._expectStatus = code;
        return this;
    }
    expectBody(data) {
        this._expectBody = data;
        this._toTestBody = true;
        return this;
    }
    async done() {
        const res = await this._res;
        for (let item of this._expectHeaders){
            ExpectResponse._toBe(res.headers[item[0]], item[1]);
        }
        if (typeof this._expectStatus === "number") expect(res.status).toEqual(this._expectStatus);
        if (this._toTestBody) expect(res.data).toEqual(this._expectBody);
    }
    static _toBe(value, expectValue) {
        if (expectValue instanceof RegExp) expect(expectValue.test(value)).toEqual(true);
        else expect(value).toEqual(expectValue);
    }
}

export { ExpectResponse, httpTest };
