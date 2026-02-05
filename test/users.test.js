import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../index.js";

async function getAuthToken() {
    return (await request(app).post("/auth/login").send({
        email: "thor@bar.com",
        password: "foobar",
    })).body.accessToken;
}

let accessToken = null;

describe("`/users`-collection", () => {
    beforeAll(async () => {
        accessToken = await getAuthToken();
        accessToken = `Bearer ${accessToken}`;
    })


    it("should exist (app)", async () => {
        expect(app).toBeDefined();
    });


    it("should give 401 if unauthenticated, \"/users\"", async () => {
        const response = await request(app).get("/users");

        expect(response.status).toBe(401);
        expect(response.body).toEqual({});
    });


    it("should give 400 if `id` is not a UUIDv4, \"/users/invalid-uuid\"", async () => {
        const response = await request(app)
            .get("/users/invalid-uuid")
            .set("Authorization", accessToken);
        
        expect(response.status).toBe(400);
        expect(response.body).toEqual({});
    });


    it("should give 200 if `id` is a UUIDv4 and exists in the DB, \"/users/:id\"", async () => {
        const response = await request(app)
            .get("/users/5d7c1c67-5112-4b1a-b9ed-59716b8883e8")
            .set("Authorization", accessToken);
        
        expect(response.status).toBe(200);
        expect(Object.keys(response.body).length).toBeGreaterThan(2);
    });

    
    it("should give 404 if `id` is a UUIDv4 and does *not* exists in the DB, \"/users/:id\"", async () => {
        const response = await request(app)
            .get("/users/5d7c1c67-5112-4b1a-b9ed-59716b8883e9")
            .set("Authorization", accessToken);
        
        expect(response.status).toBe(404);
        expect(response.body).toBeDefined();
    }); 
});