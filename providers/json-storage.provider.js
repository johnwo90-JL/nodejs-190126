import { fileIOProvider } from "./file.io";
import path from "node:path";

const jsonDB = path.resolve(process.cwd(), "data", "db.json");



export function set(section, key, subkeyValue) {
    const data = (() => {
        try {
            return JSON.parse(fileIOProvider.read(jsonDB));
        } catch (err) {
            console.log(err);
            // TODO use Logger
            return null;
        }
    })();

    if (data === null) {
        throw new Error("Error reading from JSON-DB.", { cause: 500 });
    }

    if (data[section] === undefined) data[section] = {};
    if (data[section][key] === undefined) data[section][key] = {};

    const roles = subkeyValue.split("=")[0] === "roles" ? JSON.parse(subkeyValue.split("=")[1]) : null;
    data[section][key][subkeyValue.split("=")[0]] = roles===null ? subkeyValue.split("=")[1] : roles;

    fileIOProvider.write(jsonDB, JSON.stringify(data, null, 4), false);
    
    return data[section][key][subkeyValue.split("=")[0]];
}

export function get(key) {
    let data = (() => {
        try {
            return JSON.parse(fileIOProvider.read(jsonDB));
        } catch (err) {
            console.log(err);
            // TODO use Logger
            return null;
        }
    })();

    if (data === null) {
        throw new Error("Error reading from JSON-DB.", { cause: 500 });
    }

    key.split(".").forEach(e => data = data[e]);

    return data;
}
