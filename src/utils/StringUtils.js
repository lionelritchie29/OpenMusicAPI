const StringUtils = {
  getPlaylistCacheKey: (ownerUserId) => `playlists:${ownerUserId}`,
  getPlaylistSongCacheKey: (playlistId) => `playlist-songs:${playlistId}`,
  getSongCacheKey: (songId) => `songs:${songId}`,
};

module.exports = StringUtils;
