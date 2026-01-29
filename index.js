import dotenv from "dotenv";
dotenv.config();

import "./server.js"; // "Side-effect only"-import
import { generateToken } from "./providers/jwt.provider.js";

generateToken();