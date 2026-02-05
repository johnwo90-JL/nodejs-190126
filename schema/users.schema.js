
import z from "zod";

// Validering av inndata for endepunkt "/:id"
export const GetById = z.object({
    params: z.object({
        id: z.uuidv4(),
    })
});

// Validering av inndata for endepunkt POST "/"
export const CreateUser = z.object({
    body: z.object({
        name: z.string().min(3),
        email: z.email(),
        password: z.string().max(64).min(6).regex(/[a-zA-Z0-9_:;!%&#]+/),
        roles: z.array(z.enum(["user", "admin"])).optional()
    })
});



