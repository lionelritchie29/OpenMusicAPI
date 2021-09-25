const ClientError = require('../exceptions/ClientError');
const ResponseCreator = require('./ResponseCreator');
const ResponseMessage = require('./ResponseMessage');

const ErrorHandler = {
  handleError: (h, error) => {
    if (error instanceof ClientError) {
      return ResponseCreator.createResponseWithMessage(
        h,
        ResponseMessage.fail,
        error.message,
        error.statusCode,
      );
    }

    console.log(error);
    const errorCode = error && error.output ? error.output.statusCode : 500;
    return ResponseCreator.createResponseWithMessage(
      h,
      ResponseMessage.error,
      error.message,
      errorCode,
    );
  },
};

module.exports = ErrorHandler;
