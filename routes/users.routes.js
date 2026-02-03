import { Router } from "express";
import { useAuth } from "../middleware/use-auth.middleware";
import * as JSONStorage from "../providers/json-storage.provider";

import { User } from "../models/user.model";


const usersRoutes = Router();

usersRoutes.get("/", useAuth("admin"), async (req, res) => {
    res.json(await User.findAll({
        attributes:{
            exclude: ["password"]
        }
    }));
});

usersRoutes.get("/:id", useAuth("admin", "self"), async (req, res) => {
    const { id } = req.params;

    res.json(await User.findByPk(id, {
        attributes:{
            exclude: ["password"]
        }
    }));
});


usersRoutes.post("/", useAuth("admin"), async (req, res) => {
   // TODO add input validation

    const newUser = req.body;
    await User.create(newUser);
    
    res.sendStatus(201); // 201 CREATED
});


export { usersRoutes }