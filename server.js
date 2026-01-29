import express, { json } from "express";
import { createLogger } from "./utils/logger";

import { authRoutes } from "./routes/auth.routes";

const app = express();

const PORT = 3000;
const HOST = "127.0.0.1"; // "localhost", "0.0.0.0"

const logger = createLogger();

app.use(json());
// app.use(rootRouter);
app.use("/auth", authRoutes);

// Lytt på port "PORT"
app.listen(PORT, HOST, (err) => {
    if (err) {
        throw new Error(err);
    }

    logger.log("Server listening on port:",PORT);
    logger.log("Server available at:",`http://${HOST}:${PORT}/`);
});
