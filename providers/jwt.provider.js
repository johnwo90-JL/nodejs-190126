import jwt from "jsonwebtoken";

export function generateToken(user, expiresIn = "3h") {
    console.log(user);
    const token = jwt.sign({...user}, process.env.JWT_SECRET);
    return token;
}

