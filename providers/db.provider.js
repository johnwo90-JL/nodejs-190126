import { sequelize } from "../config/db.config";
import { createLogger } from "../utils/logger";

const logger = createLogger();

async function testConnection() {
    try {
        await sequelize.authenticate();
        logger.debug("Connected to database");
    } catch (err) {
        logger.error("Test connection failed with error:", err);
        throw err;
    }
}

async function syncDatabase(options) {
    try {
        await sequelize.sync(options);
        logger.debug("All models synced!");
    } catch (err) {
        logger.error("Failed to sync models:", err);
        throw err;
    }
}

export { 
    testConnection,
    syncDatabase,
}