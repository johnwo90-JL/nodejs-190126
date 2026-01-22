import http from "node:http";

const PORT = 3000;
const HOST = "127.0.0.1"; // "localhost", "0.0.0.0"

const server = http.createServer((req, res) => {
    console.log("Request – URL:", req.url);
    console.log("Request – Method:", req.method);
    console.log("Request – Headers:", req.headers);
    console.log("Request – HTTP Version:", req.httpVersion);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
        data: "Hello World!",
    }));
});

server.listen(PORT, () => {
    console.debug(`Server now up and running, bound to host "${HOST}", listening for connections on port ${PORT}`);
});
