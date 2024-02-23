import { IndexDBTable } from "indexdb-table";
import { describe, expect, test } from "vitest";
import { VueClass } from "vue-class";
import { IndexDBService } from "../src/services/indexDB.service";

const indexdbService = VueClass.getInstance(IndexDBService);

describe("IndexDBService", () => {
  test("enableInitial", () => {
    expect(indexdbService.user instanceof IndexDBTable).toEqual(true);
    expect(indexdbService.user.table?.name === "user").toEqual(true);
  });
});
