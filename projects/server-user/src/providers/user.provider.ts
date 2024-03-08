import type { AxiosInstance } from "axios";
import { Injectable } from "server";
import { SERVER_USER_AXIOS } from "../constants";
import { CreateUserDTO, LoginDTO } from "../dto";

@Injectable({ singleton: true, paramtypes: [SERVER_USER_AXIOS] })
export class UserApiProvider {
  constructor(readonly axios: AxiosInstance) {}

  findById(id: string) {
    return this.axios.get<RegularResponseBody<UserModel>>("/user/find-by-id", {
      params: { id },
    });
  }

  login(data: LoginDTO) {
    return this.axios.post<RegularResponseBody>("/user/login", data);
  }

  create(data: CreateUserDTO) {
    return this.axios.post<RegularResponseBody<string>>("/user/create", data);
  }

  logout() {
    return this.axios.post<RegularResponseBody>("/user/logout");
  }
}
