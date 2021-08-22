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

    return ResponseCreator.createResponseWithMessage(
      h,
      ResponseMessage.error,
      error.message,
      500,
    );
  },
};

module.exports = ErrorHandler;
