import { describe, expect, test } from "vitest";
import { PathBuilder } from "../src";

describe("PathBuilder", () => {
  describe("addPoints", () => {
    describe("no roundCorner", () => {
      test("no close", () => {
        const builder = new PathBuilder().addPoints([
          [0, 0],
          [10, 10],
          [5, 5],
        ]);
        expect(builder.toString()).toEqual("M0,0L10,10L5,5");
      });
      test("close", () => {
        const builder = new PathBuilder().addPoints(
          [
            [0, 0],
            [10, 10],
            [5, 5],
          ],
          { close: true },
        );
        expect(builder.toString()).toEqual("M0,0L10,10L5,5Z");
      });
    });
    describe("roundCorner", () => {
      test("no close", () => {
        const builder = new PathBuilder().addPoints(
          [
            [0, 0],
            [10, 0],
            [15, 0],
          ],
          { cornerRadius: 1 },
        );
        expect(builder.toString()).toEqual("M0,0L9,0Q10,0,11,0L15,0");
      });
      test("close", () => {
        const builder = new PathBuilder().addPoints(
          [
            [0, 0],
            [10, 0],
            [5, 5],
          ],
          { close: true, cornerRadius: 1 },
        );
        expect(builder.toString()).toEqual(
          "M0.7071067690849304,0.7071067690849304Q0,0,1,0L9,0Q10,0,9.29289323091507,0.7071067690849304L5.70710676908493,4.29289323091507Q5,5,4.29289323091507,4.29289323091507Z",
        );
      });
    });
  });
});
