import { Router } from "express";
import { useValidate } from "../middleware/use-validate.middleware";
import { GetLogin, RefreshToken } from "../schema/auth.schema";
import * as authController from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/login", useValidate(GetLogin), authController.login);
authRouter.post("/refresh", useValidate(RefreshToken), authController.refresh);
authRouter.get("/logout", authController.logout);
authRouter.post("/logout", authController.logout);

export { authRouter as authRoutes };
