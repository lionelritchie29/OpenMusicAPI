const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const BadRequestError = require('../../exceptions/BadRequestError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();

    this.addSong = this.addSong.bind(this);
    this.getSongs = this.getSongs.bind(this);
    this.getSongById = this.getSongById.bind(this);
  }

  // eslint-disable-next-line object-curly-newline
  async addSong({ title, year, performer, genre, duration }) {
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: [
        id,
        title,
        year,
        performer,
        genre,
        duration,
        insertedAt,
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

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Song not found');
    }

    return rows[0];
  }
}

module.exports = SongsService;
