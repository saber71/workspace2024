import {
  Controller,
  Method,
  ReqBody,
  ReqQuery,
  NotFoundObjectError,
} from "server";
import { CreateRoleDTO, QueryDTO, UpdateRoleDTO } from "../dto";
import { RoleModel } from "../models";

@Controller({ routePrefix: "/role" })
export class RoleController {
  /* 新建Role对象 */
  @Method({ type: "POST" })
  async create(@ReqBody() body: CreateRoleDTO) {
    /* 如果子对象为空是不会被插入到数据库中的，所以这里加一个字段，保证authorizations字段能被保存 */
    body.authorizations._ = true;
    const role = new RoleModel(body);
    await role.save();
    return role.id;
  }

  /**
   * 更新Role对象，如果toDelete为true时则删除对象不做其他更新
   * @throws NotFoundObjectError 当根据id找不到Role对象时抛出
   */
  @Method({ type: "POST" })
  async update(@ReqBody() body: UpdateRoleDTO) {
    const role = await RoleModel.findById(body.id);
    if (!role) throw new NotFoundObjectError(`找不到id为${body.id}的Role对象`);
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
    role.markModified("authorizations");
    await role.save();
  }

  /**
   * 根据id查找Role对象
   * @throws NotFoundObjectError 当根据id找不到Role对象时抛出
   */
  @Method()
  async findById(@ReqQuery() query: QueryDTO) {
    const role = await RoleModel.findById(query.id);
    if (!role) throw new NotFoundObjectError(`找不到id为${query.id}的Role对象`);
    return role.toObject();
  }

  /* 返回数据库中的Role对象数量 */
  @Method()
  async count() {
    return RoleModel.countDocuments();
  }
}
