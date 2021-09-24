const { Pool } = require('pg');
const BadRequestError = require('../../exceptions/BadRequestError');

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  async saveRefreshToken(refreshToken) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [refreshToken],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(refreshToken) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [refreshToken],
    };

    const { rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new BadRequestError('Refresh token does not exist');
    }
  }

  async deleteRefreshToken(refreshToken) {
    await this.verifyRefreshToken(refreshToken);

    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [refreshToken],
    };

    await this._pool.query(query);
  }
}

module.exports = AuthenticationsService;
