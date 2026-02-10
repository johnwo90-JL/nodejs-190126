import { RefreshToken } from "../models/refreshToken.model";
import { User } from "../models/user.model";
import { generateToken, verifyToken } from "../providers/jwt.provider";
import { createLogger } from "../utils/logger.util";

const logger = createLogger();

function getRefreshTokenFromRequest(req) {
    if (req.body && typeof req.body.refreshToken === "string" && req.body.refreshToken.trim().length > 0) {
        return req.body.refreshToken.trim();
    }

    if (req.query && typeof req.query.refreshToken === "string" && req.query.refreshToken.trim().length > 0) {
        return req.query.refreshToken.trim();
    }

    const authHeader = req.headers.authorization;
    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
        const token = authHeader.slice("Bearer ".length).trim();

        if (token.length > 0) {
            return token;
        }
    }

    return null;
}

export async function login(req, res) {
    const { email, password } = req.body;

    const userData = await User.findOne({
        where: {
            email
        }
    });

    if (!userData) {
        res.sendStatus(401);
        return;
    }

    if (!await userData.comparePassword(password)) {
        res.sendStatus(401);
        return;
    }


    // Find refresh tokens
    const refreshTokens = await RefreshToken.findAll({
            where: {
                UserId: userData.id
            }
        });

    logger.debug(`Refresh tokens for user ${userData.id}:`, refreshTokens);

    for (const token of refreshTokens) {
        logger.debug("Token:",token);
        await token.destroy();
    }

    const accessToken = generateToken(userData.toJSON(), "access");
    const refreshToken = generateToken({ id: userData.id }, "refresh");

    await RefreshToken.create({
        token: refreshToken,
        UserId: userData.id
    });

    res.json({ accessToken, refreshToken });
}

export async function refresh(req, res) {
    const { refreshToken } = req.body;

    try {
        const decoded = verifyToken(refreshToken);

        const user = await User.findByPk(decoded.id);

        if (!user) {
            logger.error("401, user not found");
            res.sendStatus(401);
            return;
        }

        const refreshTokens = await RefreshToken.findAll({
            where: {
                token: refreshToken
            }
        });

        logger.debug(`Refresh tokens for user ${decoded.id}:`, refreshTokens);

        let exists = false;
        for (const token of refreshTokens) {
            logger.debug("Token:",token);
            
            if (!exists) {
                logger.debug("token.token:", token.token);
                logger.debug("refreshToken", refreshToken);
                exists = token.token === refreshToken;
            }
            
            await token.destroy();
        }

        if (!exists) {
            logger.error("401, token not found");
            res.sendStatus(401);
            return;
        }

        const accessToken = generateToken(user.toJSON(), "access");
        const newRefreshToken = generateToken({ id: user.id }, "refresh");

        await RefreshToken.create({
            token: newRefreshToken,
            UserId: user.id
        });

        res.json({ accessToken, refreshToken: newRefreshToken });
    } catch (err) {
        res.sendStatus(401);
    }
}

export async function logout(req, res) {
    const refreshToken = getRefreshTokenFromRequest(req);

    if (!refreshToken) {
        res.sendStatus(204);
        return;
    }

    try {
        await RefreshToken.destroy({
            where: {
                token: refreshToken
            }
        });

        res.sendStatus(204);
    } catch (err) {
        logger.error("Logout failed:", err.message);
        res.sendStatus(500);
    }
}
