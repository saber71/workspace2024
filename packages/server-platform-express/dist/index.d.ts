import { Express as Express_2 } from 'express';
import { Request as Request_2 } from 'express';
import { Response as Response_2 } from 'express';
import { ServerPlatformAdapter } from 'server';
import { ServerRequest } from 'server';
import { ServerResponse } from 'server';

export declare function createServerPlatformExpress(): ServerPlatformAdapter<Express_2>;

export declare function createServerRequest(req: Request_2, id: string, secretKey: string): ServerRequest<Request_2>;

export declare function createServerResponse(req: ServerRequest, res: Response_2, id: string, secretKey: string, maxAge?: number | string): ServerResponse<Response_2>;

export { }
