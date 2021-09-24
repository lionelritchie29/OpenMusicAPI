const ResponseCreator = require('../../utils/ResponseCreator');
const ResponseMessage = require('../../utils/ResponseMessage');

class AuthenticationsHandler {
  constructor(authService, userService, tokenManager, validator) {
    this._authService = authService;
    this._userService = userService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler({ payload }, h) {
    this._validator.validatePostAuthenticationPayload(payload);

    const id = await this._userService.verifyUserCredential(payload);
    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    await this._authService.saveRefreshToken(refreshToken);

    const data = { accessToken, refreshToken };
    return ResponseCreator.createResponseWithMessageAndData(
      h,
      ResponseMessage.success,
      'Authentication berhasil ditambahkan',
      data,
      201,
    );
  }

  async putAuthenticationHandler({ payload }, h) {
    this._validator.validatePutAuthenticationPayload(payload);

    const { refreshToken } = payload;
    await this._authService.verifyRefreshToken(refreshToken);
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = this._tokenManager.generateAccessToken({ id });

    return ResponseCreator.createResponseWithMessageAndData(
      h,
      ResponseMessage.success,
      'Authentication berhasil diperbarui',
      { accessToken },
    );
  }

  async deleteAuthenticationHandler({ payload }, h) {
    this._validator.validateDeleteAuthenticationPayload(payload);

    const { refreshToken } = payload;
    await this._authService.verifyRefreshToken(refreshToken);
    await this._authService.deleteRefreshToken(refreshToken);

    return ResponseCreator.createResponseWithMessage(
      h,
      ResponseMessage.success,
      'Refresh token berhasil dihapus',
    );
  }
}

module.exports = AuthenticationsHandler;
