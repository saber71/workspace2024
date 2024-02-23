import { IoC } from "ioc";

export type Services =
  | "CommonService"
  | "IndexDBService"
  | "UserService"
  | "KeyValueService";

export function InjectService<Label extends Services>(label: Label) {
  return IoC.Inject(label);
}
