/**
 * @format
 * @author lomofu
 * @desc
 * @create 21/Mar/2022 19:43
 */
module.exports = {
  info: (msg) => console.log("\x1b[32m[info] %s\x1b[0m", msg),
  debug: (msg) => console.log("\x1b[33m[debug] %s\x1b[0m", msg),
  error: (msg) => console.log("\x1b[31m[error] %s\x1b[0m", msg),
};
