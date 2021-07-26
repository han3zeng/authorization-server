const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  accessToken: String,
  email: String,
  name: String,
  avatarURL: String
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
