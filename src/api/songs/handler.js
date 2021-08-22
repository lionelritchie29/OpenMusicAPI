const ClientError = require('../../exceptions/ClientError');
const ResponseCreator = require('../../utils/ResponseCreator');
const ResponseMessage = require('../../utils/ResponseMessage');

class SongsService {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  async postSongHandler(request, h) {
    try {
      this._validator.validate(request.payload);
      const id = await this._service.addSong(request.payload);

      const data = { songId: id };
      return ResponseCreator.createResponseWithMessageAndData(
        h,
        ResponseMessage.success,
        'Song added succesfully',
        data,
      );
    } catch (error) {
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
    }
  }
}

module.exports = SongsService;
