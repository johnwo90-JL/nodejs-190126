// import http from "node:http";

import path from "node:path";
import express from "express";
import { createLogger } from "./utils/logger";
import { useRequestId } from "./middleware/useRequestId.middleware";

const app = express();

const PORT = 3000;
const HOST = "127.0.0.1"; // "localhost", "0.0.0.0"

const logger = createLogger();


// Middleware

const ourMiddleware = (req, res, next) => {
    if (Math.random() < 0.5) {
        res.sendStatus(429);
        return;
    }

    console.log("Middleware triggered!");
    next(); // Ok, kjør på med neste handler!
};

// // NodeJS vs. Browser
// Buffer  // Kun NodeJS
// process // Kun NodeJS
// window  // kun Browser

// .use -> catch-all for metoder, for path "/catch-all"
// app.use("/catch-all",  );

// express.static "binder" mappen til endepunktet
app.use("/", useRequestId, express.static("public"));

// "post" korresponderer til HTTP metoden "POST".
app.get("/", useRequestId, (req, res) => {
    console.log(req.headers["X-Request-Id"]);
    res.sendStatus(201);
});


// Håndter alle andre forespørsler – Gi 404 satus
app.use((req, res) => {
    res.status(404).sendFile(path.resolve(process.cwd(), "public", "404.html"));
});


// Lytt på port "PORT"
app.listen(PORT, HOST, (err) => {
    if (err) {
        throw new Error(err);
    }

    logger.log("Server listening on port:",PORT);
    logger.log("Server available at:",`http://${HOST}:${PORT}/`);
});

// `${protocol}://${ip}:${port}/${path}`
// app.use("/") -> http://localhost:3000/



// const server = http.createServer((req, res) => {
//     console.log("Request – URL:", req.url);
//     console.log("Request – Method:", req.method);
//     console.log("Request – Headers:", req.headers);
//     console.log("Request – HTTP Version:", req.httpVersion);

//     res.writeHead(200, { "Content-Type": "application/json" });
//     res.end(JSON.stringify({
//         data: "Hello World!",
//     }));
// });

// server.listen(PORT, () => {
//     console.debug(`Server now up and running, bound to host "${HOST}", listening for connections on port ${PORT}`);
// });
