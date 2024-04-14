import { default as default_2 } from 'koa';
import { ParameterizedContext } from 'koa';
import { ServerRequest } from 'server';
import { ServerResponse } from 'server';

export declare function createServerPlatformKoa(): ServerPlatformAdapter<default_2>;

export declare function createServerRequest(ctx: default_2.ParameterizedContext, id: string): ServerRequest<default_2.Request>;

export declare function createServerResponse(ctx: ParameterizedContext, id: string): ServerResponse<default_2.Response>;

export { }
