import { describe, it, expect } from "vitest";
import { GetLogin, RefreshToken } from "../../../schema/auth.schema.js";

describe("Auth Schema", () => {
    describe("GetLogin", () => {
        it("should pass with valid email and password", () => {
            const result = GetLogin.safeParse({ body: { email: "test@example.com", password: "secret" } });
            expect(result.success).toBe(true);
        });

        it("should fail when email is missing", () => {
            const result = GetLogin.safeParse({ body: { password: "secret" } });
            expect(result.success).toBe(false);
        });

        it("should fail when password is missing", () => {
            const result = GetLogin.safeParse({ body: { email: "test@example.com" } });
            expect(result.success).toBe(false);
        });

        it("should fail with an invalid email", () => {
            const result = GetLogin.safeParse({ body: { email: "not-an-email", password: "secret" } });
            expect(result.success).toBe(false);
        });
    });

    describe("RefreshToken", () => {
        it("should pass with a valid refreshToken string", () => {
            const result = RefreshToken.safeParse({ body: { refreshToken: "some-valid-token" } });
            expect(result.success).toBe(true);
        });

        it("should fail when refreshToken is missing", () => {
            const result = RefreshToken.safeParse({ body: {} });
            expect(result.success).toBe(false);
        });

        it("should fail when refreshToken is an empty string", () => {
            const result = RefreshToken.safeParse({ body: { refreshToken: "" } });
            expect(result.success).toBe(false);
        });
    });
});
