import { describe, it, expect } from "vitest";
import { useAuth } from "../../../middleware/use-auth.middleware.js";
import { generateToken } from "../../../providers/jwt.provider.js";

const adminUser = { id: "550e8400-e29b-41d4-a716-446655440000", name: "Admin", email: "admin@test.com", roles: ["admin"] };
const regularUser = { id: "660e8400-e29b-41d4-a716-446655440000", name: "User", email: "user@test.com", roles: ["user"] };

function createMockRes() {
    let sentStatus = null;
    return {
        sendStatus(code) { sentStatus = code; },
        get statusSent() { return sentStatus; },
    };
}

describe("useAuth middleware", () => {
    it("should return 401 when no Authorization header is present", () => {
        const middleware = useAuth("admin");
        const req = { headers: {}, params: {} };
        const res = createMockRes();
        let nextCalled = false;
        const next = () => { nextCalled = true; };

        middleware(req, res, next);

        expect(res.statusSent).toBe(401);
        expect(nextCalled).toBe(false);
    });

    it("should return 401 when token is invalid/malformed", () => {
        const middleware = useAuth("admin");
        const req = { headers: { authorization: "Bearer invalid.token.here" }, params: {} };
        const res = createMockRes();
        let nextCalled = false;
        const next = () => { nextCalled = true; };

        middleware(req, res, next);

        expect(res.statusSent).toBe(401);
        expect(nextCalled).toBe(false);
    });

    it("should call next() when user has the required role", () => {
        const token = generateToken(adminUser, "access");
        const middleware = useAuth("admin");
        const req = { headers: { authorization: `Bearer ${token}` }, params: {} };
        const res = createMockRes();
        let nextCalled = false;
        const next = () => { nextCalled = true; };

        middleware(req, res, next);

        expect(nextCalled).toBe(true);
    });

    it("should return 403 when user lacks the required role and 'self' is not in roles list", () => {
        const token = generateToken(regularUser, "access");
        const middleware = useAuth("admin");
        const req = { headers: { authorization: `Bearer ${token}` }, params: {} };
        const res = createMockRes();
        let nextCalled = false;
        const next = () => { nextCalled = true; };

        middleware(req, res, next);

        expect(res.statusSent).toBe(403);
        expect(nextCalled).toBe(false);
    });

    it("should call next() when user lacks role but 'self' is in roles list and req.params.id matches", () => {
        const token = generateToken(regularUser, "access");
        const middleware = useAuth("admin", "self");
        const req = { headers: { authorization: `Bearer ${token}` }, params: { id: regularUser.id } };
        const res = createMockRes();
        let nextCalled = false;
        const next = () => { nextCalled = true; };

        middleware(req, res, next);

        expect(nextCalled).toBe(true);
    });

    it("should return 403 when 'self' is in roles list but req.params.id does not match", () => {
        const token = generateToken(regularUser, "access");
        const middleware = useAuth("admin", "self");
        const req = { headers: { authorization: `Bearer ${token}` }, params: { id: "different-id" } };
        const res = createMockRes();
        let nextCalled = false;
        const next = () => { nextCalled = true; };

        middleware(req, res, next);

        expect(res.statusSent).toBe(403);
        expect(nextCalled).toBe(false);
    });
});
