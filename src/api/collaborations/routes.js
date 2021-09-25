const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.postCollaborationsHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
