import { User } from "../models/user.model";
import { createLogger } from "../utils/logger";
import { syncDatabase } from "../providers/db.provider";

const logger = createLogger();

syncDatabase()
    .then(async () => {
        const emails = ["foo@bar.com", "alice@bar.com", "thor@bar.com", "joe@bar.com"];
        const names = ["Foo", "Alice", "Thor", "Joe"];
        
        emails.forEach(async (e,i) => {
            const roles = ["user"];
            if (i % 2 === 0) roles.push("admin");

            const res = await User.create({
                email: e,
                name: names[i],
                password: "foobar",
                roles
            }).catch(err => logger.error("Failed to add user! Error:", err));
            logger.info("Added user:", JSON.stringify(res, null, 4));
        });
    });
