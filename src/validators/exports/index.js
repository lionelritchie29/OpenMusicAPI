const BadRequestError = require('../../exceptions/BadRequestError');
const ExportPlaylistsPayloadSchema = require('./schema');

const ExportPlaylistsValidator = {
  validateExportPlaylistsPayload: (payload) => {
    const validationResult = ExportPlaylistsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new BadRequestError(validationResult.error.message);
    }
  },
};

module.exports = ExportPlaylistsValidator;
