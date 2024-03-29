import {
  Controller as ControllerDecorator,
  Get,
  Post,
  ReqBody,
  ReqQuery,
} from "server";
import { Collection, StoreCollection } from "server-store";
import { COLLECTION_LOG } from "./constants";
import { CreateLogDTO } from "./dto";

@ControllerDecorator({ routePrefix: "/log" })
export class Controller {
  @Post()
  create(
    @ReqBody() data: CreateLogDTO,
    @Collection(COLLECTION_LOG) collection: StoreCollection<LogModel>,
  ) {
    return collection.transaction(async () => {
      await collection.add({
        ...data,
        createTime: Date.now(),
      });
    });
  }

  @Get()
  find(
    @ReqQuery() condition: FilterCondition<LogModel>,
    @Collection(COLLECTION_LOG) collection: StoreCollection<LogModel>,
  ) {
    return collection.search(condition);
  }
}
