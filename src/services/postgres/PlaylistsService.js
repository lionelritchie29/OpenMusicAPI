const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
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

  async getPlaylistsByUserId(userId) {
    const query = {
      text: 'SELECT playlists.id, name, username FROM playlists JOIN users ON users.id = playlists.owner WHERE owner = $1',
      values: [userId],
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }

  async verifyPlaylistOwner(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1 AND owner = $2',
      values: [playlistId, userId],
    };

    const { rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new AuthorizationError(
        'The playlist does not belong to the specified user',
      );
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `playlist-song-${nanoid()}`;

    const query = {
      text: 'INSERT INTO playlistsongs VALUES ($1, $2, $3)',
      values: [id, playlistId, songId],
    };

    const { rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new BadRequestError('Failed when adding song to the playlist.');
    }
  }
}

module.exports = PlaylistsService;
