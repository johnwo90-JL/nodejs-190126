import "./server.js"; // "Side-effect only"-import

import { set, get } from "./providers/json-storage.provider";


const user = get("users.ea108a5b-e476-4597-ad6e-e5cbd04ad850.password");

console.log("User", user);