import app from "./server.js";
import { createServer } from "node:http";
import { config } from "./config/env.config.js";
import { createWebSocketServer } from "./providers/ws.provider.js";
import { createLogger } from "./utils/logger.util.js";

if (process.env.NODE_ENV !== "test") {
    const logger = createLogger();
    const server = createServer(app);

    createWebSocketServer(server);

    server.listen(config.server.port, config.server.host, (err) => {
        if (err) {
            throw new Error(err);
        }

        logger.log("Server listening on port:", config.server.port);
        logger.log("Server available at:", `http://${config.server.host}:${config.server.port}/`);
        logger.log("WebSocket endpoint:", `ws://${config.server.host}:${config.server.port}/ws`);
    });
}

export default app;
