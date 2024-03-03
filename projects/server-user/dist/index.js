import { Server } from 'server';
import { createServerPlatformKoa } from 'server-platform-koa';

///<reference types="../types.d.ts"/>
const app = await Server.create({
    serverPlatformAdapter: createServerPlatformKoa()
});
app.bootstrap({
    port: 4001
});
