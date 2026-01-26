// import http from "node:http";

import express, { response } from "express";
import { createLogger } from "./utils/logger";

const app = express();

const PORT = 3000;
const HOST = "127.0.0.1"; // "localhost", "0.0.0.0"

const logger = createLogger();

// .use -> catch-all for metoder, for path "/"
app.use("/", (request, response) => {
    console.log(request.baseUrl);

    response.sendStatus(200); // 200 OK
});

app.listen(PORT, HOST, (err) => {
    if (err) {
        throw new Error(err);
    }

    logger.log()
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
