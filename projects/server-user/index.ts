import { bootstrap } from "./src";
import json from "../server.json" with { type: "json" };

await bootstrap(json["server-user"].port);
