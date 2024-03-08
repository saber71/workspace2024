import { model, Schema, connect } from 'mongoose';
import { Validation, Method, ReqBody, ReqQuery, Controller, NotFoundObjectError, Session, Injectable, Server, AuthorizedGuard, WHITE_LIST } from 'server';
import { createServerPlatformKoa } from 'server-platform-koa';
import { isEmail } from 'validator';

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

const UserModel = model("User", new Schema({
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
    },
    createTime: {
        type: Number,
        default: Date.now()
    }
}));

function _ts_decorate$4(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata$4(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
class QueryDTO {
    id;
}
_ts_decorate$4([
    Validation({
        validatorType: "isString"
    }),
    _ts_metadata$4("design:type", String)
], QueryDTO.prototype, "id", void 0);
class CreateRoleDTO {
    name;
    authorizations;
}
_ts_decorate$4([
    Validation({
        validatorType: "isString"
    }),
    _ts_metadata$4("design:type", String)
], CreateRoleDTO.prototype, "name", void 0);
_ts_decorate$4([
    Validation({
        validatorType: "isObject"
    }),
    _ts_metadata$4("design:type", Object)
], CreateRoleDTO.prototype, "authorizations", void 0);
class UpdateRoleDTO {
    id;
    toDelete;
    name;
    putAuthorizations;
    deleteAuthorizations;
}
_ts_decorate$4([
    Validation({
        validatorType: "isString"
    }),
    _ts_metadata$4("design:type", String)
], UpdateRoleDTO.prototype, "id", void 0);
_ts_decorate$4([
    Validation({
        validatorType: "isBoolean",
        allowUndefined: true
    }),
    _ts_metadata$4("design:type", Boolean)
], UpdateRoleDTO.prototype, "toDelete", void 0);
_ts_decorate$4([
    Validation({
        validatorType: "isString",
        allowUndefined: true
    }),
    _ts_metadata$4("design:type", String)
], UpdateRoleDTO.prototype, "name", void 0);
_ts_decorate$4([
    Validation({
        validatorType: "isObject",
        allowUndefined: true
    }),
    _ts_metadata$4("design:type", Object)
], UpdateRoleDTO.prototype, "putAuthorizations", void 0);
_ts_decorate$4([
    Validation({
        validatorType: "isArray",
        allowUndefined: true
    }),
    _ts_metadata$4("design:type", Array)
], UpdateRoleDTO.prototype, "deleteAuthorizations", void 0);
class CreateUserDTO {
    name;
    loginName;
    password;
    roleId;
    email;
    avatar;
    putUserData;
}
_ts_decorate$4([
    Validation({
        validatorType: "isString"
    }),
    _ts_metadata$4("design:type", Object)
], CreateUserDTO.prototype, "name", void 0);
_ts_decorate$4([
    Validation({
        validatorType: "isString"
    }),
    _ts_metadata$4("design:type", Object)
], CreateUserDTO.prototype, "loginName", void 0);
_ts_decorate$4([
    Validation({
        validatorType: "isLength",
        arg: {
            min: 1
        }
    }),
    _ts_metadata$4("design:type", Object)
], CreateUserDTO.prototype, "password", void 0);
_ts_decorate$4([
    Validation({
        validatorType: "isTruthy"
    }),
    Validation({
        validatorType: "isString"
    }),
    _ts_metadata$4("design:type", Object)
], CreateUserDTO.prototype, "roleId", void 0);
_ts_decorate$4([
    Validation({
        validatorType: "isEmail",
        allowUndefined: true
    }),
    _ts_metadata$4("design:type", String)
], CreateUserDTO.prototype, "email", void 0);
_ts_decorate$4([
    Validation({
        validatorType: "isURL",
        allowUndefined: true,
        arg: {
            require_host: false
        }
    }),
    _ts_metadata$4("design:type", String)
], CreateUserDTO.prototype, "avatar", void 0);
_ts_decorate$4([
    Validation({
        validatorType: "isObject",
        allowUndefined: true
    }),
    _ts_metadata$4("design:type", Object)
], CreateUserDTO.prototype, "putUserData", void 0);
class UpdateUserDTO extends CreateUserDTO {
    id;
    deleteUserData;
    toDelete;
}
_ts_decorate$4([
    Validation({
        validatorType: "isString"
    }),
    _ts_metadata$4("design:type", Object)
], UpdateUserDTO.prototype, "id", void 0);
_ts_decorate$4([
    Validation({
        validatorType: "isArray",
        allowUndefined: true
    }),
    _ts_metadata$4("design:type", Array)
], UpdateUserDTO.prototype, "deleteUserData", void 0);
_ts_decorate$4([
    Validation({
        validatorType: "isBoolean",
        allowUndefined: true
    }),
    _ts_metadata$4("design:type", Boolean)
], UpdateUserDTO.prototype, "toDelete", void 0);
class LoginDTO {
    loginNameOrEmail;
    password;
}
_ts_decorate$4([
    Validation({
        validatorType: "isString"
    }),
    _ts_metadata$4("design:type", String)
], LoginDTO.prototype, "loginNameOrEmail", void 0);
_ts_decorate$4([
    Validation({
        validatorType: "isString"
    }),
    _ts_metadata$4("design:type", String)
], LoginDTO.prototype, "password", void 0);

function _ts_decorate$3(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata$3(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param$1(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
class RoleController {
    /* 新建Role对象 */ async create(body) {
        /* 如果子对象为空是不会被插入到数据库中的，所以这里加一个字段，保证authorizations字段能被保存 */ body.authorizations._ = true;
        const role = new RoleModel(body);
        await role.save();
        return role.id;
    }
    /**
   * 更新Role对象，如果toDelete为true时则删除对象不做其他更新
   * @throws NotFoundObjectError 当根据id找不到Role对象时抛出
   */ async update(body) {
        const role = await RoleModel.findById(body.id);
        if (!role) throw new NotFoundObjectError(`找不到id为${body.id}的Role对象`);
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
   * @throws NotFoundObjectError 当根据id找不到Role对象时抛出
   */ async findById(query) {
        const role = await RoleModel.findById(query.id);
        if (!role) throw new NotFoundObjectError(`找不到id为${query.id}的Role对象`);
        return role.toObject();
    }
    /* 返回数据库中的Role对象数量 */ async count() {
        return RoleModel.countDocuments();
    }
}
_ts_decorate$3([
    Method({
        type: "POST"
    }),
    _ts_param$1(0, ReqBody()),
    _ts_metadata$3("design:type", Function),
    _ts_metadata$3("design:paramtypes", [
        typeof CreateRoleDTO === "undefined" ? Object : CreateRoleDTO
    ]),
    _ts_metadata$3("design:returntype", Promise)
], RoleController.prototype, "create", null);
_ts_decorate$3([
    Method({
        type: "POST"
    }),
    _ts_param$1(0, ReqBody()),
    _ts_metadata$3("design:type", Function),
    _ts_metadata$3("design:paramtypes", [
        typeof UpdateRoleDTO === "undefined" ? Object : UpdateRoleDTO
    ]),
    _ts_metadata$3("design:returntype", Promise)
], RoleController.prototype, "update", null);
_ts_decorate$3([
    Method(),
    _ts_param$1(0, ReqQuery()),
    _ts_metadata$3("design:type", Function),
    _ts_metadata$3("design:paramtypes", [
        typeof QueryDTO === "undefined" ? Object : QueryDTO
    ]),
    _ts_metadata$3("design:returntype", Promise)
], RoleController.prototype, "findById", null);
_ts_decorate$3([
    Method(),
    _ts_metadata$3("design:type", Function),
    _ts_metadata$3("design:paramtypes", []),
    _ts_metadata$3("design:returntype", Promise)
], RoleController.prototype, "count", null);
RoleController = _ts_decorate$3([
    Controller({
        routePrefix: "/role"
    })
], RoleController);

function _ts_decorate$2(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata$2(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
class UserController {
    /**
   * 根据id查找User对象
   * @throws NotFoundObjectError 当根据id找不到User对象时抛出
   */ async findById(query) {
        const user = await UserModel.findById(query.id);
        if (!user) throw new NotFoundObjectError(`找不到id为${query.id}的Role对象`);
        return user.toObject();
    }
    /**
   * 新建用户
   * @throws NotFoundObjectError 当找不到roleId对应的Role对象时抛出
   */ async create(data) {
        if (!RoleModel.exists({
            _id: data.roleId
        })) throw new NotFoundObjectError("找不到roleId为" + data.roleId + "的Role对象");
        const userData = data.putUserData ?? {};
        userData._ = true;
        const user = new UserModel({
            ...data,
            userData
        });
        await user.save();
        return user.id;
    }
    /**
   * 登陆，设置用户id进session中
   * @throws Error 当找不到用户或密码错误时抛出
   */ async login(data, session) {
        const is_email = isEmail(data.loginNameOrEmail);
        let user;
        if (is_email) {
            user = await UserModel.findOne({
                email: data.loginNameOrEmail,
                password: data.password
            });
        } else {
            user = await UserModel.findOne({
                loginName: data.loginNameOrEmail,
                password: data.password
            });
        }
        if (!user) throw new Error("找不到用户或密码错误");
        session.set("userId", user.id);
    }
    /**
   * 退出登陆
   */ async logout(session) {
        session.deleteKey("userId");
    }
}
_ts_decorate$2([
    Method(),
    _ts_param(0, ReqQuery()),
    _ts_metadata$2("design:type", Function),
    _ts_metadata$2("design:paramtypes", [
        typeof QueryDTO === "undefined" ? Object : QueryDTO
    ]),
    _ts_metadata$2("design:returntype", Promise)
], UserController.prototype, "findById", null);
_ts_decorate$2([
    Method({
        type: "POST"
    }),
    _ts_metadata$2("design:type", Function),
    _ts_metadata$2("design:paramtypes", [
        typeof CreateUserDTO === "undefined" ? Object : CreateUserDTO
    ]),
    _ts_metadata$2("design:returntype", Promise)
], UserController.prototype, "create", null);
_ts_decorate$2([
    Method({
        type: "POST"
    }),
    _ts_metadata$2("design:type", Function),
    _ts_metadata$2("design:paramtypes", [
        typeof LoginDTO === "undefined" ? Object : LoginDTO,
        typeof Session === "undefined" ? Object : Session
    ]),
    _ts_metadata$2("design:returntype", Promise)
], UserController.prototype, "login", null);
_ts_decorate$2([
    Method({
        type: "POST"
    }),
    _ts_metadata$2("design:type", Function),
    _ts_metadata$2("design:paramtypes", [
        typeof Session === "undefined" ? Object : Session
    ]),
    _ts_metadata$2("design:returntype", Promise)
], UserController.prototype, "logout", null);
UserController = _ts_decorate$2([
    Controller({
        routePrefix: "/user"
    })
], UserController);

const CONTEXT_NAME = "server-user";
const MONGODB_URL = "mongodb://localhost:27017";
const SERVER_USER_AXIOS = "server-user-axios";

function _ts_decorate$1(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata$1(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
class RoleApiProvider {
    axios;
    constructor(axios){
        this.axios = axios;
    }
    findById(id) {
        return this.axios.get("/role/find-by-id", {
            params: {
                id
            }
        });
    }
    update(data) {
        return this.axios.post("/role/update", data);
    }
    create(data) {
        return this.axios.post("/role/create", data);
    }
}
RoleApiProvider = _ts_decorate$1([
    Injectable({
        singleton: true,
        paramtypes: [
            SERVER_USER_AXIOS
        ]
    }),
    _ts_metadata$1("design:type", Function),
    _ts_metadata$1("design:paramtypes", [
        typeof AxiosInstance === "undefined" ? Object : AxiosInstance
    ])
], RoleApiProvider);

function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
class UserProvider {
    axios;
    constructor(axios){
        this.axios = axios;
    }
    findById(id) {
        return this.axios.get("/user/find-by-id", {
            params: {
                id
            }
        });
    }
    login(data) {
        return this.axios.post("/user/login", data);
    }
    create(data) {
        return this.axios.post("/user/create", data);
    }
    logout() {
        return this.axios.post("/user/logout");
    }
}
UserProvider = _ts_decorate([
    Injectable({
        singleton: true,
        paramtypes: [
            SERVER_USER_AXIOS
        ]
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AxiosInstance === "undefined" ? Object : AxiosInstance
    ])
], UserProvider);

async function bootstrap(port) {
    const app = await Server.create({
        serverPlatformAdapter: createServerPlatformKoa(),
        contextName: CONTEXT_NAME,
        guards: [
            AuthorizedGuard
        ]
    });
    app.dependencyInjection.bindValue(WHITE_LIST, [
        "/user/login"
    ]);
    await connect(MONGODB_URL, {
        dbName: CONTEXT_NAME
    });
    app.log("log", `成功连接${MONGODB_URL}`);
    await checkAndInitRole(app);
    app.bootstrap({
        port
    });
}
/* 检查数据库中的Role对象数量，如果数据库为空则新建一个默认角色 */ async function checkAndInitRole(app) {
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

export { CreateRoleDTO, CreateUserDTO, LoginDTO, QueryDTO, RoleApiProvider, UpdateRoleDTO, UpdateUserDTO, UserProvider, bootstrap };
