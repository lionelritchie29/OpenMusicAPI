const ResponseCreator = require('../../utils/ResponseCreator');
const ResponseMessage = require('../../utils/ResponseMessage');

class UploadHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadPictureHandler = this.postUploadPictureHandler.bind(this);
  }

  async postUploadPictureHandler({ payload }, h) {
    const { data } = payload;
    this._validator.validateImageHeaders(data.hapi.headers);

    const filename = await this._service.writeFile(data, data.hapi);
    const filePath = `http://${process.env.HOST}:${process.env.PORT}/pictures/${filename}`;

    return ResponseCreator.createResponseWithMessageAndData(
      h,
      ResponseMessage.success,
      'Gambar berhasil diunggah',
      { pictureUrl: filePath },
      201,
    );
  }
}

module.exports = UploadHandler;
