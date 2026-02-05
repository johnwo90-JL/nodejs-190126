import { ZodSchema } from "zod/v3";
import { createLogger } from "../utils/logger";

const logger = createLogger();

/**
 * @param {ZodSchema} schema
 */
export const useValidate = (schema) => (req, res, next) => {
    try {
        schema.parse(req);
        next();
    } catch (err) {
        logger.error(err);
        res.sendStatus(err.message ? 400 : 500);
    }
};