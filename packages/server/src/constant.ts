/* 本库所使用的依赖注入模块名 */
export const MODULE_NAME = "server";

/* Web服务器默认的监听端口 */
export const DEFAULT_PORT = 4000;

/* Server对象在容器中的标识。写出来是为了防止在代码中直接引用Server对象，避免可能的依赖循环 */
export const SERVER_LABEL = "Server";
