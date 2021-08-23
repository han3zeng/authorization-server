const constants = require('./constants');

module.exports = Object.freeze({
  nodeEnv: process.env.NODE_ENV,
  allowedOrigins: ['http://localhost:3000', 'https://react-playground-7kgn6zbeya-uc.a.run.app'],
  clientOrigin: process.env.NODE_ENV === constants.production ? 'https://react-playground-7kgn6zbeya-uc.a.run.app' : 'http://localhost:3000',
  clientCallbackPath: 'login-callback'
});
