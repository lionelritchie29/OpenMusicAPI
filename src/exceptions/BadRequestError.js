const ClientError = require('./ClientError');

class BadRequestError extends ClientError {
  constructor(message) {
    super(message);
    this.name = 'Bad Request Error';
  }
}

module.exports = BadRequestError;
