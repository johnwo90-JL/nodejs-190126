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

    data[section][key][subkeyValue.split("=")[0]] = subkeyValue.split("=")[1];

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
