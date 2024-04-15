import { Session, AfterCallMethod, ServerRequest } from 'server';
import { ServerStore } from 'server-store';

///<reference types="../types.d.ts"/>
const SERVER_LOG_COLLECTION = "server-log-collection";
function ServerLog(description, options = {}) {
    if (!options.creatorGetter) options.creatorGetter = (container)=>container.getValue(Session).get("userId");
    return AfterCallMethod((container, metadata, returnValue, args, error)=>{
        if (error) return returnValue;
        if (container.hasLabel(SERVER_LOG_COLLECTION)) {
            const collectionName = container.getValue(SERVER_LOG_COLLECTION);
            const creator = options.creatorGetter(container);
            const request = container.getValue(ServerRequest);
            const store = container.getValue(ServerStore);
            const collection = store.collection(collectionName);
            collection.add({
                creator,
                description,
                query: request.query,
                body: request.body,
                url: request.url,
                data: typeof options.data === "function" ? options.data(container) : options.data
            });
        }
        return returnValue;
    });
}

export { SERVER_LOG_COLLECTION, ServerLog };
