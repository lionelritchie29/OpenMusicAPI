/* eslint-disable linebreak-style */
/* eslint-disable camelcase */

exports.shorthands = undefined;
const TABLE_NAME = 'collaborations';
const FK_COLLABORATIONS_PLAYLIST_ID = 'fk_collaborations.playlist_id';
const FK_COLLABORATIONS_USER_ID = 'fk_collaborations.user_id';

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
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint(
    TABLE_NAME,
    FK_COLLABORATIONS_PLAYLIST_ID,
    'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
    TABLE_NAME,
    FK_COLLABORATIONS_USER_ID,
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(TABLE_NAME, FK_COLLABORATIONS_PLAYLIST_ID);
  pgm.dropConstraint(TABLE_NAME, FK_COLLABORATIONS_USER_ID);
  pgm.dropTable(TABLE_NAME);
};
