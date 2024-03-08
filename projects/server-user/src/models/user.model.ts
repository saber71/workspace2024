import { model, Schema } from "mongoose";

export const UserModel = model(
  "User",
  new Schema<UserModel>({
    loginName: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    roleId: { type: String, required: true },
    email: String,
    avatar: String,
    userData: { type: Object, required: true },
    createTime: { type: Number, default: Date.now() },
  }),
);
