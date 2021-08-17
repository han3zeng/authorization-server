const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  accessToken: String,
  refreshToken: String,
  scope: String,
  tokenType: String,
  idToken: String,
  sub: String,
  email: String,
  name: String,
  avatarURL: String,
  authorizationServer: String,
  password: String
}, {
  timestamps: {
    currentTime: () => {
      const timeOBJ = new Date();
      return timeOBJ.toUTCString();
    }
  }
});

module.exports = {
  key: 'User',
  schema: schema
};
