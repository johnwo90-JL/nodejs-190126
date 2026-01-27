
import "../providers/file.io.js"; // Side-effect import
import path from "node:path";
import { fileIOProvider } from "../providers/file.io.js";
import { getMyCaller } from "./get-caller.js";

const logsFolder = path.resolve(process.cwd(), "logs");

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

    /**
     * Constructor for Logger-class
     */
    constructor(
        prefix = "",
        loggingInterface = null,
        ioProvider = null,
    ) {
        console.log("Logger initialized with:", {prefix});
        this.#loggingInterface = loggingInterface;
        this.#fileIOProvider = ioProvider;
        this.#prefix = prefix;
    }

    log(...msg) {
        msg.push("\n");
        this.#loggingInterface.log("[LOG]", ...msg);
        this.#writeToFile("info", this.#logLine(...msg));
    }

    info(...msg) {
        msg.push("\n");
        this.#loggingInterface.info("[INFO]", ...msg);
        this.#writeToFile("info", this.#logLine(...msg));
    }

    debug(...msg) {
        msg.push("\n");
        this.#loggingInterface.debug("[DBG]", ...msg);
        this.#writeToFile("debug", this.#logLine(...msg));
    }

    warn(...msg) {
        msg.push("\n");
        this.#loggingInterface.warn("[WARN]", ...msg);
        this.#writeToFile("warn", this.#logLine(...msg));
    }

    error(...msg) {
        msg.push("\n");
        this.#loggingInterface.error("[ERROR]", ...msg);
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

        return path.resolve(logsFolder, `${(this.#prefix + (this.#prefix ? "-" : "")).toUpperCase()}${date.getFullYear()}${month}${date.getDate()}.${severity}.log`);
    }
}

export {
    Logger
};

export const createLogger = function() {return new Logger(getMyCaller(), console, fileIOProvider);}