const ResponseCreator = require('../../utils/ResponseCreator');
const ResponseMessage = require('../../utils/ResponseMessage');

class PlaylistsHandler {
  constructor(playlistsService, songsService, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;

    this.postPlaylistsHandler = this.postPlaylistsHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistsHandler = this.deletePlaylistsHandler.bind(this);
    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistSongHandler = this.getPlaylistSongHandler.bind(this);
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
  }

  async postPlaylistsHandler({ payload, auth }, h) {
    this._validator.validatePostPlaylistPayload(payload);
    const { id: ownerUserId } = auth.credentials;
    const { name } = payload;

    const id = await this._playlistsService.addPlaylist(name, ownerUserId);
    return ResponseCreator.createResponseWithMessageAndData(
      h,
      ResponseMessage.success,
      'Playlist berhasil ditambahkan',
      { playlistId: id },
      201,
    );
  }

  async getPlaylistsHandler({ auth }, h) {
    const { id: userId } = auth.credentials;
    const playlists = await this._playlistsService.getPlaylistsByUserId(userId);

    return ResponseCreator.createResponseWithData(h, ResponseMessage.success, {
      playlists,
    });
  }

  async deletePlaylistsHandler({ params, auth }, h) {
    const { playlistId } = params;
    const { id: userId } = auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, userId);
    await this._playlistsService.deletePlaylistById(playlistId);

    return ResponseCreator.createResponseWithMessage(
      h,
      ResponseMessage.success,
      'Playlist berhasil dihapus',
    );
  }

  async postPlaylistSongHandler({ payload, params, auth }, h) {
    this._validator.validatePostPlaylistSongPayload(payload);

    const { playlistId } = params;
    const { id: userId } = auth.credentials;
    const { songId } = payload;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    await this._songsService.verifySongExists(songId);
    await this._playlistsService.addSongToPlaylist(playlistId, songId);

    return ResponseCreator.createResponseWithMessage(
      h,
      ResponseMessage.success,
      'Lagu berhasil ditambahkan ke playlist',
      201,
    );
  }

  async getPlaylistSongHandler({ params, auth }, h) {
    const { id: userId } = auth.credentials;
    const { playlistId } = params;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    const songs = await this._songsService.getSongByPlaylistId(playlistId);

    return ResponseCreator.createResponseWithData(h, ResponseMessage.success, {
      songs,
    });
  }

  async deletePlaylistSongHandler({ payload, params, auth }, h) {
    this._validator.validatePostPlaylistSongPayload(payload);

    const { playlistId } = params;
    const { id: userId } = auth.credentials;
    const { songId } = payload;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    await this._songsService.verifySongExists(songId);
    await this._playlistsService.deleteSongFromPlaylist(playlistId, songId);

    return ResponseCreator.createResponseWithMessage(
      h,
      ResponseMessage.success,
      'Lagu berhasil dihapus dari playlist',
    );
  }
}

module.exports = PlaylistsHandler;
