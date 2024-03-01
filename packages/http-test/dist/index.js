import axios from 'axios';
import { expect } from 'vitest';

/* 调用axios发起请求，返回准备对Response内容进行测试的对象 */ function httpTest(config) {
    return new ExpectResponse(axios.request({
        baseURL: "http://localhost:4000/",
        validateStatus: ()=>true,
        ...config
    }).then((res)=>({
            status: res.status,
            headers: res.headers,
            data: res.data,
            href: res.request.path
        })));
}
/* 对Response内容进行测试的对象 */ class ExpectResponse {
    _res;
    constructor(/* 待接受测试的对象 */ _res){
        this._res = _res;
        this._expectHeaders = [];
        this._expectHasHeaderKeys = [];
        this._toTestBody = false;
    }
    /* 缓存作为Promise结果的Response对象 */ _response;
    /* 期待的响应头内容 */ _expectHeaders;
    /* 期待在响应头中存在的key */ _expectHasHeaderKeys;
    /* 期待的状态码 */ _expectStatus;
    /* 期待的响应体 */ _expectBody;
    /* 是否对响应体进行测试 */ _toTestBody;
    /* 设置期待的在响应头中存在的key */ expectHasHeader(key) {
        this._expectHasHeaderKeys.push(key);
        return this;
    }
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
    /* 设置期待的响应体数据结构中的data字段，数据结构中的其他字段设为成功时的默认值 */ expectBodyData(data) {
        return this.expectBody({
            object: data,
            success: true,
            code: 200,
            msg: "ok"
        });
    }
    /* 开始进行测试 */ async done() {
        const res = await this._res;
        this._response = res;
        for (let item of this._expectHeaders){
            this._toBe(res, res.headers[item[0].toLowerCase()], item[1]);
        }
        for (let key of this._expectHasHeaderKeys){
            const builder = this._buildHasHeaderKeyObject(key);
            expect(builder(res.headers[key])).toBeTruthy();
        }
        if (typeof this._expectStatus === "number") expect(this._buildStatusObject(res.status)).toEqual(this._buildStatusObject(this._expectStatus));
        if (this._toTestBody) expect(this._buildBodyObject(res.data)).toEqual(this._buildBodyObject(this._expectBody));
    }
    /* 测试字符串是否满足期待 */ _toBe(res, value, expectValue) {
        const builder = this._buildToBeObject(value, expectValue);
        if (expectValue instanceof RegExp) expect(builder(expectValue.test(value))).toEqual(builder(true));
        else expect(builder(value === expectValue)).toEqual(builder(true));
    }
    /* 构建_toBe方法所需的数据结构 */ _buildToBeObject(value, expectValue) {
        return (test)=>({
                value,
                expectValue,
                test,
                href: this._response.href
            });
    }
    /* 构建进行状态码测试用的数据结构 */ _buildStatusObject(status) {
        return {
            href: this._response.href,
            status
        };
    }
    /* 构建进行响应头测试用的数据结构 */ _buildBodyObject(body) {
        return {
            href: this._response.href,
            body
        };
    }
    /* 构建进行响应头是否存在指定key的测试用的数据结构 */ _buildHasHeaderKeyObject(key) {
        return (test)=>({
                href: this._response.href,
                headerKey: key,
                test
            });
    }
}

export { ExpectResponse, httpTest };
