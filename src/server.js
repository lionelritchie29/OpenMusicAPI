require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const ErrorHandler = require('./utils/ErrorHandler');

// Songs
const songsPlugin = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validators/songs');

// Users
const usersPlugin = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validators/users');

// Authentications
const authPlugin = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const AuthenticationsValidator = require('./validators/authentications');
const TokenManager = require('./helper/TokenManager');

// Playlists
const playlistPlugin = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validators/playlists');

// Collaborations
const collabPlugin = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validators/collaborations');

// Export Playlists
const exportPlugin = require('./api/exports');
const MessageProducerService = require('./services/rabbitmq/MessageProducerService');
const ExportPlaylistsValidator = require('./validators/exports');

const init = async () => {
  const usersService = new UsersService();
  const songsService = new SongsService();
  const collabService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collabService);

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

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: songsPlugin,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: usersPlugin,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authPlugin,
      options: {
        authService: new AuthenticationsService(),
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlistPlugin,
      options: {
        playlistsService,
        songsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collabPlugin,
      options: {
        collaborationsService: collabService,
        playlistsService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: exportPlugin,
      options: {
        messageProducerService: MessageProducerService,
        playlistsService,
        validator: ExportPlaylistsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server is running on ${server.info.uri}`);
};

init();
