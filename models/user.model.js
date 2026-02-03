import { sequelize } from "../config/db.config";
import { DataTypes } from "sequelize"; 
import * as bcrypt from "bcrypt";


const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    roles: {
        type: DataTypes.JSON,  // DataTypes.ARRAY(DataTypes.ENUM(["admin", "user"])),
        defaultValue: ["user"],
        allowNull: false,

        validate: {
            isValidRole(value) {
                const validRoles = ["admin", "user"];
                if (!Array.isArray(value) || !value.every(role => validRoles.includes(role))) {
                    throw new Error("Invalid role detected");
                }
            }
        }
    },
}, {
    tableName: "Users",
    timestamps: true,

    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        },

        beforeUpdate: async (user) => {
            if (user.changed("password")) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        }
    }
});

User.prototype.comparePassword = async function (pw) {
    return await bcrypt.compare(pw, this.password);
}

User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
}


export { User };