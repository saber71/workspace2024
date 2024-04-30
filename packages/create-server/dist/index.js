import { AuthorizedGuard, Server, WHITE_LIST } from 'server';
export * from 'server';
import { SERVER_LOG_COLLECTION } from 'server-log-decorator';
export * from 'server-log-decorator';
import { ServerStore } from 'server-store';
export * from 'server-store';

async function createServer(option) {
    if (!option.guards) option.guards = [
        AuthorizedGuard
    ];
    const app = await Server.create(option);
    app.dependencyInjection.bindInstance(await ServerStore.create(option.storeAdapter)).bindInstance(option.runtime).bindValue(WHITE_LIST, option.whiteList ?? []);
    if (option.log) {
        app.dependencyInjection.bindValue(SERVER_LOG_COLLECTION, option.log.serverLogCollection);
    }
    app.bootstrap(option.bootstrapOption);
    return app;
}

export { createServer };
