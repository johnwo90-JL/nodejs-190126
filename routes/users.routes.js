import { Router } from "express";
import { useAuth } from "../middleware/use-auth.middleware";
import { useValidate } from "../middleware/use-validate.middleware";
import { CreateUser, GetById, UpdateUser, UpsertUser, DeleteUser } from "../schema/users.schema";
import * as usersController from "../controllers/users.controller";

const usersRoutes = Router();

usersRoutes.get("/", useAuth("admin"), usersController.getAll);
usersRoutes.get("/:id", useAuth("admin", "self"), useValidate(GetById), usersController.getById);
usersRoutes.post("/", useAuth("admin"), useValidate(CreateUser), usersController.create);
usersRoutes.patch("/:id", useAuth("admin", "self"), useValidate(UpdateUser), usersController.update);
usersRoutes.put("/:id", useAuth("admin"), useValidate(UpsertUser), usersController.upsert);
usersRoutes.delete("/:id", useAuth("admin"), useValidate(DeleteUser), usersController.remove);

export { usersRoutes };
