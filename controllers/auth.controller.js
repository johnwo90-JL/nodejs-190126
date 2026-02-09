import { RefreshToken } from "../models/refreshToken.model";
import { User } from "../models/user.model";
import { generateToken, verifyToken } from "../providers/jwt.provider";
import { createLogger } from "../utils/logger.util";

const logger = createLogger();

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
