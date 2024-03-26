import {
  Controller,
  Method,
  ReqBody,
  ReqQuery,
  NotFoundObjectError,
} from "server";
import { COLLECTION_ROLE } from "../constants";
import { CreateRoleDTO, QueryDTO, UpdateRoleDTO } from "../dto";
import { Collection, StoreCollection } from "server-store";

@Controller({ routePrefix: "/role" })
export class RoleController {
  /* 新建Role对象 */
  @Method({ type: "POST" })
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
  @Method({ type: "POST" })
  update(
    @ReqBody() body: UpdateRoleDTO,
    @Collection(COLLECTION_ROLE) collection: StoreCollection<RoleModel>,
  ) {
    return collection.transaction(async () => {
      const role = await collection.getById(body.id);
      if (!role)
        throw new NotFoundObjectError(`找不到id为${body.id}的Role对象`);
      if (body.toDelete) {
        await role.deleteOne();
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

  /**
   * 根据id查找Role对象
   * @throws NotFoundObjectError 当根据id找不到Role对象时抛出
   */
  @Method()
  async findById(
    @ReqQuery() query: QueryDTO,
    @Collection(COLLECTION_ROLE) collection: StoreCollection<RoleModel>,
  ) {
    const role = await collection.getById(query.id);
    if (!role) throw new NotFoundObjectError(`找不到id为${query.id}的Role对象`);
    return role;
  }

  /* 返回数据库中的Role对象数量 */
  @Method()
  async count(
    @Collection(COLLECTION_ROLE) collection: StoreCollection<RoleModel>,
  ) {
    return (await collection.getAll()).length;
  }
}
