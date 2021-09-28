const Joi = require('joi');

const PostPlaylistPayloadSchema = Joi.object({
  name: Joi.string().max(50).required(),
});

const PostPlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

const DeletePlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = {
  PostPlaylistPayloadSchema,
  PostPlaylistSongPayloadSchema,
  DeletePlaylistSongPayloadSchema,
};
