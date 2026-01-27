import { Router } from "express";

const myRouter = Router();

myRouter.use((req, res, next) => {
    console.log("Path requested:", req.url);
    next();
});

myRouter.get("/info", (req, res) => {
    res.sendStatus(204);
});

myRouter.get("/health", (req, res) => {
    res.sendStatus(204);
});

myRouter.get("/docs", (req, res) => {
    res.sendStatus(204);
});

myRouter.get("/", (req, res) => {
    res.sendStatus(204);
});

export { myRouter as usersRoutes }