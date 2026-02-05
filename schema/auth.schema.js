
import z from "zod";

// Validering av inndata for endepunkt "/:id"
export const GetLogin = z.object({
    body: z.object({
        email: z.email(),
        password: z.string(),
    })
});
