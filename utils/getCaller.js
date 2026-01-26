import path from "node:path";
import { fileURLToPath } from "node:url";

export function getMyCaller() {
  const original = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stack) => stack;
  
  const stack = new Error().stack;
  Error.prepareStackTrace = original; // Rydd opp med en gang
  
  if (stack && stack.length > 1) {
      const callerFrame = stack[2];
      const url = callerFrame.getFileName();
    
    return path.basename(url.startsWith('file://') ? fileURLToPath(url) : url);
  }
  
  return null;
}