import { sequelize } from "../config/db.config";
import { DataTypes } from "sequelize"; 
import { User } from "./user.model";


const RefreshToken = sequelize.define("RefreshToken", {
    id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: "RefreshTokens",
    timestamps: true,
});

User.hasOne(RefreshToken);
RefreshToken.belongsTo(User);


export { RefreshToken };