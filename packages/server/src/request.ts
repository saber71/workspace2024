import type { URL } from "node:url";
import type { IncomingHttpHeaders } from "node:http";
import type { ParsedUrlQuery } from "node:querystring";

/* 本库封装的请求对象，抹除不同框架的请求对象的不同 */
export class ServerRequest<Original extends object = object> {
  /* Web框架的原请求对象 */
  readonly original: Original;

  /* 本次请求的id */
  readonly id: string;

  /* 读取session内容 */
  readonly session: Readonly<Record<string, any>> | null;

  /* 请求头 */
  readonly headers: IncomingHttpHeaders;

  /* 请求体内容 */
  readonly body: any;

  /* 上传的文件 */
  readonly files:
    | Record<string, ServerFile | ServerFile[] | undefined>
    | undefined;

  /* Get request URL. */
  readonly url: string;

  /* Get origin of URL. */
  readonly origin: string;

  /* Get full request URL. */
  readonly href: string;

  /* Get request method. */
  readonly method: MethodType;

  /* Get request pathname. */
  readonly path: string;

  /* Get parsed query-string. */
  readonly query: ParsedUrlQuery;

  /* Get query string. */
  readonly querystring: string;

  /* Get the search string. Same as the querystring except it includes the leading ?. */
  readonly search: string;

  /* Parse the "Host" header field host and support X-Forwarded-Host when a proxy is enabled. */
  readonly host: string;

  /* Parse the "Host" header field hostname and support X-Forwarded-Host when a proxy is enabled. */
  readonly hostname: string;

  /* Get WHATWG parsed URL object. */
  readonly URL: URL;
}
