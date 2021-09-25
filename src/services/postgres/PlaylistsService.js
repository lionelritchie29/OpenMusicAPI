const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const BadRequestError = require('../../exceptions/BadRequestError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist(name, ownerUserId) {
    const id = `playlist-${nanoid()}`;
    const query = {
      text: 'INSERT INTO playlists VALUES ($1, $2, $3) returning id',
      values: [id, name, ownerUserId],
    };

    const { rows } = await this._pool.query(query);
    if (!rows.length || !rows[0].id) {
      return new BadRequestError('Failed when adding new playlist');
    }

    return rows[0].id;
  }
}

module.exports = PlaylistsService;
