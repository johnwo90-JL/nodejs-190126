// Conf for DB

import { Sequelize } from "sequelize";
import { config } from "./env.config";

const { database } = config;


export const sequelize = new Sequelize(database.name, database.user, database.password, {
    host: database.host,
    port: database.port,
    dialect: database.dialect,
    storage: database.storage,
    foreignKeys: true,

    logging: config.env === "development" ? console.log : false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    timezone: "+00:00",
    define: {
        timestamps: true,
        underscored: true,
        freezeTableName: false
    }
});