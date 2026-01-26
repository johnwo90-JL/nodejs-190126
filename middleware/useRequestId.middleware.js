import crypto from "node:crypto";

export const useRequestId = (req, res, next) => {
    req.headers["X-Request-Id"] = crypto.randomUUID();

    next();
};