import { Router, static as expressStatic } from "express";
import { useRequestId } from "../middleware/use-request-id.middleware";
import { usersRoutes } from "./users.routes";

const rootRouter = Router(); 

// express.static "binder" mappen til endepunktet
rootRouter.use("/", useRequestId, expressStatic("public"));

// "post" korresponderer til HTTP metoden "POST".
rootRouter.get("/", useRequestId, (req, res) => {
    console.log(req.headers["X-Request-Id"]);
    res.sendStatus(201);
});

// Ta i bruk "usersRoutes" samlingen med endepunkter.
rootRouter.use("/api", usersRoutes); 

// Håndter alle andre forespørsler – Gi 404 satus
rootRouter.use((req, res) => {
    res.status(404).sendFile(path.resolve(process.cwd(), "public", "404.html"));
});

export { rootRouter };