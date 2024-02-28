/* 本库封装的响应对象，抹除不同框架的响应对象的不同 */
export class ServerResponse<Original extends object = object> {
  /* Web框架的原响应对象 */
  readonly original: Original;

  /* 响应头 */
  readonly headers: import("node:http").OutgoingHttpHeaders;

  /* 更新session内容 */
  session: Record<string, any> | null;

  /* 状态码 */
  statusCode: number;

  /* 发送响应体 */
  body(value?: any): void {}

  /* 发送文件 */
  sendFile(filePath: string): Promise<void> {
    return Promise.resolve();
  }

  /* 重定向 */
  redirect(url: string): void {}
}
