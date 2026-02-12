import jwt from "jsonwebtoken";
import { createLogger } from "../utils/logger.util";

const logger = createLogger();

export const useAuth = (...roles) => (req, res, next) => {
    try {
        const token = req.headers["authorization"] ?? null;
        
        //TODO: Add tests for `token`.
        if (
            token === null || (typeof token === "string" && !token.startsWith("Bearer "))
        ) {
            logger.error("No valid token in header.");
            res.sendStatus(400);
            return;
        }

        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

        decoded.roles = [ ...decoded.roles, "self" ];

        if (!decoded.roles.includes(roles[0])) {
            if (!decoded.roles.includes(roles.includes("self") ? "self" : "__restricted__")) {
                res.sendStatus(403);
                return;
            }

            if (!Object.keys(req.params).includes("id")) {
                res.sendStatus(403);
                return;
            }

            if (req.params.id !== decoded.id) {
                res.sendStatus(403);
                return;
            }
        }


        next();
    } catch (err) {
        logger.error("Auth error:", err.message);
        res.sendStatus(401);
    }
};
