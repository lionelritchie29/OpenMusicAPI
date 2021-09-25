const ResponseCreator = require('../../utils/ResponseCreator');
const ResponseMessage = require('../../utils/ResponseMessage');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistsHandler = this.postPlaylistsHandler.bind(this);
  }

  async postPlaylistsHandler({ payload, auth }, h) {
    this._validator.validatePostPlaylistPayload(payload);
    const { id: ownerUserId } = auth.credentials;
    const { name } = payload;

    const id = await this._service.addPlaylist(name, ownerUserId);
    return ResponseCreator.createResponseWithMessageAndData(
      h,
      ResponseMessage.success,
      'Playlist berhasil ditambahkan',
      { playlistId: id },
      201,
    );
  }
}

module.exports = PlaylistsHandler;
