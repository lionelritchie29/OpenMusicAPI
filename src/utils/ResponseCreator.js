const ResponseCreator = {
  createResponseWithMessage: (h, status, message, statusCode = 201) => {
    const response = h.response({
      status,
      message,
    });
    response.code(statusCode);
    return response;
  },

  createResponseWithData: (h, status, data, statusCode = 201) => {
    const response = h.response({
      status,
      data,
    });
    response.code(statusCode);
    return response;
  },

  createResponseWithMessageAndData: (
    h,
    status,
    message,
    data,
    statusCode = 201,
  ) => {
    const response = h.response({
      status,
      data,
      message,
    });
    response.code(statusCode);
    return response;
  },
};

module.exports = ResponseCreator;
