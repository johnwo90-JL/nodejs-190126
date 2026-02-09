import { describe, it, expect } from "vitest";
import z from "zod";
import { useValidate } from "../../../middleware/use-validate.middleware.js";

const testSchema = z.object({
    body: z.object({
        name: z.string(),
    }),
});

function createMockRes() {
    let sentStatus = null;
    return {
        sendStatus(code) { sentStatus = code; },
        get statusSent() { return sentStatus; },
    };
}

describe("useValidate middleware", () => {
    it("should call next() when validation passes", () => {
        const middleware = useValidate(testSchema);
        const req = { body: { name: "Valid" } };
        const res = createMockRes();
        let nextCalled = false;
        const next = () => { nextCalled = true; };

        middleware(req, res, next);

        expect(nextCalled).toBe(true);
    });

    it("should send 400 when validation fails", () => {
        const middleware = useValidate(testSchema);
        const req = { body: {} };
        const res = createMockRes();
        const next = () => {};

        middleware(req, res, next);

        expect(res.statusSent).toBe(400);
    });

    it("should not call next() when validation fails", () => {
        const middleware = useValidate(testSchema);
        const req = { body: {} };
        const res = createMockRes();
        let nextCalled = false;
        const next = () => { nextCalled = true; };

        middleware(req, res, next);

        expect(nextCalled).toBe(false);
    });
});
