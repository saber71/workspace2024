import { Metadata } from "dependency-injection";
import { describe, expect, test } from "vitest";
import { RequestPipeline } from "../src";

describe("Pipeline", () => {
  test("metadata", () => {
    const metadata = Metadata.getOrCreateMetadata(RequestPipeline);
    const constructorParameters = metadata.getMethodParameterTypes();
    expect(constructorParameters.types).toEqual([
      "Server",
      "ServerRequest",
      "ServerResponse",
    ]);
  });
});
