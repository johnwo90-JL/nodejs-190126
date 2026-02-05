import { Router } from "express";
import { generateToken } from "../providers/jwt.provider";
import { User } from "../models/user.model";

import bcrypt from "bcrypt";
import { useValidate } from "../middleware/use-validate.middleware";
import { GetLogin } from "../schema/auth.schema";

const authRouter = Router(); 


// POST /login 
authRouter.post("/login", useValidate(GetLogin), async (req, res) => {
    /*
        {
            "email": "foo@bar.com",
            "password": "abc123"
        }
    */
    console.log("X-Request-Id", req.headers["X-Request-Id"]);
    console.log("/login");

    console.log(req.body);

    const { email, password } = req.body;

    console.log("E-mail:", email);
    console.log("Password:", password);

    const userData = await User.findOne({
        where: {
            email
        }
    });

    console.log("UserData:",userData);

    if (!bcrypt.compareSync(password, userData.password)) {
        res.sendStatus(401);
        return;
    }

    delete userData.password;

    const accessToken = generateToken(userData.toJSON(), "access");
    const refreshToken = generateToken({ id: userData.id }, "refresh");

    res.json({ accessToken, refreshToken });
});

// POST /refresh - hvis refresh-token er gyldig, generer et nytt sett med access- og refresh-tokens.
// Forventer at `body.refreshToken` er satt.

export { authRouter as authRoutes }