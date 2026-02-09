import jwt from "jsonwebtoken";
import { config } from "../config/env.config";

/**
 *
 * @param {string} user
 * @param {`access`|`refresh`} type
 * @returns
 */
export function generateToken(user, type) {
    const token = jwt.sign({...user}, config.jwt.secret, {
        expiresIn: type === "access" ? config.jwt.expiration.accessToken : config.jwt.expiration.refreshToken,
    });
    return token;
}

export function verifyToken(token) {
    return jwt.verify(token, config.jwt.secret);
}
