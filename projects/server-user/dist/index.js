import { model, Schema, connect } from 'mongoose';
import { Validation, Method, ReqBody, ReqQuery, Controller, NotFoundError, Server } from 'server';
import { createServerPlatformKoa } from 'server-platform-koa';

const RoleModel = model("Role", new Schema({
    name: {
        type: String,
        required: true
    },
    authorizations: {
        type: Schema.Types.Mixed,
        required: true
    },
    createTime: {
        type: Number,
        default: Date.now()
    }
}));

model("User", new Schema({
    loginName: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roleId: {
        type: String,
        required: true
    },
    email: String,
    avatar: String,
    userData: {
        type: Object,
        required: true
    }
}));

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
class CreateRoleDTO {
    name;
    authorizations;
}
_ts_decorate([
    Validation("isStringStrict"),
    _ts_metadata("design:type", String)
], CreateRoleDTO.prototype, "name", void 0);
_ts_decorate([
    Validation("isObjectStrict"),
    _ts_metadata("design:type", Object)
], CreateRoleDTO.prototype, "authorizations", void 0);
class UpdateRoleDTO {
    id;
    toDelete;
    name;
    putAuthorizations;
    deleteAuthorizations;
}
_ts_decorate([
    Validation("isStringStrict"),
    _ts_metadata("design:type", String)
], UpdateRoleDTO.prototype, "id", void 0);
_ts_decorate([
    Validation("isBoolean"),
    _ts_metadata("design:type", Boolean)
], UpdateRoleDTO.prototype, "toDelete", void 0);
_ts_decorate([
    Validation("isString"),
    _ts_metadata("design:type", String)
], UpdateRoleDTO.prototype, "name", void 0);
_ts_decorate([
    Validation("isObject"),
    _ts_metadata("design:type", Object)
], UpdateRoleDTO.prototype, "putAuthorizations", void 0);
_ts_decorate([
    Validation("isArray"),
    _ts_metadata("design:type", Array)
], UpdateRoleDTO.prototype, "deleteAuthorizations", void 0);
class RoleController {
    /* 新建Role对象 */ async create(body) {
        /* 如果子对象为空是不会被插入到数据库中的，所以这里加一个字段，保证authorizations字段能被保存 */ body.authorizations._ = true;
        const role = new RoleModel(body);
        await role.save();
        return role.id;
    }
    /**
   * 更新Role对象，如果toDelete为true时则删除对象不做其他更新
   * @throws NotFoundError 当根据id找不到Role对象时抛出
   */ async update(body) {
        const role = await RoleModel.findById(body.id);
        if (!role) throw new NotFoundError(`找不到id为${body.id}的Role对象`);
        if (body.toDelete) {
            await role.deleteOne();
            return;
        }
        if (body.putAuthorizations) Object.assign(role.authorizations, body.putAuthorizations);
        if (body.name) role.name = body.name;
        if (body.deleteAuthorizations) {
            body.deleteAuthorizations.forEach((key)=>delete role.authorizations[key]);
        }
        role.markModified("authorizations");
        await role.save();
    }
    /**
   * 根据id查找Role对象
   * @throws NotFoundError 当根据id找不到Role对象时抛出
   */ async findById(query) {
        const role = await RoleModel.findById(query.id);
        if (!role) throw new NotFoundError(`找不到id为${query.id}的Role对象`);
        return role.toObject();
    }
    /* 返回数据库中的Role对象数量 */ async count() {
        return RoleModel.countDocuments();
    }
}
_ts_decorate([
    Method({
        type: "POST"
    }),
    _ts_param(0, ReqBody()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof CreateRoleDTO === "undefined" ? Object : CreateRoleDTO
    ]),
    _ts_metadata("design:returntype", Promise)
], RoleController.prototype, "create", null);
_ts_decorate([
    Method({
        type: "POST"
    }),
    _ts_param(0, ReqBody()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof UpdateRoleDTO === "undefined" ? Object : UpdateRoleDTO
    ]),
    _ts_metadata("design:returntype", Promise)
], RoleController.prototype, "update", null);
_ts_decorate([
    Method(),
    _ts_param(0, ReqQuery()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], RoleController.prototype, "findById", null);
_ts_decorate([
    Method(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], RoleController.prototype, "count", null);
RoleController = _ts_decorate([
    Controller({
        routePrefix: "/role"
    })
], RoleController);

const CONTEXT_NAME = "server-user";
const MONGODB_URL = "mongodb://localhost:27017";

///<reference types="../types.d.ts"/>
const app = await Server.create({
    serverPlatformAdapter: createServerPlatformKoa(),
    contextName: CONTEXT_NAME
});
await connect(MONGODB_URL, {
    dbName: CONTEXT_NAME
});
app.log("log", `成功连接${MONGODB_URL}`);
await checkAndInitRole();
app.bootstrap({
    port: 4001
});
/* 检查数据库中的Role对象数量，如果数据库为空则新建一个默认角色 */ async function checkAndInitRole() {
    const controller = app.dependencyInjection.getValue(RoleController);
    const count = await controller.count();
    if (count === 0) {
        const roleId = await controller.create({
            name: "默认",
            authorizations: {}
        });
        app.log("log", "新建默认角色成功，id为" + roleId);
    }
}
