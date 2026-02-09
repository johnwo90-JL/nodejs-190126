import { describe, it, expect } from "vitest";
import { useRequestId } from "../../../middleware/use-request-id.middleware.js";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe("useRequestId middleware", () => {
    it("should set X-Request-Id header on req.headers", () => {
        const req = { headers: {} };
        const res = {};
        const next = () => {};

        useRequestId(req, res, next);

        expect(req.headers["X-Request-Id"]).toBeDefined();
    });

    it("should generate a valid UUID", () => {
        const req = { headers: {} };
        const res = {};
        const next = () => {};

        useRequestId(req, res, next);

        expect(req.headers["X-Request-Id"]).toMatch(UUID_REGEX);
    });

    it("should call next()", () => {
        const req = { headers: {} };
        const res = {};
        let nextCalled = false;
        const next = () => { nextCalled = true; };

        useRequestId(req, res, next);

        expect(nextCalled).toBe(true);
    });
});
