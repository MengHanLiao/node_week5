class appError extends Error {
  constructor(errMsg, httpStatus = 400,  isOperational = true) {
    super(errMsg);
    this.statusCode = httpStatus;
    this.isOperational = isOperational;
  }
}

module.exports = appError;
