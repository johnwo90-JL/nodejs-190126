import jwt from "jsonwebtoken";

export const useAuth = (...roles) => (req, res, next) => {
    try {
        console.log("User role:", roles);
        const token = req.headers["authorization"];
        
        const decoded = jwt.decode(token.split(" ")[1]);
        console.log("Decoded:", decoded);
    
        decoded.roles = [ ...decoded.roles, "self" ];
        console.log("verify?", jwt.verify(token.split(" ")[1], process.env.JWT_SECRET));

        if (!decoded.roles.includes(roles[0])) {
            console.log(`!!! Does not have role in "${JSON.stringify(roles)}", comparing against ${roles[0]}`)

            if (!decoded.roles.includes(roles.includes("self") ? "self" : "__restricted__")) {
                console.log(`403: Does not have role in "${JSON.stringify(roles)}", and "self" is not relevant`);
                res.sendStatus(403);
                return;
            }
            
            if (!Object.keys(req.params).includes("id")) {
                console.log(`403: Does not have role in "${JSON.stringify(roles)}", and "self" relevant, but missing "id" in URL`);
                res.sendStatus(403);
                return;
            }

            if (req.params.id !== decoded.id) {
                console.log(`403: Does not have role in "${JSON.stringify(roles)}", and "self" is relevant, but userId mismatch.`);
                res.sendStatus(403);
                return;
            }
        }

        
        next();
    } catch (err) {
        console.log("Error:", err);
        res.sendStatus(401);
    }
};