const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const BadRequestError = require('../../exceptions/BadRequestError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
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

  async verifyCollaborator(playlistId, collaboratorUserId) {
    const query = {
      text: 'SELECT * FROM collaboratos WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, collaboratorUserId],
    };

    const { rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new AuthorizationError('Collaborator not exists');
    }
  }
}

module.exports = CollaborationsService;
