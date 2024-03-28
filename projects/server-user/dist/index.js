import { Validation, ToBoolean, ToArray, Injectable, Post, ReqBody, Get, ReqQuery, Controller, NotFoundObjectError, ReqSession, Session, Server, AuthorizedGuard, WHITE_LIST } from 'server';
import { createServerPlatformKoa } from 'server-platform-koa';
import { Collection, StoreCollection, ServerStore } from 'server-store';
import validator from 'validator';
import { createServerStoreFS } from 'server-store-fs';

const CONTEXT_NAME = "server-user";
const COLLECTION_ROLE = "role";
const COLLECTION_USER = "user";

function _ts_decorate$2(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata$2(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
class QueryDTO {
    id;
}
_ts_decorate$2([
    Validation({
        validatorType: "isString"
    }),
    _ts_metadata$2("design:type", String)
], QueryDTO.prototype, "id", void 0);
class CreateRoleDTO {
    name;
    authorizations;
}
_ts_decorate$2([
    Validation({
        validatorType: "isString"
    }),
    _ts_metadata$2("design:type", String)
], CreateRoleDTO.prototype, "name", void 0);
_ts_decorate$2([
    Validation({
        validatorType: "isObject"
    }),
    _ts_metadata$2("design:type", Object)
], CreateRoleDTO.prototype, "authorizations", void 0);
class UpdateRoleDTO {
    id;
    toDelete;
    name;
    putAuthorizations;
    deleteAuthorizations;
}
_ts_decorate$2([
    Validation({
        validatorType: "isString"
    }),
    _ts_metadata$2("design:type", String)
], UpdateRoleDTO.prototype, "id", void 0);
_ts_decorate$2([
    Validation({
        validatorType: "isBoolean",
        allowUndefined: true
    }),
    ToBoolean(),
    _ts_metadata$2("design:type", Boolean)
], UpdateRoleDTO.prototype, "toDelete", void 0);
_ts_decorate$2([
    Validation({
        validatorType: "isString",
        allowUndefined: true
    }),
    _ts_metadata$2("design:type", String)
], UpdateRoleDTO.prototype, "name", void 0);
_ts_decorate$2([
    Validation({
        validatorType: "isObject",
        allowUndefined: true
    }),
    _ts_metadata$2("design:type", Object)
], UpdateRoleDTO.prototype, "putAuthorizations", void 0);
_ts_decorate$2([
    Validation({
        validatorType: "isArray",
        allowUndefined: true
    }),
    ToArray(String),
    _ts_metadata$2("design:type", Array)
], UpdateRoleDTO.prototype, "deleteAuthorizations", void 0);
class CreateUserDTO {
    _id;
    name;
    loginName;
    password;
    roleId;
    email;
    avatar;
    putUserData;
}
_ts_decorate$2([
    Validation({
        validatorType: "isString",
        allowUndefined: true
    }),
    _ts_metadata$2("design:type", Object)
], CreateUserDTO.prototype, "_id", void 0);
_ts_decorate$2([
    Validation({
        validatorType: "isString"
    }),
    _ts_metadata$2("design:type", Object)
], CreateUserDTO.prototype, "name", void 0);
_ts_decorate$2([
    Validation({
        validatorType: "isString"
    }),
    _ts_metadata$2("design:type", Object)
], CreateUserDTO.prototype, "loginName", void 0);
_ts_decorate$2([
    Validation({
        validatorType: "isLength",
        arg: {
            min: 1
        }
    }),
    _ts_metadata$2("design:type", Object)
], CreateUserDTO.prototype, "password", void 0);
_ts_decorate$2([
    Validation({
        validatorType: "isTruthy"
    }),
    Validation({
        validatorType: "isString"
    }),
    _ts_metadata$2("design:type", Object)
], CreateUserDTO.prototype, "roleId", void 0);
_ts_decorate$2([
    Validation({
        validatorType: "isEmail",
        allowUndefined: true
    }),
    _ts_metadata$2("design:type", String)
], CreateUserDTO.prototype, "email", void 0);
_ts_decorate$2([
    Validation({
        validatorType: "isURL",
        allowUndefined: true,
        arg: {
            require_host: false
        }
    }),
    _ts_metadata$2("design:type", String)
], CreateUserDTO.prototype, "avatar", void 0);
_ts_decorate$2([
    Validation({
        validatorType: "isObject",
        allowUndefined: true
    }),
    _ts_metadata$2("design:type", Object)
], CreateUserDTO.prototype, "putUserData", void 0);
class UpdateUserDTO extends CreateUserDTO {
    id;
    deleteUserData;
    toDelete;
}
_ts_decorate$2([
    Validation({
        validatorType: "isString"
    }),
    _ts_metadata$2("design:type", Object)
], UpdateUserDTO.prototype, "id", void 0);
_ts_decorate$2([
    Validation({
        validatorType: "isArray",
        allowUndefined: true
    }),
    ToArray(String),
    _ts_metadata$2("design:type", Array)
], UpdateUserDTO.prototype, "deleteUserData", void 0);
_ts_decorate$2([
    Validation({
        validatorType: "isBoolean",
        allowUndefined: true
    }),
    ToBoolean(),
    _ts_metadata$2("design:type", Boolean)
], UpdateUserDTO.prototype, "toDelete", void 0);
UpdateUserDTO = _ts_decorate$2([
    Injectable({
        overrideParent: false
    })
], UpdateUserDTO);
class LoginDTO {
    loginNameOrEmail;
    password;
}
_ts_decorate$2([
    Validation({
        validatorType: "isString"
    }),
    _ts_metadata$2("design:type", String)
], LoginDTO.prototype, "loginNameOrEmail", void 0);
_ts_decorate$2([
    Validation({
        validatorType: "isString"
    }),
    _ts_metadata$2("design:type", String)
], LoginDTO.prototype, "password", void 0);

function _ts_decorate$1(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata$1(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param$1(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
class RoleController {
    /* 新建Role对象 */ create(body, collection) {
        return collection.transaction(async ()=>{
            return await collection.add({
                name: body.name,
                authorizations: body.authorizations,
                createTime: Date.now()
            });
        });
    }
    /**
   * 更新Role对象，如果toDelete为true时则删除对象不做其他更新
   * @throws NotFoundObjectError 当根据id找不到Role对象时抛出
   */ update(body, collection) {
        return collection.transaction(async ()=>{
            const role = await collection.getById(body.id);
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
            await collection.save(role);
        });
    }
    /**
   * 根据id查找Role对象
   * @throws NotFoundObjectError 当根据id找不到Role对象时抛出
   */ async findById(query, collection) {
        const role = await collection.getById(query.id);
        if (!role) throw new NotFoundObjectError(`找不到id为${query.id}的Role对象`);
        return role;
    }
}
_ts_decorate$1([
    Post(),
    _ts_param$1(0, ReqBody()),
    _ts_param$1(1, Collection(COLLECTION_ROLE)),
    _ts_metadata$1("design:type", Function),
    _ts_metadata$1("design:paramtypes", [
        typeof CreateRoleDTO === "undefined" ? Object : CreateRoleDTO,
        typeof StoreCollection === "undefined" ? Object : StoreCollection
    ]),
    _ts_metadata$1("design:returntype", void 0)
], RoleController.prototype, "create", null);
_ts_decorate$1([
    Post(),
    _ts_param$1(0, ReqBody()),
    _ts_param$1(1, Collection(COLLECTION_ROLE)),
    _ts_metadata$1("design:type", Function),
    _ts_metadata$1("design:paramtypes", [
        typeof UpdateRoleDTO === "undefined" ? Object : UpdateRoleDTO,
        typeof StoreCollection === "undefined" ? Object : StoreCollection
    ]),
    _ts_metadata$1("design:returntype", void 0)
], RoleController.prototype, "update", null);
_ts_decorate$1([
    Get(),
    _ts_param$1(0, ReqQuery()),
    _ts_param$1(1, Collection(COLLECTION_ROLE)),
    _ts_metadata$1("design:type", Function),
    _ts_metadata$1("design:paramtypes", [
        typeof QueryDTO === "undefined" ? Object : QueryDTO,
        typeof StoreCollection === "undefined" ? Object : StoreCollection
    ]),
    _ts_metadata$1("design:returntype", Promise)
], RoleController.prototype, "findById", null);
RoleController = _ts_decorate$1([
    Controller({
        routePrefix: "/role"
    })
], RoleController);

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
class UserController {
    /**
   * 根据id查找User对象
   * @throws NotFoundObjectError 当根据id找不到User对象时抛出
   */ async findById(query, collection) {
        const user = await collection.getById(query.id);
        if (!user) throw new NotFoundObjectError(`找不到id为${query.id}的Role对象`);
        return user;
    }
    /**
   * 新建用户
   * @throws NotFoundObjectError 当找不到roleId对应的Role对象时抛出
   */ create(data, collection, roleCollection) {
        return collection.transaction(async ()=>{
            if (!await roleCollection.getById(data.roleId)) throw new NotFoundObjectError("找不到roleId为" + data.roleId + "的Role对象");
            return await collection.add({
                ...data,
                userData: data.putUserData ?? {},
                createTime: Date.now()
            });
        });
    }
    /**
   * 登陆，设置用户id进session中
   * @throws Error 当找不到用户或密码错误时抛出
   */ login(data, session, collection) {
        return collection.transaction(async ()=>{
            const is_email = validator.isEmail(data.loginNameOrEmail);
            let user;
            if (is_email) {
                user = await collection.searchOne({
                    email: data.loginNameOrEmail,
                    password: data.password
                });
            } else {
                user = await collection.searchOne({
                    loginName: data.loginNameOrEmail,
                    password: data.password
                });
            }
            if (!user) throw new Error("找不到用户或密码错误");
            session.set("userId", user._id);
        });
    }
    /**
   * 退出登陆
   */ async logout(session) {
        session.deleteKey("userId");
    }
}
_ts_decorate([
    Get(),
    _ts_param(0, ReqQuery()),
    _ts_param(1, Collection(COLLECTION_USER)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof QueryDTO === "undefined" ? Object : QueryDTO,
        typeof StoreCollection === "undefined" ? Object : StoreCollection
    ]),
    _ts_metadata("design:returntype", Promise)
], UserController.prototype, "findById", null);
_ts_decorate([
    Post(),
    _ts_param(0, ReqBody()),
    _ts_param(1, Collection(COLLECTION_USER)),
    _ts_param(2, Collection(COLLECTION_ROLE)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof CreateUserDTO === "undefined" ? Object : CreateUserDTO,
        typeof StoreCollection === "undefined" ? Object : StoreCollection,
        typeof StoreCollection === "undefined" ? Object : StoreCollection
    ]),
    _ts_metadata("design:returntype", void 0)
], UserController.prototype, "create", null);
_ts_decorate([
    Post(),
    _ts_param(0, ReqBody()),
    _ts_param(1, ReqSession()),
    _ts_param(2, Collection(COLLECTION_USER)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof LoginDTO === "undefined" ? Object : LoginDTO,
        typeof Session === "undefined" ? Object : Session,
        typeof StoreCollection === "undefined" ? Object : StoreCollection
    ]),
    _ts_metadata("design:returntype", void 0)
], UserController.prototype, "login", null);
_ts_decorate([
    Post(),
    _ts_param(0, ReqSession()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Session === "undefined" ? Object : Session
    ]),
    _ts_metadata("design:returntype", Promise)
], UserController.prototype, "logout", null);
UserController = _ts_decorate([
    Controller({
        routePrefix: "/user"
    })
], UserController);

async function bootstrap(port, saveOnExit = true) {
    const store = await ServerStore.create(createServerStoreFS("./store", saveOnExit));
    const app = await Server.create({
        serverPlatformAdapter: createServerPlatformKoa(),
        contextName: CONTEXT_NAME,
        guards: [
            AuthorizedGuard
        ]
    });
    app.dependencyInjection.bindInstance(store).bindValue(WHITE_LIST, [
        "/user/login"
    ]);
    await createDefaultData(app, store);
    app.bootstrap({
        port,
        session: {
            secretKey: "secretKey"
        }
    });
}
async function createDefaultData(app, store) {
    const roleCollection = store.collection(COLLECTION_ROLE);
    const userCollection = store.collection(COLLECTION_USER);
    const defaultRole = await roleCollection.getById("0");
    const defaultUser = await userCollection.getById("0");
    if (!defaultRole) {
        await roleCollection.add({
            _id: "0",
            name: "默认",
            authorizations: {},
            createTime: Date.now()
        }, roleCollection);
        app.log("log", "新建默认角色成功");
    }
    if (!defaultUser) {
        await userCollection.add({
            _id: "0",
            name: "默认",
            loginName: "default-user",
            password: "123456",
            roleId: "0",
            email: "default-user@example.com",
            userData: {},
            createTime: Date.now()
        });
        app.log("log", "新建默认用户成功");
    }
}

export { COLLECTION_ROLE, COLLECTION_USER, CONTEXT_NAME, CreateRoleDTO, CreateUserDTO, LoginDTO, QueryDTO, UpdateRoleDTO, UpdateUserDTO, bootstrap };
