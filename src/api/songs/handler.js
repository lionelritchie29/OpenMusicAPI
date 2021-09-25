const ResponseCreator = require('../../utils/ResponseCreator');
const ResponseMessage = require('../../utils/ResponseMessage');

class SongsService {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler({ payload }, h) {
    this._validator.validate(payload);
    const id = await this._service.addSong(payload);

    const data = { songId: id };
    return ResponseCreator.createResponseWithMessageAndData(
      h,
      ResponseMessage.success,
      'Song added succesfully',
      data,
      201,
    );
  }

  async getSongsHandler(_, h) {
    const songs = await this._service.getSongs();
    return ResponseCreator.createResponseWithData(h, ResponseMessage.success, {
      songs,
    });
  }

  async getSongByIdHandler({ params }, h) {
    const { songId } = params;
    const song = await this._service.getSongById(songId);
    return ResponseCreator.createResponseWithData(h, ResponseMessage.success, {
      song,
    });
  }

  async putSongByIdHandler({ payload, params }, h) {
    this._validator.validate(payload);
    const { songId } = params;
    await this._service.updateSongById(songId, payload);

    return ResponseCreator.createResponseWithMessage(
      h,
      ResponseMessage.success,
      'Song updated succesfully',
    );
  }

  async deleteSongByIdHandler({ params }, h) {
    const { songId } = params;
    await this._service.deleteSongById(songId);
    return ResponseCreator.createResponseWithMessage(
      h,
      ResponseMessage.success,
      'Song deleted succesfully',
    );
  }
}

module.exports = SongsService;
