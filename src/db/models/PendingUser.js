const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  authorizationCode: String,
  email: String,
  password: String,
  username: String
}, {
  timestamps: {
    currentTime: () => {
      const timeOBJ = new Date();
      return timeOBJ.toUTCString();
    }
  }
});

module.exports = {
  key: 'PendingUser',
  schema: schema
};
