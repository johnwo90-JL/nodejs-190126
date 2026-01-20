import { log } from "./utils/index.js";
import { EventEmitter } from "node:events";


class MyEmitter extends EventEmitter { 
    constructor() {
        super();
    }

    log(severity, data) {
        this.emit("log", severity, data);
    }
};


// Lag ny EventEmitter
const myEmitter = new MyEmitter();


// Lytt etter hendelse med navn "log"
myEmitter.on("log", (severity, msg) => {
    log("index.js", severity, msg);
});


// Utløse hendelse
setTimeout(() => myEmitter.log("info", "someData"), 2000); 


