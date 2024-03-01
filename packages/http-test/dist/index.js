import axios from 'axios';
import { expect } from 'vitest';

/* 调用axios发起请求，返回准备对Response内容进行测试的对象 */ function httpTest(config) {
    return new ExpectResponse(axios.request(config));
}
/* 对Response内容进行测试的对象 */ class ExpectResponse {
    _res;
    constructor(/* 待接受测试的对象 */ _res){
        this._res = _res;
        this._expectHeaders = [];
        this._toTestBody = false;
    }
    /* 期待的响应头内容 */ _expectHeaders;
    /* 期待的状态码 */ _expectStatus;
    /* 期待的响应体 */ _expectBody;
    /* 是否对响应体进行测试 */ _toTestBody;
    /* 设置期待的响应头 */ expectHeader(key, expectValue) {
        this._expectHeaders.push([
            key,
            expectValue
        ]);
        return this;
    }
    /* 设置期待的状态码 */ expectStatus(code) {
        this._expectStatus = code;
        return this;
    }
    /* 设置期待的响应体 */ expectBody(data) {
        this._expectBody = data;
        this._toTestBody = true;
        return this;
    }
    /* 开始进行测试 */ async done() {
        const res = await this._res;
        for (let item of this._expectHeaders){
            ExpectResponse._toBe(res.headers[item[0].toLowerCase()], item[1]);
        }
        if (typeof this._expectStatus === "number") expect(res.status).toEqual(this._expectStatus);
        if (this._toTestBody) expect(res.data).toEqual(this._expectBody);
    }
    /* 测试字符串是否满足期待 */ static _toBe(value, expectValue) {
        const expectResult = {
            value,
            expectValue,
            test: true
        };
        if (expectValue instanceof RegExp) expect({
            value,
            expectValue,
            test: expectValue.test(value)
        }).toEqual(expectResult);
        else expect({
            value,
            expectValue,
            test: value === expectValue
        }).toEqual(expectResult);
    }
}

export { ExpectResponse, httpTest };
