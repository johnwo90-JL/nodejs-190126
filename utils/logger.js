
import "./log.io.js"; // Side-effect import
import { writeToLog } from "./log.io.js";

function debug(...msg) {
    console.log("[DBG]:", ...msg);
}

function info(...msg) {
    console.log("[INFO]:", ...msg);
}

function warn(...msg) {
    console.log("[WARN]:", ...msg);
}

function error(...msg) {
    console.log("[ERROR]:", ...msg);
}

const loggerMethods = {
    debug,
    info,
    warn,
    error
};

/**
 * @param {`debug`|`info`|`warn`|`error`} severity - Alvorlighetsgrad
 * @param  {...any} args 
 */
function log(moduleName, severity, ...args) {
    writeToLog(moduleName, severity, JSON.stringify(args, null, 4));
    loggerMethods[severity.toLowerCase()](...args);
}


export {
    log
};