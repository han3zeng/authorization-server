require('dotenv').config();
const mongoose = require('mongoose');
// keepAlive prevent TCP connection from closing because of idle status.
const connectOptions = {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useNewUrlParser: true
};

function connect () {
  return new Promise((resolve, reject) => {
    mongoose.connect(process.env.MONGO_URI, connectOptions, (err, db) => {
      if (err) {
        console.log('have problem connecting to mongoDb: ', err);
        reject(err);
        return;
      }
      console.log('connect to mongoDb successfullly');
      resolve();
    });
  });
}

function close () {
  return mongoose.disconnect();
}

module.exports = {
  connect,
  close
};
