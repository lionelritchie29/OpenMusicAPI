const BadRequestError = require('../../exceptions/BadRequestError');
const { PostCollaborationsSchema, DeleteCollaborationsSchema } = require('./schema');

const CollaborationsValidator = {
  validatePostCollaborationsSchema: (payload) => {
    const validationResult = PostCollaborationsSchema.validate(payload);
    if (validationResult.error) {
      throw new BadRequestError(validationResult.error.message);
    }
  },

  validateDeleteCollaborationsSchema: (payload) => {
    const validationResult = DeleteCollaborationsSchema.validate(payload);
    if (validationResult.error) {
      throw new BadRequestError(validationResult.error.message);
    }
  },
};

module.exports = CollaborationsValidator;
