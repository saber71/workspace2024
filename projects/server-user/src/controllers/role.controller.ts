import {
  Controller,
  ReqBody,
  ReqQuery,
  NotFoundObjectError,
  Get,
  Post,
  Collection,
  StoreCollection,
  ServerLog,
} from "create-server";
import { COLLECTION_ROLE } from "../constants";
import { CreateRoleDTO, QueryDTO, UpdateRoleDTO } from "../dto";

@Controller({ routePrefix: "/role" })
export class RoleController {
  @ServerLog("新建角色")
  @Post()
  create(
    @ReqBody() body: CreateRoleDTO,
    @Collection(COLLECTION_ROLE) collection: StoreCollection<RoleModel>,
  ) {
    return collection.transaction(async () => {
      return await collection.add({
        name: body.name,
        authorizations: body.authorizations,
        createTime: Date.now(),
      });
    });
  }

  /**
   * 更新Role对象，如果toDelete为true时则删除对象不做其他更新
   * @throws NotFoundObjectError 当根据id找不到Role对象时抛出
   */
  @ServerLog("更新角色")
  @Post()
  update(
    @ReqBody() body: UpdateRoleDTO,
    @Collection(COLLECTION_ROLE) collection: StoreCollection<RoleModel>,
  ) {
    return collection.transaction(async () => {
      const role = await collection.getById(body.id);
      if (!role)
        throw new NotFoundObjectError(`找不到id为${body.id}的Role对象`);
      if (body.toDelete) {
        await collection.delete({ _id: body.id });
        return;
      }
      if (body.putAuthorizations)
        Object.assign(role.authorizations, body.putAuthorizations);
      if (body.name) role.name = body.name;
      if (body.deleteAuthorizations) {
        body.deleteAuthorizations.forEach(
          (key) => delete role.authorizations[key],
        );
      }
      await collection.save(role);
    });
  }

  @ServerLog("查找角色")
  @Get()
  async findById(
    @ReqQuery() query: QueryDTO,
    @Collection(COLLECTION_ROLE) collection: StoreCollection<RoleModel>,
  ) {
    const role = await collection.getById(query.id);
    if (!role) throw new NotFoundObjectError(`找不到id为${query.id}的Role对象`);
    return role;
  }
}
