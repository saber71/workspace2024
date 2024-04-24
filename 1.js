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

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "2-digit",
});
const timeFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
});
console.log(
  dateFormatter.format(),
  timeFormatter.format(),
  new Date().getDay(),
);
