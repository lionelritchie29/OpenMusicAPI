const ExportPlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (
    server,
    { messageProducerService, playlistsService, validator },
  ) => {
    const exportPlaylistsHandler = new ExportPlaylistsHandler(
      messageProducerService,
      playlistsService,
      validator,
    );
    server.route(routes(exportPlaylistsHandler));
  },
};
