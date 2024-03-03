import { model, Schema } from "mongoose";

export const RoleModel = model(
  "Role",
  new Schema<RoleModel>({
    name: { type: String, required: true },
    authorizations: { type: Schema.Types.Mixed, required: true },
    createTime: { type: Number, default: Date.now() },
  }),
);
