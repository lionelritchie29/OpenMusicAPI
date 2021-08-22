const ClientError = require('../../exceptions/ClientError');

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

      const response = h.response({
        status: 'success',
        message: 'Song added succesfully',
        data: {
          songId: id,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(500);
      return response;
    }
  }
}

module.exports = SongsService;
