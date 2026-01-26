import { EventEmitter } from "node:events";
import { createLogger, Logger } from "./utils/logger.js";

import "./server.js"; // "Side-effect only"-import


const logger = createLogger();

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


