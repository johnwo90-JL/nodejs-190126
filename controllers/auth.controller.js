import { User } from "../models/user.model";
import { generateToken, verifyToken } from "../providers/jwt.provider";

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

    const accessToken = generateToken(userData.toJSON(), "access");
    const refreshToken = generateToken({ id: userData.id }, "refresh");

    res.json({ accessToken, refreshToken });
}

export async function refresh(req, res) {
    const { refreshToken } = req.body;

    try {
        const decoded = verifyToken(refreshToken);

        const user = await User.findByPk(decoded.id);

        if (!user) {
            res.sendStatus(401);
            return;
        }

        const accessToken = generateToken(user.toJSON(), "access");
        const newRefreshToken = generateToken({ id: user.id }, "refresh");

        res.json({ accessToken, refreshToken: newRefreshToken });
    } catch (err) {
        res.sendStatus(401);
    }
}
