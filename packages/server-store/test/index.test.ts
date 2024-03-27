import * as path from "node:path";
import { createServerStoreFS } from "server-store-fs";
import { describe, expect, test } from "vitest";
import { ServerStore } from "../src";

describe("server-store", () => {
  test.concurrent("server-store-fs", async () => {
    const store = await ServerStore.create(
      createServerStoreFS(path.resolve(".", "store"), false),
    );
    const collection = store.collection<User>("user");
    await collection.add(
      {
        name: "user",
        password: "password",
        age: 20,
      },
      {
        name: "user1",
        password: "password",
        age: 200,
      },
    );
    const queryResult = await collection.search({
      name: { $match: /user/ },
      age: { $less: 110 },
    });
    expect(queryResult.length).toEqual(1);
    expect(queryResult[0].age).toEqual(20);
  });
  test.concurrent("server-store-fs transaction add", async () => {
    const store = await ServerStore.create(
      createServerStoreFS(path.resolve(".", "store"), false),
    );
    const collection = store.collection<User>("user");
    await collection
      .transaction(async () => {
        await collection.add(
          {
            name: "user",
            password: "password",
            age: 20,
          },
          {
            name: "user1",
            password: "password",
            age: 200,
          },
        );
        throw new Error();
      })
      .catch((e) => {});
    const allData = await collection.getAll();
    expect(allData.length).toEqual(0);
  });
  test.concurrent("server-store-fs transaction delete", async () => {
    const store = await ServerStore.create(
      createServerStoreFS(path.resolve(".", "store"), false),
    );
    const collection = store.collection<User>("user");
    await collection.add(
      {
        name: "user",
        password: "password",
        age: 20,
      },
      {
        name: "user1",
        password: "password",
        age: 200,
      },
    );
    await collection
      .transaction(async () => {
        const deleted = await collection.delete({ name: "user1" });
        expect(deleted.length).toEqual(1);
        throw new Error();
      })
      .catch((e) => {});
    const allData = await collection.getAll();
    expect(allData.length).toEqual(2);
  });
});

interface User extends StoreItem {
  name: string;
  password: string;
  age: number;
}
