const TABLE_NAME = 'playlists';
const FK_PLAYLISTS_OWNER = 'fk_playlists.owner';

exports.up = (pgm) => {
  pgm.createTable(TABLE_NAME, {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint(
    TABLE_NAME,
    FK_PLAYLISTS_OWNER,
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(TABLE_NAME, FK_PLAYLISTS_OWNER);
  pgm.dropTable(TABLE_NAME);
};
