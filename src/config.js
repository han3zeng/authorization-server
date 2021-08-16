const constants = require('./constants');

module.exports = Object.freeze({
  nodeEnv: process.env.NODE_ENV,
  allowedOrigins: ['http://localhost:3000'],
  githubClientId: '3f488128d8bad7618828',
  clientOrigin: process.env.NODE_ENV === constants.production ? 'https:xxx' : 'http://localhost:3000',
  clientCallbackPath: 'login-callback'
});
