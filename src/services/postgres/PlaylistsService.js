const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const BadRequestError = require('../../exceptions/BadRequestError');
const StringUtils = require('../../utils/StringUtils');

class PlaylistsService {
  constructor(collabService, cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
    this._collabService = collabService;
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

    await this._deletePlaylistCache(ownerUserId);
    return rows[0].id;
  }

  async getPlaylistsByUserId(userId) {
    const cacheKey = StringUtils.getPlaylistCacheKey(userId);

    try {
      const playlists = await this._cacheService.get(cacheKey);
      return JSON.parse(playlists);
    } catch (error) {
      const query = {
        text: `SELECT playlists.id, name, username FROM playlists 
                LEFT JOIN users ON users.id = playlists.owner 
                LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id 
                WHERE owner = $1 OR collaborations.user_id = $1 GROUP BY playlists.id, name, username`,
        values: [userId],
      };

      const { rows } = await this._pool.query(query);

      await this._cacheService.set(cacheKey, JSON.stringify(rows));
      return rows;
    }
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 returning owner',
      values: [id],
    };

    const { rows } = await this._pool.query(query);
    if (!rows.length) {
      throw new BadRequestError('Failed when deleting playlist');
    }

    await this._deletePlaylistCache(rows[0].owner);
  }

  async verifyPlaylistOwner(playlistId, userId) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1 AND owner = $2',
      values: [playlistId, userId],
    };

    const { rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new AuthorizationError(
        'The playlist does not belong to the specified user',
      );
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      await this._collabService.verifyCollaborator(playlistId, userId);
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

    await this._deletePlaylistSongCache(playlistId);
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };

    const { rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new BadRequestError('Failed when deleting song from playlist');
    }

    await this._deletePlaylistSongCache(playlistId);
  }

  async _deletePlaylistCache(ownerUserId) {
    const cacheKey = StringUtils.getPlaylistCacheKey(ownerUserId);
    await this._cacheService.delete(cacheKey);
  }

  async _deletePlaylistSongCache(playlistId) {
    const cacheKey = StringUtils.getPlaylistSongCacheKey(playlistId);
    await this._cacheService.delete(cacheKey);
  }
}

module.exports = PlaylistsService;
