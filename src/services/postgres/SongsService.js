const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const BadRequestError = require('../../exceptions/BadRequestError');

class SongsService {
  constructor() {
    this._pool = new Pool();

    this.addSong = this.addSong.bind(this);
  }

  // eslint-disable-next-line object-curly-newline
  async addSong({ title, year, performer, genre, duration }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: [
        id,
        title,
        year,
        performer,
        genre,
        duration,
        createdAt,
        updatedAt,
      ],
    };

    const { rows } = await this._pool.query(query);

    if (rows.length === 0 || !rows[0].id) {
      throw new BadRequestError('Failed when adding new song');
    }

    return rows[0].id;
  }

  async getSongs() {
    const { rows } = await this._pool.query('SELECT * FROM songs');
    return rows.map((row) => {
      const { id, title, performer } = row;
      return { id, title, performer };
    });
  }
}

module.exports = SongsService;
