/// <reference types="server/types" />

import { Express as Express_2 } from 'express';
import { Request as Request_2 } from 'express';
import { Response as Response_2 } from 'express';
import type { ServerRequest } from 'server';
import type { ServerResponse } from 'server';

export declare function createServerPlatformExpress(): ServerPlatformAdapter<Express_2>;

export declare function createServerRequest(req: Request_2): ServerRequest<Request_2>;

export declare function createServerResponse(req: Request_2, res: Response_2): ServerResponse<Response_2>;

export { }
