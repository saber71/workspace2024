// import { defineHex, Grid, rectangle } from "honeycomb-grid";
//
// // 1. Create a hex class:
// const Tile = defineHex({ dimensions: 1 });
//
// // 2. Create a grid by passing the class and a "traverser" for a rectangular-shaped grid:
// const grid = new Grid(Tile, rectangle({ width: 3, height: 3 }));
// // 3. Iterate over the grid to log each hex:
// grid.forEach((hex) => {
//   console.log(hex.q, hex.r, hex.row, hex.col, hex.corners);
// });

import path from "node:path";
import { ServerStore } from "./packages/server-store/dist/index.js";
import { createServerStoreFS } from "./packages/server-store-fs/dist/index.js";

const store = await ServerStore.create(
  createServerStoreFS(path.resolve(".", "store"), true),
);
const collection = store.collection("user");
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
