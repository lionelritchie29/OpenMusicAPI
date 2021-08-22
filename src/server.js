require('dotenv').config();
const Hapi = require('@hapi/hapi');

const songsPlugin = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validators/songs');

const init = async () => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: songsPlugin,
    options: {
      service: new SongsService(),
      validator: SongsValidator,
    },
  });

  await server.start();
  console.log(`Server is running on ${server.info.uri}`);
};

init();
