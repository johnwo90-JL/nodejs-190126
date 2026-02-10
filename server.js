import express, { json } from "express";
import { rootRouter } from "./routes/root.routes";
import rateLimit from "express-rate-limit";
import { rateLimitConfig } from "./config/rate-limiter.config";

const app = express();

app.use(rateLimit(rateLimitConfig));
app.use(json());
app.use(rootRouter);


export default app;
