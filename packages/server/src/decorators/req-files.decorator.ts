import { type Container, Inject } from "dependency-injection";
import { ImproperDecoratorError, NotFoundFileError } from "../errors";
import { ServerRequest } from "../request";

/* 属性/参数装饰器。为被装饰者注入指定字段的上传的多个文件对象 */
export function ReqFiles(fieldName: string) {
  return Inject({
    typeValueGetter: (container: Container) => {
      const request = container.getValue(ServerRequest);
      if (!request.files) throw new NotFoundFileError("未找到上传文件");
      const files = request.files[fieldName];
      if (!files) throw new NotFoundFileError(`字段${fieldName}的文件不存在`);
      if (files instanceof Array) return files;
      throw new ImproperDecoratorError(
        "指定字段的文件只有一个，请使用ReqFile装饰器",
      );
    },
    afterExecute: (metadata, ...args) =>
      (metadata.userData[args.join(".")] = {
        isFiles: fieldName,
      }),
  });
}
