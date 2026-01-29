import { Router } from "express";
import { get } from "../providers/json-storage.provider";

const authRouter = Router(); 


// POST /login 
authRouter.post("/login", (req, res) => {
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

    const userData = get("users");
    let user = null;

    for (const key in userData) {
        if (userData[key].email !== email) {
            continue;
        }

        user = userData[key];
        break;
    }

    if (user === null) {
        res.sendStatus(404);
        return;
    }

    if (user.password !== password) {
        res.sendStatus(401);
        return;
    }

    res.sendStatus(204);
});

export { authRouter as authRoutes }