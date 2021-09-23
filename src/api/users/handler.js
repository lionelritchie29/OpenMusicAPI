const ResponseCreator = require('../../utils/ResponseCreator');
const ResponseMessage = require('../../utils/ResponseMessage');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler({ payload }, h) {
    this._validator.validate(payload);

    const id = await this._service.addUser(payload);
    const data = { userId: id };
    return ResponseCreator.createResponseWithMessageAndData(
      h,
      ResponseMessage.success,
      'User berhasil ditambahkan',
      data,
      201,
    );
  }
}

module.exports = UsersHandler;
