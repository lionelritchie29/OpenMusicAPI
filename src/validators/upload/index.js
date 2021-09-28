const { UploadImageHeadersSchema } = require('./schema');
const BadRequestError = require('../../exceptions/BadRequestError');

const UploadsValidator = {
  validateImageHeaders: (headers) => {
    const validationResult = UploadImageHeadersSchema.validate(headers);

    if (validationResult.error) {
      throw new BadRequestError(validationResult.error.message);
    }
  },
};

module.exports = UploadsValidator;
