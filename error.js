const ERROR_CODE_VALID = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_DEFAULT = 500;

class defaultError extends Error {
  constructor(message) {
    super(message);
    this.name = "defaultError";
    this.statusCode = 500;
  }
};

module.exports = {
  ERROR_CODE_VALID,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT,
  defaultError
};