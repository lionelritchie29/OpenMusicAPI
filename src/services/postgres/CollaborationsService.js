const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const BadRequestError = require('../../exceptions/BadRequestError');
const StringUtils = require('../../utils/StringUtils');

class CollaborationsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addCollaborator(playlistId, collaboratorUserId) {
    const id = `collab-${nanoid()}`;
    const query = {
      text: 'INSERT INTO collaborations VALUES ($1, $2, $3) returning id',
      values: [id, playlistId, collaboratorUserId],
    };

    const { rows } = await this._pool.query(query);
    if (!rows.length) {
      throw new BadRequestError(
        'Failed when adding new collaborator to the playlist',
      );
    }

    return rows[0].id;
  }

  async deleteCollaborator(playlistId, collaboratorUserId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, collaboratorUserId],
    };

    const { rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new BadRequestError('Failed when removing collaborator');
    }

    const cacheKey = StringUtils.getPlaylistCacheKey(collaboratorUserId);
    await this._cacheService.delete(cacheKey);
  }

  async verifyCollaborator(playlistId, collaboratorUserId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, collaboratorUserId],
    };

    const { rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new AuthorizationError('Collaborator not exists');
    }
  }
}

module.exports = CollaborationsService;
