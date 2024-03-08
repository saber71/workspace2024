import type { AxiosInstance } from "axios";
import { SERVER_USER_AXIOS } from "../constants";
import { CreateRoleDTO, UpdateRoleDTO } from "../dto";
import { Injectable } from "server";

@Injectable({ singleton: true, paramtypes: [SERVER_USER_AXIOS] })
export class RoleApiProvider {
  constructor(readonly axios: AxiosInstance) {}

  findById(id: string) {
    return this.axios.get<RegularResponseBody<RoleModel>>("/role/find-by-id", {
      params: { id },
    });
  }

  update(data: UpdateRoleDTO) {
    return this.axios.post<RegularResponseBody>("/role/update", data);
  }

  create(data: CreateRoleDTO) {
    return this.axios.post<RegularResponseBody<string>>("/role/create", data);
  }
}
