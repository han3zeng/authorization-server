const express = require('express');
const app = express();
const { authRouter } = require('./routers');
const { cors } = require('./middlewares');

app.use(cors);
app.use(express.json());
app.use('/auth', authRouter);

module.exports = app;
