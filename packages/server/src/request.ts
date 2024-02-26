/* 本库封装的请求对象，抹除不同框架的请求对象的不同 */
export class ServerRequest<Original extends object = object> {
  /* Web框架的原请求对象 */
  readonly original: Original;

  /* 读取session内容 */
  readonly session: Readonly<Record<string, any>> | null;

  /* 请求头 */
  readonly headers: import("node:http").IncomingHttpHeaders;

  /* 请求体内容 */
  readonly body: any;

  /* 上传的文件 */
  readonly files:
    | Record<string, ServerFile | ServerFile[] | undefined>
    | undefined;

  /* Get request URL. */
  readonly url: string;

  /**
   * Get origin of URL.
   */
  readonly origin: string;

  /**
   * Get full request URL.
   */
  readonly href: string;

  /**
   * Get request method.
   */
  readonly method: string;

  /**
   * Get request pathname.
   * Set pathname, retaining the query-string when present.
   */
  readonly path: string;

  /**
   * Get parsed query-string.
   * Set query-string as an object.
   */
  readonly query: import("node:querystring").ParsedUrlQuery;

  /**
   * Get query string.
   */
  readonly querystring: string;

  /**
   * Get the search string. Same as the querystring
   * except it includes the leading ?.
   */
  readonly search: string;

  /**
   * Parse the "Host" header field host
   * and support X-Forwarded-Host when a
   * proxy is enabled.
   */
  readonly host: string;

  /**
   * Parse the "Host" header field hostname
   * and support X-Forwarded-Host when a
   * proxy is enabled.
   */
  readonly hostname: string;

  /**
   * Get WHATWG parsed URL object.
   */
  readonly URL: import("node:url").URL;
}
