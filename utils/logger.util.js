
import "../providers/file-io.provider.js"; // Side-effect import
import path from "node:path";
import { fileIOProvider } from "../providers/file-io.provider.js";
import { getMyCaller } from "./get-caller.util.js";
import { config } from "../config/env.config.js";
import z from "zod";

const logsFolder = path.resolve(process.cwd(), "logs");

const LogLevelValidate = z.enum(["debug", "info", "warn", "error"]);

/** Maps string-literal to number, for use with `logLevel` */
const logLevelMapping = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
};

/** @typedef {"debug" | "info" | "warn" | "error"} LogLevel */

class Logger {
    // properties - public
    count = 0;

    // properties - private
    #length = 123;
    #loggingInterface = null;

    /**
     * @type {{ write, read }}
     */
    #fileIOProvider = null;
    #prefix = "";


    // properties - protected
    _protected = 42;


    // LogLine format
    #logLineFormat = "$DateTime    $Method    $Path    $Msg\n"

    // LogLevel
    /** @type {LogLevel} */
    #logLevel = "info";

    /**
     * Constructor for Logger-class
     */
    constructor(
        prefix = "",
        loggingInterface = null,
        ioProvider = null,
    ) {
        this.#loggingInterface = loggingInterface;
        this.#fileIOProvider = ioProvider;
        this.#prefix = prefix;
        this.#logLevel = config.env === "development" ? "debug" : "warn";
    }

    /**
     * 
     * @param {LogLevel} logLevel 
     * @returns 
     */
    #logLevelToNumber(logLevel) {
        return logLevelMapping[logLevel];
    }

    get logLevel() {
        return this.#logLevel;
    }

    set logLevel(value) {
            if (!LogLevelValidate.safeParse(value).success){
                console.error(`[Logger] Failed to validate value assigned to \`logLevel\`. Expected "debug", "info", "warn", "error", got "${value}".\n[Logger] Keeping previous value, "${this.#logLevel}"`);
                return;
            }

            this.#logLevel = value;
            console.log(`[Logger] \`logLevel\` set to "${value}".`);
    }

    debug(...msg) {
        if (this.#logLevelToNumber(this.#logLevel) > this.#logLevelToNumber("debug")) {
            return;
        }
        msg.push("\n");
        this.#loggingInterface.debug(`[DBG][${this.#prefix}]`, ...msg);
        this.#writeToFile("debug", this.#logLine(...msg));
    }

    log(...msg) {
        if (this.#logLevelToNumber(this.#logLevel) > this.#logLevelToNumber("info")) {
            return;
        }
        msg.push("\n");
        this.#loggingInterface.log(`[LOG][${this.#prefix}]`, ...msg);
        this.#writeToFile("info", this.#logLine(...msg));
    }

    info(...msg) {
        if (this.#logLevelToNumber(this.#logLevel) > this.#logLevelToNumber("info")) {
            return;
        }
        msg.push("\n");
        this.#loggingInterface.info(`[INFO][${this.#prefix}]`, ...msg);
        this.#writeToFile("info", this.#logLine(...msg));
    }

    warn(...msg) {
        if (this.#logLevelToNumber(this.#logLevel) > this.#logLevelToNumber("warn")) {
            return;
        }
        msg.push("\n");
        this.#loggingInterface.warn(`[WARN][${this.#prefix}]`, ...msg);
        this.#writeToFile("warn", this.#logLine(...msg));
    }

    error(...msg) {
        if (this.#logLevelToNumber(this.#logLevel) > this.#logLevelToNumber("error")) {
            return;
        }
        msg.push("\n");
        this.#loggingInterface.error(`[ERROR][${this.#prefix}]`, ...msg);
        this.#writeToFile("error", this.#logLine(...msg));
    } 


    #logLine(...msg) {
        return this.#logLineFormat.replace("$DateTime", new Date().toISOString())
            .replace("$Method", "???")
            .replace("$Path", "???")
            .replace("$Msg", JSON.stringify(msg));
    }
    

    // Private methods
    #writeToFile(severity, ...msg) {
        const filePath = this.#getLogFilePath(severity || "info");

        this.#fileIOProvider.write(filePath, ...msg);
    }

    #getLogFilePath(severity) {
        const date = new Date();    
        const month = date.getMonth()+1 < 9 ? "0"+(date.getMonth()+1) : date.getMonth()+1;

        return path.resolve(logsFolder, `${(this.#prefix + (this.#prefix ? "-" : ""))}${date.getFullYear()}${month}${date.getDate()}.${severity}.log`);
    }
}

export {
    Logger
};

export const createLogger = function() {return new Logger(getMyCaller(), console, fileIOProvider);}