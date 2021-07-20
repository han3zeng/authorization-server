const server = require('./src/app');
const port = process.env.PORT;

server.listen(port, () => {
  console.log(`the server is listening on port: ${port}`);
});
