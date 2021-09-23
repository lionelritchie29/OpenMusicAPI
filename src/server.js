require('dotenv').config();
const Hapi = require('@hapi/hapi');

const songsPlugin = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const ErrorHandler = require('./utils/ErrorHandler');
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

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      return ErrorHandler.handleError(h, response);
    }

    return response.continue || response;
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
