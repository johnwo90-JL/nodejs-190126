import { Router } from "express";
import { useAuth } from "../middleware/use-auth.middleware";
import * as JSONStorage from "../providers/json-storage.provider";

const usersRoutes = Router();

usersRoutes.get("/", useAuth("admin"), (req, res) => {
    res.json(JSONStorage.get("users"));
});

usersRoutes.get("/:id", useAuth("admin", "self"), (req, res) => {
    const { id } = req.params;

    res.json(JSONStorage.get("users")[id]);
});


usersRoutes.post("/", useAuth("admin"), (req, res) => {
    /*
        "name": "Alice",
        "email": "foo@bar.com",
        "password": "abc123",
        "roles": ["user"]
    */
   // TODO add input validation

    const newUser = req.body;
    const newUserId = crypto.randomUUID();

    JSONStorage.set("users", newUserId, "name="+newUser.name);
    JSONStorage.set("users", newUserId, "email="+newUser.email);
    JSONStorage.set("users", newUserId, "password="+newUser.password);
    JSONStorage.set("users", newUserId, "roles="+JSON.stringify(newUser.roles));
    
    res.sendStatus(201); // 201 CREATED
});


export { usersRoutes }