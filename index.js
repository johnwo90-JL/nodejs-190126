import "./server.js"; // "Side-effect only"-import
import { testConnection } from "./providers/db.provider.js";

testConnection().finally(()=>console.log("Done!"));