const ResponseCreator = require('../../utils/ResponseCreator');
const ResponseMessage = require('../../utils/ResponseMessage');

class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postCollaborationsHandler = this.postCollaborationsHandler.bind(this);
  }

  async postCollaborationsHandler({ payload, auth }, h) {
    this._validator.validatePostCollaborationsSchema(payload);

    const { playlistId, userId: collaboratorUserId } = payload;
    const { id: ownerUserId } = auth.credentials;
    this._playlistsService.verifyPlaylistOwner(playlistId, ownerUserId);

    const id = await this._collaborationsService.addCollaborator(
      playlistId,
      collaboratorUserId,
    );

    return ResponseCreator.createResponseWithMessageAndData(
      h,
      ResponseMessage.success,
      'Kolaborasi berhasil ditambahkan',
      { collaborationId: id },
      201,
    );
  }
}

module.exports = CollaborationsHandler;
