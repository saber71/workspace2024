import * as fs from "fs";
import { httpTest } from "http-test";
import * as path from "node:path";
import { expect } from "vitest";
import {
  Controller,
  Method,
  ReqBody,
  ReqFile,
  ReqQuery,
  Session,
} from "../../src";
//@ts-ignore
import FormData from "form-data";

@Controller()
export class CommonController {
  @Method()
  setSession(session: Session<any>) {
    session.set("id", 20);
  }

  @Method({ type: "POST" })
  testPost(
    //@ts-ignore
    @ReqBody() body: any,
  ) {
    expect(body.id).toEqual(12);
    expect(body.date).toBeInstanceOf(Date);
    return { ...body, date: typeof body.date };
  }

  @Method({ type: "POST" })
  uploadFile(
    //@ts-ignore
    @ReqFile("file")
    file: ServerFile,
    //@ts-ignore
    @ReqBody()
    body: any,
  ) {
    fs.rmSync(file.filepath);
    return Object.assign(body, {
      fileName: file.originalFilename,
    });
  }

  @Method({ type: "POST" })
  testQueryNoParser(
    //@ts-ignore
    @ReqQuery({ parsers: null }) query: any,
  ) {
    return query;
  }
}

export function commonControllerHttpTestSuits() {
  return Promise.all([
    httpTest({
      method: "GET",
      url: "/set-session",
    })
      .expectHasHeader("set-cookie")
      .done(),
    httpTest({
      method: "POST",
      url: "/test-post",
      data: {
        id: 12,
        name: "Test Post",
        date: new Date(),
      },
    })
      .expectBodyData({
        id: 12,
        name: "Test Post",
        date: "object",
      })
      .done(),
    httpTest(() => {
      const formData = new FormData();
      formData.append("id", 20);
      formData.append(
        "file",
        fs.createReadStream(path.resolve(__dirname, "../../package.json")),
      );
      return {
        method: "POST",
        url: "/upload-file",
        data: formData,
      };
    })
      .expectBodyData({
        id: 20,
        fileName: "package.json",
      })
      .done(),
    httpTest({
      method: "POST",
      url: "/test-query-no-parser",
      params: {
        id: 12,
        name: "Test Post",
      },
    })
      .expectBodyData({
        id: "12",
        name: "Test Post",
      })
      .done(),
  ]);
}
