import crypto from "node:crypto";
import { WebSocket, WebSocketServer } from "ws";
import { verifyToken } from "./jwt.provider.js";
import { createLogger } from "../utils/logger.util.js";

const logger = createLogger();

function parseAuthToken(req) {
    try {
        const wsUrl = new URL(req.url || "/ws", `http://${req.headers.host || "localhost"}`);
        const queryToken = wsUrl.searchParams.get("token");

        if (queryToken && queryToken.trim().length > 0) {
            return queryToken.trim();
        }
    } catch (err) {
        logger.warn("Unable to parse websocket URL:", err.message);
    }

    const authHeader = req.headers.authorization;
    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
        const headerToken = authHeader.slice("Bearer ".length).trim();
        return headerToken.length > 0 ? headerToken : null;
    }

    return null;
}

function broadcastMessage(server, payload) {
    const message = JSON.stringify(payload);

    for (const client of server.clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    }
}

export function createWebSocketServer(server) {
    const wsServer = new WebSocketServer({
        server,
        path: "/ws"
    });

    wsServer.on("connection", (socket, req) => {
        const connectionId = crypto.randomUUID();
        const token = parseAuthToken(req);
        let user = null;

        if (token) {
            try {
                user = verifyToken(token);
            } catch (err) {
                socket.send(JSON.stringify({
                    type: "error",
                    message: "Invalid token"
                }));
                socket.close(1008, "Invalid token");
                return;
            }
        }

        socket.send(JSON.stringify({
            type: "connected",
            connectionId,
            authenticated: Boolean(user),
            userId: user?.id || null,
            connectedAt: new Date().toISOString()
        }));

        logger.info("WS client connected:", connectionId);

        socket.on("message", (rawMessage) => {
            const messageText = rawMessage.toString().trim();

            if (!messageText) {
                return;
            }

            broadcastMessage(wsServer, {
                type: "message",
                connectionId,
                userId: user?.id || null,
                text: messageText,
                sentAt: new Date().toISOString()
            });
        });

        socket.on("close", () => {
            logger.info("WS client disconnected:", connectionId);
        });

        socket.on("error", (err) => {
            logger.error("WS socket error:", err.message);
        });
    });

    wsServer.on("error", (err) => {
        logger.error("WS server error:", err.message);
    });

    return wsServer;
}
