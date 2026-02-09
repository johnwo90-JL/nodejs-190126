import app from "./server.js";
import { config } from "./config/env.config.js";
import { createLogger } from "./utils/logger.util.js";

if (process.env.NODE_ENV !== "test") {
    const logger = createLogger();

    app.listen(config.server.port, config.server.host, (err) => {
        if (err) {
            throw new Error(err);
        }

        logger.log("Server listening on port:", config.server.port);
        logger.log("Server available at:", `http://${config.server.host}:${config.server.port}/`);
    });
}

export default app;
