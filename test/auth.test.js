import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../index.js";
import { email } from "zod";

async function getAuthToken() {
    return (await request(app).post("/auth/login").send({
        email: "thor@bar.com",
        password: "foobar",
    })).body.accessToken;
}

let accessToken = null;

describe("`/auth`-collection", () => {
    // beforeAll(async () => {
    //     accessToken = await getAuthToken();
    //     accessToken = `Bearer ${accessToken}`;
    // })


    it("should exist (app)", async () => {
        expect(app).toBeDefined();
    });


    it("should NOT create a user, due to bad request", async () => {
        const response = await request(app).post("/auth/login");

        expect(response.status).toBe(400);
        expect(response.body).toEqual({});
    });
});