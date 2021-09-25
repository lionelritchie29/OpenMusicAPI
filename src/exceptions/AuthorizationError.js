const ClientError = require('./ClientError');

class AuthorizationError extends ClientError {
  constructor(message) {
    super(message, 403);
    this.name = 'Authentication Error';
  }
}

module.exports = AuthorizationError;
