import { Router } from "express";
import { useRequestId } from "../middleware/use-request-id.middleware";
import { get } from "../providers/json-storage.provider";

const authRouter = Router(); 

// authRouter.use(useRequestId);

// POST /login 
authRouter.post("/login", (req, res) => {
    /*
        {
            "email": "foo@bar.com",
            "password": "abc123"
        }
    */
   console.log("/login");

    console.log(req.body);

    const { email, password } = req.body;

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
        res.sendStatus(421);
        return;
    }

    res.sendStatus(500);

});

export { authRouter as authRoutes }