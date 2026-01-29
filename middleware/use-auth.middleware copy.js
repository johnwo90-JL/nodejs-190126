import jwt from "jsonwebtoken";

export const useAuth = (role) => (req, res, next) => {
    try {console.log("User role:", role);
        const token = req.headers["authorization"];
        console.log("token", token);
        const decoded = jwt.decode(token.split(" ")[1]);
        console.log("verify?", jwt.verify(token.split(" ")[1], process.env.JWT_SECRET));

        if (role !== decoded.role) {
            res.sendStatus(403);
            return;
        }

        next();
    } catch (err) {
        res.sendStatus(401);
    }
};