/* 本库所使用的依赖注入模块名 */
export const MODULE_NAME = "server";

/* Web服务器默认的监听端口 */
export const DEFAULT_PORT = 4000;

/* Server对象在容器中的标识。写出来是为了防止在代码中直接引用Server对象，避免可能的依赖循环 */
export const SERVER_LABEL = "Server";

export const PARAMTYPES_REQUEST = "__server__request";
export const PARAMTYPES_RESPONSE = "__server__response";
export const PARAMTYPES_REQUEST_QUERY = "__server__request_query";
export const PARAMTYPES_REQUEST_BODY = "__server__request_body";
export const PARAMTYPES_SESSION = "__server__request_session";
export const PARAMTYPES_FILE = "__server__request_file";
export const PARAMTYPES_FILES = "__server__request_files";
