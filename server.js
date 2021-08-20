const server = require('./src/app');
const port = process.env.PORT || 8080;
const db = require('./src/db');

db.connect()
  .then(() => {
    server.listen(port, () => {
      console.log(`the server is listening on port: ${port}`);
    });
  })
  .catch(() => {
    console.log('Oops, fail to start the server.');
  });
