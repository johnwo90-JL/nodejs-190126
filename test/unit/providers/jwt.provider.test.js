import { describe, it, expect } from "vitest";
import jwt from "jsonwebtoken";
import { generateToken, verifyToken } from "../../../providers/jwt.provider.js";

const testUser = { id: "550e8400-e29b-41d4-a716-446655440000", name: "Test", email: "test@test.com", roles: ["user"] };

describe("JWT Provider", () => {
    describe("generateToken", () => {
        it("should return a string token for access type", () => {
            const token = generateToken(testUser, "access");
            expect(typeof token).toBe("string");
            expect(token.split(".")).toHaveLength(3);
        });

        it("should return a string token for refresh type", () => {
            const token = generateToken(testUser, "refresh");
            expect(typeof token).toBe("string");
            expect(token.split(".")).toHaveLength(3);
        });

        it("should produce a decodable token containing the user payload", () => {
            const token = generateToken(testUser, "access");
            const decoded = jwt.decode(token);
            expect(decoded.id).toBe(testUser.id);
            expect(decoded.name).toBe(testUser.name);
            expect(decoded.email).toBe(testUser.email);
        });

        it("should produce access and refresh tokens with different expiry", () => {
            const accessToken = generateToken(testUser, "access");
            const refreshToken = generateToken(testUser, "refresh");
            const accessDecoded = jwt.decode(accessToken);
            const refreshDecoded = jwt.decode(refreshToken);
            expect(refreshDecoded.exp).toBeGreaterThan(accessDecoded.exp);
        });
    });

    describe("verifyToken", () => {
        it("should return decoded payload for a valid token", () => {
            const token = generateToken(testUser, "access");
            const decoded = verifyToken(token);
            expect(decoded.id).toBe(testUser.id);
            expect(decoded.email).toBe(testUser.email);
        });

        it("should throw for an expired token", () => {
            const token = jwt.sign({ ...testUser }, process.env.JWT_SECRET, { expiresIn: "0s" });
            expect(() => verifyToken(token)).toThrow();
        });

        it("should throw for a tampered token", () => {
            const token = generateToken(testUser, "access");
            const tampered = token.slice(0, -5) + "XXXXX";
            expect(() => verifyToken(tampered)).toThrow();
        });

        it("should throw for a random garbage string", () => {
            expect(() => verifyToken("this.is.garbage")).toThrow();
        });
    });
});
