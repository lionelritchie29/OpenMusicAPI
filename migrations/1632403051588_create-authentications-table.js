const TABLE_NAME = 'authentications';

exports.up = (pgm) => {
  pgm.createTable(TABLE_NAME, {
    token: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable(TABLE_NAME);
};
