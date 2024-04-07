import { bootstrap } from "./dist/index.js";
import json from "../server.json" with { type: "json" };

await bootstrap(json["server-user"].port, true, process.argv[2] === "log");
