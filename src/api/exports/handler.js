const ResponseCreator = require('../../utils/ResponseCreator');
const ResponseMessage = require('../../utils/ResponseMessage');

class ExportPlaylistsHandler {
  constructor(messageProducerService, playlistsService, validator) {
    this._messageProducerService = messageProducerService;
    this._playlistsService = playlistsService;
    this._validator = validator;
    this._queue = 'exports:playlist';

    this.postExportPlaylistsHandler =
      this.postExportPlaylistsHandler.bind(this);
  }

  async postExportPlaylistsHandler({ payload, auth, params }, h) {
    this._validator.validateExportPlaylistsPayload(payload);

    const { targetEmail } = payload;
    const { id: userId } = auth.credentials;
    const { playlistId } = params;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

    const message = {
      targetEmail,
      playlistId,
    };

    await this._messageProducerService.sendMessage(
      this._queue,
      JSON.stringify(message),
    );

    return ResponseCreator.createResponseWithMessage(
      h,
      ResponseMessage.success,
      'Permintaan Anda sedang kami proses',
      201,
    );
  }
}

module.exports = ExportPlaylistsHandler;
