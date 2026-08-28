import app from "../src/server/app";

export default app;

// Ensure Vercel's CJS loader can find the express app if transpiled to CommonJS
if (typeof module !== "undefined" && module.exports) {
  module.exports = app;
}
