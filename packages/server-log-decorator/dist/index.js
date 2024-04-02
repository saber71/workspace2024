import axios from 'axios';
import { Session, AfterCallMethod, ServerRequest } from 'server';

///<reference types="../types.d.ts"/>
const SERVER_LOG_ADDRESS = "server-log-address";
function ServerLog(description, options = {}) {
    if (!options.creatorGetter) options.creatorGetter = (container)=>container.getValue(Session).get("userId");
    return AfterCallMethod((container, metadata, returnValue, args, error)=>{
        if (error) return returnValue;
        if (container.hasLabel(SERVER_LOG_ADDRESS)) {
            const creator = options.creatorGetter(container);
            const request = container.getValue(ServerRequest);
            const serverLogAddress = container.getValue(SERVER_LOG_ADDRESS);
            axios.post(serverLogAddress + "/log/create", {
                creator,
                description,
                query: request.query,
                body: request.body,
                url: request.url,
                data: typeof options.data === "function" ? options.data(container) : options.data
            });
        }
    });
}

export { SERVER_LOG_ADDRESS, ServerLog };
