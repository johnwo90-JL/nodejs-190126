import { User } from "../models/user.model";

export async function getAll(req, res) {
    res.json(await User.findAll({
        attributes: {
            exclude: ["password"]
        }
    }));
}

export async function getById(req, res) {
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
}

export async function create(req, res) {
    const newUser = req.body;
    await User.create(newUser);

    res.sendStatus(201);
}

export async function update(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
        res.sendStatus(404);
        return;
    }

    await user.update(req.body);

    res.json(user.toJSON());
}

export async function upsert(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (user) {
        await user.update(req.body);
        res.json(user.toJSON());
        return;
    }

    const newUser = await User.create({ ...req.body, id });
    res.status(201).json(newUser.toJSON());
}

export async function remove(req, res) {
    const { id } = req.params;

    const deleted = await User.destroy({ where: { id } });

    if (!deleted) {
        res.sendStatus(404);
        return;
    }

    res.sendStatus(204);
}
