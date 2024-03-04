import { bootstrap } from "./dist";
import json from "../server.json" with { type: "json" };

await bootstrap(json["server-user"].port);
