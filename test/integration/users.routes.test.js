import { describe, it, expect, beforeAll } from "vitest";
import crypto from "node:crypto";
import request from "supertest";
import app from "../../index.js";

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
        const usersRes = await request(app)
            .get("/users")
            .set("Authorization", accessToken);
        const userId = usersRes.body[0].id;

        const response = await request(app)
            .get(`/users/${userId}`)
            .set("Authorization", accessToken);

        expect(response.status).toBe(200);
        expect(Object.keys(response.body).length).toBeGreaterThan(2);
    });


    it("should give 404 if `id` is a UUIDv4 and does *not* exists in the DB, \"/users/:id\"", async () => {
        const response = await request(app)
            .get("/users/00000000-0000-4000-a000-000000000000")
            .set("Authorization", accessToken);

        expect(response.status).toBe(404);
        expect(response.body).toBeDefined();
    });


    it("PATCH /:id - should return 200 with updated data on valid request", async () => {
        const usersRes = await request(app)
            .get("/users")
            .set("Authorization", accessToken);
        const userId = usersRes.body[0].id;

        const response = await request(app)
            .patch(`/users/${userId}`)
            .set("Authorization", accessToken)
            .send({ name: "UpdatedName" });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("UpdatedName");
    });


    it("PATCH /:id - should return 404 for non-existent valid UUID", async () => {
        const response = await request(app)
            .patch("/users/00000000-0000-4000-a000-000000000000")
            .set("Authorization", accessToken)
            .send({ name: "Ghost" });

        expect(response.status).toBe(404);
    });


    it("PATCH /:id - should return 400 for invalid UUID", async () => {
        const response = await request(app)
            .patch("/users/not-a-uuid")
            .set("Authorization", accessToken)
            .send({ name: "Bad" });

        expect(response.status).toBe(400);
    });


    it("PATCH /:id - should return 401 without auth", async () => {
        const response = await request(app)
            .patch("/users/00000000-0000-4000-a000-000000000000")
            .send({ name: "NoAuth" });

        expect(response.status).toBe(401);
    });


    it("PUT /:id - should return 200 when updating existing user", async () => {
        const usersRes = await request(app)
            .get("/users")
            .set("Authorization", accessToken);
        const userId = usersRes.body[0].id;

        const response = await request(app)
            .put(`/users/${userId}`)
            .set("Authorization", accessToken)
            .send({
                name: "PutUpdated",
                email: usersRes.body[0].email,
                password: "foobar123",
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("PutUpdated");
    });


    it("PUT /:id - should return 201 when creating new user at given UUID", async () => {
        const newId = crypto.randomUUID();
        const uniqueEmail = `brandnew-${Date.now()}@test.com`;

        const response = await request(app)
            .put(`/users/${newId}`)
            .set("Authorization", accessToken)
            .send({
                name: "BrandNew",
                email: uniqueEmail,
                password: "foobar123",
            });

        expect(response.status).toBe(201);
        expect(response.body.name).toBe("BrandNew");
        expect(response.body.id).toBe(newId);
    });


    it("DELETE /:id - should return 204 on success", async () => {
        const uniqueEmail = `todelete-${Date.now()}@test.com`;

        // Create a user to delete
        const createRes = await request(app)
            .post("/users")
            .set("Authorization", accessToken)
            .send({
                name: "ToDelete",
                email: uniqueEmail,
                password: "foobar123",
            });
        expect(createRes.status).toBe(201);

        // Find the created user
        const usersRes = await request(app)
            .get("/users")
            .set("Authorization", accessToken);
        const user = usersRes.body.find(u => u.email === uniqueEmail);

        const response = await request(app)
            .delete(`/users/${user.id}`)
            .set("Authorization", accessToken);

        expect(response.status).toBe(204);
    });


    it("DELETE /:id - should return 404 for non-existent valid UUID", async () => {
        const response = await request(app)
            .delete("/users/00000000-0000-4000-a000-000000000000")
            .set("Authorization", accessToken);

        expect(response.status).toBe(404);
    });


    it("DELETE /:id - should return 401 without auth", async () => {
        const response = await request(app)
            .delete("/users/00000000-0000-4000-a000-000000000000");

        expect(response.status).toBe(401);
    });
});
