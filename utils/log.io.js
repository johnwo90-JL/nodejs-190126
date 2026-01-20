
import fs from "node:fs";
import * as path from "node:path";

const logsFolder = path.resolve(process.cwd(), "logs");

function getLogName(moduleName, severity) {
    const date = new Date();    
    const month = date.getMonth()+1 < 9 ? "0"+(date.getMonth()+1) : date.getMonth()+1;

    return path.resolve(logsFolder, `${moduleName}-${date.getFullYear()}${month}${date.getDate()}.${severity}.log`);
}

function write(filePath, data) {
    const prefixedData = `${new Date().toISOString()} - ${data}\n`;

    if (!fs.existsSync(filePath)) {
        console.log(filePath,"doesn't exist, creating!");
        fs.writeFileSync(filePath, prefixedData);
        return;
    }

    fs.appendFileSync(filePath, prefixedData);
}

/**
 * @param {string} moduleName 
 * @param {`debug`|`info`|`warn`|`error`} severity 
 * @param {any} data 
 */
function writeToLog(moduleName, severity, data) {
    const logPath = getLogName(moduleName, severity);
    write(logPath, data);
}

export {
    writeToLog
}