
import dotenv from "dotenv";
dotenv.config();

export const config = {
    env: process.env.NODE_ENV || "development",

    server: {
        host: process.env.HOST || "127.0.0.1",
        port: process.env.PORT || 3000,
    },

    database: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        dialect: process.env.DB_DIALECT,
        storage: process.env.DB_STORAGE,
    },

    jwt: {
        secret: process.env.JWT_SECRET,
        expiration: {
            accessToken: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
            refreshToken: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
        }
    },
};