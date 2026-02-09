import express, { json } from "express";
import { rootRouter } from "./routes/root.routes";

const app = express();

app.use(json());
app.use(rootRouter);


export default app;
