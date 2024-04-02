import { Validation, Post, ReqBody, Get, ReqQuery, Controller as Controller$1, Server } from 'server';
import { createServerPlatformExpress } from 'server-platform-express';
import { Collection, StoreCollection, ServerStore } from 'server-store';
import { createServerStoreFS } from 'server-store-fs';

const CONTEXT_NAME = "server-log";
const COLLECTION_LOG = "collected-log";

function _ts_decorate$1(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata$1(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
class CreateLogDTO {
    creator;
    description;
    data;
    body;
    query;
    url;
}
_ts_decorate$1([
    Validation({
        validatorType: "isLength",
        arg: {
            min: 1
        }
    }),
    _ts_metadata$1("design:type", String)
], CreateLogDTO.prototype, "creator", void 0);
_ts_decorate$1([
    Validation({
        validatorType: "isString"
    }),
    _ts_metadata$1("design:type", String)
], CreateLogDTO.prototype, "description", void 0);
_ts_decorate$1([
    Validation({
        validatorType: "isString"
    }),
    _ts_metadata$1("design:type", String)
], CreateLogDTO.prototype, "url", void 0);

function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
class Controller {
    create(data, collection) {
        return collection.transaction(async ()=>{
            await collection.add({
                ...data,
                createTime: Date.now()
            });
        });
    }
    find(condition, collection) {
        return collection.search(condition);
    }
}
_ts_decorate([
    Post(),
    _ts_param(0, ReqBody()),
    _ts_param(1, Collection(COLLECTION_LOG)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof CreateLogDTO === "undefined" ? Object : CreateLogDTO,
        typeof StoreCollection === "undefined" ? Object : StoreCollection
    ]),
    _ts_metadata("design:returntype", void 0)
], Controller.prototype, "create", null);
_ts_decorate([
    Get(),
    _ts_param(0, ReqQuery()),
    _ts_param(1, Collection(COLLECTION_LOG)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof FilterCondition === "undefined" ? Object : FilterCondition,
        typeof StoreCollection === "undefined" ? Object : StoreCollection
    ]),
    _ts_metadata("design:returntype", void 0)
], Controller.prototype, "find", null);
Controller = _ts_decorate([
    Controller$1({
        routePrefix: "/log"
    })
], Controller);

async function bootstrap(port, saveOnExit = true) {
    const store = await ServerStore.create(createServerStoreFS("../store", saveOnExit));
    const app = await Server.create({
        serverPlatformAdapter: createServerPlatformExpress(),
        contextName: CONTEXT_NAME
    });
    app.dependencyInjection.bindInstance(store);
    app.bootstrap({
        port
    });
}

export { COLLECTION_LOG, CONTEXT_NAME, Controller, bootstrap };
