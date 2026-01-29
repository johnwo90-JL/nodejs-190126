
import fs from "node:fs";

/**
 * Read a file.
 * @param {import("node:fs").PathLike} path 
 * @returns 
 */
function read(path) {
    if (!fs.existsSync(path)) {
        throw new Error("File not found!");
    }

    return fs.readFileSync(path);
}

/**
 * Write to a file.
 * @param {import("node:fs").PathLike} path 
 * @param {any} data 
 * @returns 
 */
function write(path, data, append = true) {
    if (!fs.existsSync(path)) {
        console.info(path,"doesn't exist, creating!");
        fs.writeFileSync(path, data);
        return;
    }

    if (append) {
        fs.appendFileSync(path, data);
        return;
    }

    fs.writeFileSync(path, data);
}

export const fileIOProvider = {
    read,
    write
};