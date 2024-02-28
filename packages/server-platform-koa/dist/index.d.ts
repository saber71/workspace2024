/// <reference types="server/types" />

import Koa from 'koa';
import { ParameterizedContext } from 'koa';
import type { ServerRequest } from 'server';
import type { ServerResponse } from 'server';

export declare function createServerPlatformKoa(): ServerPlatformAdapter<Koa>;

export declare function createServerRequest(ctx: Koa.ParameterizedContext): ServerRequest<Koa.Request>;

export declare function createServerResponse(ctx: ParameterizedContext): ServerResponse<Koa.Response>;

export { }
