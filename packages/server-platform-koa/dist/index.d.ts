/// <reference types="server/types" />

import Koa from 'koa';
import { ParameterizedContext } from 'koa';
import type { ServerRequest } from 'server';
import type { ServerResponse } from 'server';

export declare function createServerPlatformKoa(): ServerPlatformAdapter<Koa>;

export declare function createServerRequest(ctx: Koa.ParameterizedContext, id: string): ServerRequest<Koa.Request>;

export declare function createServerResponse(ctx: ParameterizedContext, id: string): ServerResponse<Koa.Response>;

export { }
