import { EventEmitter } from "node:events";
import { Logger } from "./utils/logger.js";
import { read, write } from "./providers/file.io.js";

import "./server.js"; // "Side-effect only"-import



const logger = new Logger("index", console, { read, write: (path, data) => { data = `${new Date().toISOString()} - ${data}\n`; write(path, data) } });

class MyEmitter extends EventEmitter { 
    constructor() {
        super();
    }

    logger(severity, data) {
        this.emit("log", severity, data);
    }
};


// Lag ny EventEmitter
// const myEmitter = new MyEmitter();


// Utløse hendelse
setTimeout(() => logger.log("This is a message, 1"), 1000); 
setTimeout(() => logger.log("This is a message, 2"), 2000); 
setTimeout(() => logger.log("This is a message, 3"), 3000); 


