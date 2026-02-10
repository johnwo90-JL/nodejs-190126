import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../index.js";

async function getAuthTokens() {
    return (await request(app).post("/auth/login").send({
        email: "thor@bar.com",
        password: "foobar",
    })).body;
}

let refreshToken = null;

describe("`/auth`-collection", () => {
    beforeAll(async () => {
        const tokens = await getAuthTokens();
        refreshToken = tokens.refreshToken;
    })


    it("should exist (app)", async () => {
        expect(app).toBeDefined();
    });


    it("should NOT create a user, due to bad request", async () => {
        const response = await request(app).post("/auth/login");

        expect(response.status).toBe(400);
        expect(response.body).toEqual({});
    });


    it("POST /auth/refresh - should return 200 with new token pair given a valid refresh token", async () => {
        const response = await request(app)
            .post("/auth/refresh")
            .send({ refreshToken });

        expect(response.status).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
    });


    it("POST /auth/refresh - should return 400 with empty/missing body", async () => {
        const response = await request(app)
            .post("/auth/refresh")
            .send({});

        expect(response.status).toBe(400);
    });


    it("POST /auth/refresh - should return 401 with invalid token string", async () => {
        const response = await request(app)
            .post("/auth/refresh")
            .send({ refreshToken: "invalid-token-string" });

        expect(response.status).toBe(401);
    });


    it("POST /auth/login - should return 401 for non-existent email", async () => {
        const response = await request(app)
            .post("/auth/login")
            .send({ email: "nonexistent@bar.com", password: "foobar" });

        expect(response.status).toBe(401);
    });


    it("POST /auth/logout - should return 204 and invalidate refresh token", async () => {
        const tokens = await getAuthTokens();

        const logoutResponse = await request(app)
            .post("/auth/logout")
            .send({ refreshToken: tokens.refreshToken });

        expect(logoutResponse.status).toBe(204);

        const refreshResponse = await request(app)
            .post("/auth/refresh")
            .send({ refreshToken: tokens.refreshToken });

        expect(refreshResponse.status).toBe(401);
    });


    it("GET /auth/logout - should return 204 and invalidate refresh token", async () => {
        const tokens = await getAuthTokens();

        const logoutResponse = await request(app)
            .get(`/auth/logout?refreshToken=${encodeURIComponent(tokens.refreshToken)}`);

        expect(logoutResponse.status).toBe(204);

        const refreshResponse = await request(app)
            .post("/auth/refresh")
            .send({ refreshToken: tokens.refreshToken });

        expect(refreshResponse.status).toBe(401);
    });
});
