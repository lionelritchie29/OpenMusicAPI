const ErrorHandler = require('../../utils/ErrorHandler');
const ResponseCreator = require('../../utils/ResponseCreator');
const ResponseMessage = require('../../utils/ResponseMessage');

class SongsService {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
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
        201,
      );
    } catch (error) {
      return ErrorHandler.handleError(h, error);
    }
  }

  async getSongsHandler(_, h) {
    const songs = await this._service.getSongs();
    return ResponseCreator.createResponseWithData(h, ResponseMessage.success, {
      songs,
    });
  }

  async getSongByIdHandler(request, h) {
    try {
      const { songId } = request.params;
      const song = await this._service.getSongById(songId);
      return ResponseCreator.createResponseWithData(
        h,
        ResponseMessage.success,
        {
          song,
        },
      );
    } catch (error) {
      return ErrorHandler.handleError(h, error);
    }
  }
}

module.exports = SongsService;
