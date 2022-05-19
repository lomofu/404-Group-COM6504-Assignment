/**
 * @format
 * @desc
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
