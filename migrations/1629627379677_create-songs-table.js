/* eslint-disable linebreak-style */
/* eslint-disable camelcase */

const TABLE_NAME = 'songs';

exports.up = (pgm) => {
  pgm.createTable(TABLE_NAME, {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    year: {
      type: 'integer',
      notNull: true,
    },
    performer: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    genre: {
      type: 'VARCHAR(30)',
      notNull: true,
    },
    duration: {
      type: 'integer',
      notNull: true,
    },
    insertedAt: {
      type: 'TEXT',
      notNull: true,
    },
    updatedAt: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable(TABLE_NAME);
};
