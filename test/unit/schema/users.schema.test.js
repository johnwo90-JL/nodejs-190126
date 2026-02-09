import { describe, it, expect } from "vitest";
import { GetById, CreateUser, UpdateUser, UpsertUser, DeleteUser } from "../../../schema/users.schema.js";

const validUUID = "550e8400-e29b-41d4-a716-446655440000";

describe("Users Schema", () => {
    describe("GetById", () => {
        it("should pass with a valid UUIDv4", () => {
            const result = GetById.safeParse({ params: { id: validUUID } });
            expect(result.success).toBe(true);
        });

        it("should fail with a non-UUID string", () => {
            const result = GetById.safeParse({ params: { id: "not-a-uuid" } });
            expect(result.success).toBe(false);
        });

        it("should fail when params.id is missing", () => {
            const result = GetById.safeParse({ params: {} });
            expect(result.success).toBe(false);
        });
    });

    describe("CreateUser", () => {
        const validBody = {
            name: "John",
            email: "john@example.com",
            password: "foobar123",
        };

        it("should pass with valid full body", () => {
            const result = CreateUser.safeParse({ body: validBody });
            expect(result.success).toBe(true);
        });

        it("should fail when name is missing", () => {
            const { name, ...rest } = validBody;
            const result = CreateUser.safeParse({ body: rest });
            expect(result.success).toBe(false);
        });

        it("should fail when email is missing", () => {
            const { email, ...rest } = validBody;
            const result = CreateUser.safeParse({ body: rest });
            expect(result.success).toBe(false);
        });

        it("should fail when password is missing", () => {
            const { password, ...rest } = validBody;
            const result = CreateUser.safeParse({ body: rest });
            expect(result.success).toBe(false);
        });

        it("should fail when name is less than 3 characters", () => {
            const result = CreateUser.safeParse({ body: { ...validBody, name: "ab" } });
            expect(result.success).toBe(false);
        });

        it("should fail when password is less than 6 characters", () => {
            const result = CreateUser.safeParse({ body: { ...validBody, password: "abc12" } });
            expect(result.success).toBe(false);
        });

        it("should fail when password is more than 64 characters", () => {
            const result = CreateUser.safeParse({ body: { ...validBody, password: "a".repeat(65) } });
            expect(result.success).toBe(false);
        });

        it("should fail with an invalid email", () => {
            const result = CreateUser.safeParse({ body: { ...validBody, email: "not-an-email" } });
            expect(result.success).toBe(false);
        });

        it("should fail with invalid password characters", () => {
            const result = CreateUser.safeParse({ body: { ...validBody, password: "$$$$$$$$" } });
            expect(result.success).toBe(false);
        });

        it("should accept optional roles", () => {
            const result = CreateUser.safeParse({ body: { ...validBody, roles: ["user", "admin"] } });
            expect(result.success).toBe(true);
        });

        it("should fail with invalid role value", () => {
            const result = CreateUser.safeParse({ body: { ...validBody, roles: ["superadmin"] } });
            expect(result.success).toBe(false);
        });
    });

    describe("UpdateUser", () => {
        it("should pass with valid partial body (just name)", () => {
            const result = UpdateUser.safeParse({ params: { id: validUUID }, body: { name: "Updated" } });
            expect(result.success).toBe(true);
        });

        it("should require a valid UUIDv4 in params", () => {
            const result = UpdateUser.safeParse({ params: { id: "bad" }, body: { name: "Updated" } });
            expect(result.success).toBe(false);
        });

        it("should pass with empty body (all fields optional)", () => {
            const result = UpdateUser.safeParse({ params: { id: validUUID }, body: {} });
            expect(result.success).toBe(true);
        });

        it("should fail with invalid email", () => {
            const result = UpdateUser.safeParse({ params: { id: validUUID }, body: { email: "bad" } });
            expect(result.success).toBe(false);
        });
    });

    describe("UpsertUser", () => {
        const validBody = {
            name: "John",
            email: "john@example.com",
            password: "foobar123",
        };

        it("should pass with valid full body", () => {
            const result = UpsertUser.safeParse({ params: { id: validUUID }, body: validBody });
            expect(result.success).toBe(true);
        });

        it("should fail when required field (name) is missing", () => {
            const { name, ...rest } = validBody;
            const result = UpsertUser.safeParse({ params: { id: validUUID }, body: rest });
            expect(result.success).toBe(false);
        });

        it("should require a valid UUIDv4 in params", () => {
            const result = UpsertUser.safeParse({ params: { id: "bad" }, body: validBody });
            expect(result.success).toBe(false);
        });
    });

    describe("DeleteUser", () => {
        it("should pass with a valid UUID", () => {
            const result = DeleteUser.safeParse({ params: { id: validUUID } });
            expect(result.success).toBe(true);
        });

        it("should fail with an invalid UUID", () => {
            const result = DeleteUser.safeParse({ params: { id: "not-valid" } });
            expect(result.success).toBe(false);
        });
    });
});
