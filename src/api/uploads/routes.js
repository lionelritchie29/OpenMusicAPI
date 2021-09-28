const path = require('path');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/upload/pictures',
    handler: handler.postUploadPictureHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 500000,
      },
    },
  },
  {
    method: 'GET',
    path: '/pictures/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'uploaded/pictures'),
      },
    },
  },
];

module.exports = routes;
