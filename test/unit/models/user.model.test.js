import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { User } from "../../../models/user.model.js";
import { sequelize } from "../../../config/db.config.js";

let testUser = null;

beforeAll(async () => {
    await sequelize.sync();
    testUser = await User.create({
        name: "TestUser",
        email: `modeltest-${Date.now()}@test.com`,
        password: "plaintext123",
        roles: ["user"],
    });
});

afterAll(async () => {
    if (testUser) await testUser.destroy().catch(() => {});
    await sequelize.close();
});

describe("User Model", () => {
    describe("beforeCreate hook", () => {
        it("should hash the password (not store plaintext) after User.create", () => {
            expect(testUser.password).not.toBe("plaintext123");
            expect(testUser.password.startsWith("$2b$")).toBe(true);
        });
    });

    describe("beforeUpdate hook", () => {
        it("should re-hash the password when changed via user.update", async () => {
            const oldHash = testUser.password;
            await testUser.update({ password: "newpassword456" });
            expect(testUser.password).not.toBe("newpassword456");
            expect(testUser.password).not.toBe(oldHash);
            expect(testUser.password.startsWith("$2b$")).toBe(true);
        });
    });

    describe("isValidRole validator", () => {
        it("should reject invalid role values", async () => {
            await expect(
                User.create({
                    name: "BadRole",
                    email: `badrole-${Date.now()}@test.com`,
                    password: "foobar123",
                    roles: ["superadmin"],
                })
            ).rejects.toThrow();
        });

        it("should accept valid role arrays", async () => {
            const user = await User.create({
                name: "GoodRole",
                email: `goodrole-${Date.now()}@test.com`,
                password: "foobar123",
                roles: ["user", "admin"],
            });
            expect(user.roles).toEqual(["user", "admin"]);
            await user.destroy();
        });
    });

    describe("comparePassword()", () => {
        let pwUser = null;

        beforeAll(async () => {
            pwUser = await User.create({
                name: "PwTest",
                email: `pwtest-${Date.now()}@test.com`,
                password: "testpassword",
                roles: ["user"],
            });
        });

        afterAll(async () => {
            if (pwUser) await pwUser.destroy().catch(() => {});
        });

        it("should return true for correct password", async () => {
            const result = await pwUser.comparePassword("testpassword");
            expect(result).toBe(true);
        });

        it("should return false for incorrect password", async () => {
            const result = await pwUser.comparePassword("wrongpassword");
            expect(result).toBe(false);
        });
    });

    describe("toJSON()", () => {
        it("should not contain the password field", () => {
            const json = testUser.toJSON();
            expect(json).not.toHaveProperty("password");
        });

        it("should contain id, name, email, and roles", () => {
            const json = testUser.toJSON();
            expect(json).toHaveProperty("id");
            expect(json).toHaveProperty("name");
            expect(json).toHaveProperty("email");
            expect(json).toHaveProperty("roles");
        });
    });
});
