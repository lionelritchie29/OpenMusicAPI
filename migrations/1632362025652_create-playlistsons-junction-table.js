const TABLE_NAME = 'playlistsongs';
const FK_PLAYLISTSONGS_PLAYLIST_ID = 'fk_playlistsongs.playlist_id';
const FK_PLAYLISTSONGS_SONG_ID = 'fk_playlistsongs.song_id';

exports.up = (pgm) => {
  pgm.createTable(TABLE_NAME, {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint(
    TABLE_NAME,
    FK_PLAYLISTSONGS_PLAYLIST_ID,
    'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
    TABLE_NAME,
    FK_PLAYLISTSONGS_SONG_ID,
    'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(TABLE_NAME, FK_PLAYLISTSONGS_PLAYLIST_ID);
  pgm.dropConstraint(TABLE_NAME, FK_PLAYLISTSONGS_SONG_ID);
  pgm.dropTable(TABLE_NAME);
};
