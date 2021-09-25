const Joi = require('joi');

const PostCollaborationsSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = { PostCollaborationsSchema };
