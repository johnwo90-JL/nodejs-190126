import { Router } from "express";
import { useAuth } from "../middleware/use-auth.middleware";
import { useValidate } from "../middleware/use-validate.middleware";
import { User } from "../models/user.model";
import { CreateUser, GetById } from "../schema/users.schema";


const usersRoutes = Router();
// const logger = createLogger();

usersRoutes.get("/", useAuth("admin"), async (req, res) => {
    res.json(await User.findAll({
        attributes:{
            exclude: ["password"]
        }
    }));
});

usersRoutes.get("/:id", useAuth("admin", "self"), useValidate(GetById), async (req, res) => {
    const { id } = req.params;

    const user = await User.findByPk(id, {
        attributes: {
            exclude: ["password"]
        }
    });

    if (!user) {
        res.sendStatus(404);
        return;
    }

    res.json(user);
});


usersRoutes.post("/", useAuth("admin"), useValidate(CreateUser), async (req, res) => {
    const newUser = req.body;
    await User.create(newUser);
    
    res.sendStatus(201); // 201 CREATED
});

// "PATCH /:id" - Oppdatere brukerinformasjon

// -- OPTIONAL -- 
// "PUT /:id" - Oppdatere brukerinformasjon, MEN hvis `id` ikke eksisterer i DB,
// *og* request.body inneholder all nødvendig informasjon, opprett en bruker med `id`.


// "DELETE /:id" - Slette en bruker (kun admin)


export { usersRoutes }