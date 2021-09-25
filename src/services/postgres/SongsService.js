const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const BadRequestError = require('../../exceptions/BadRequestError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, performer, genre, duration }) {
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, insertedAt],
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

  async getSongByPlaylistId(playlistId) {
    const query = {
      text: 'SELECT songs.id, title, performer FROM songs JOIN playlistsongs ON songs.id = playlistsongs.song_id WHERE playlist_id = $1',
      values: [playlistId],
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }

  async updateSongById(id, { title, year, performer, genre, duration }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, "updatedAt" = $6 WHERE id = $7',
      values: [title, year, performer, genre, duration, updatedAt, id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Failed when updating song. Song Id not found');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Error when deleting song. Song Id not found');
    }
  }

  async verifySongExists(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new BadRequestError('Song does not exist');
    }
  }
}

module.exports = SongsService;
