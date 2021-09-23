const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const BadRequestError = require('../../exceptions/BadRequestError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    await this._verifyUsername(username);

    const id = `user-${nanoid()}`;
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, password, fullname],
    };

    const { rows } = await this._pool.query(query);

    if (!rows || rows.length === 0) {
      throw new BadRequestError('Failed when adding new user');
    }

    return rows[0].id;
  }

  async _verifyUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);
    if (result.rowCount > 0) {
      throw new BadRequestError('Username already exists');
    }
  }
}

module.exports = UsersService;
