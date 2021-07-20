const express = require('express');
const app = express();
const { loginRouter } = require('./routers');
const { cors } = require('./middlewares');

app.use(cors);
app.use(express.json());
app.use('/login/oauth', loginRouter);

module.exports = app;
