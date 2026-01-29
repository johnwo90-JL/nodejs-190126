import jwt from "jsonwebtoken";

export function generateToken() {
    const token = jwt.sign({ email: "foo@bar.com", role: "user" }, process.env.JWT_SECRET)
    console.log(`JSONWebToken: "${token}"`);
}

