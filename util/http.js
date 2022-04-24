/**
 * @format
 * @author lomofu
 * @desc
 * @create 21/Mar/2022 18:25
 */

module.exports = {
  BAD_REQUEST: {
    code: 400,
    message: (val) => `Bad Request, ${val} `,
  },
  SERVER_ERROR: {
    code: 500,
    message: (val) => `Server Error, ${val} `,
  },
  ERROR_PAGE: {
    code: 501,
  },
};
