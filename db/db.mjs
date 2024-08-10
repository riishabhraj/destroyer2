import { spawn } from "child_process";
import { createClient } from "@redis/client";

import logger from "#helpers/logger";
import { toBool } from "#helpers/utils";

import reconnectStrategy from "./reconnectStrategy.mjs";
import pkg from 'dotenv';
const { config } = pkg;

// Load environment variables
config();

const DB_URL = process.env.DB_URL;
const DB_PWD = process.env.DB_PASS;

let client = createClient({
    url: DB_URL,
    password: DB_PWD,
    socket: { reconnectStrategy }
});

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

if (toBool(process.env.AGGRESSIVE_CLEANUP)) {
    await client.sendCommand(["CONFIG", "SET", "notify-keyspace-events", "Ex"]);
}

// if (process.env.NODE_ENV !== "production") {
//     const monitor = spawn(
//         "redis-cli",
//         [
//             DB_URL ? `-u ${DB_URL}` : undefined,
//             DB_PWD ? `-a ${DB_PWD}` : undefined,
//             "monitor"
//         ].filter((el) => !!el)
//     );

//     monitor.stdout.on("data", (data) => {
//         logger.info(`MONITOR: ${data}`);
//     });

//     monitor.stderr.on("data", (data) => {
//         logger.error(`Monitor: ${data}`);
//     });
// }

export default client;
