/**
 * @format
 * @Description:
 * @author Lixuan Lou
 * @date 2022/4/24
 */

module.exports = class Exception extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
};
