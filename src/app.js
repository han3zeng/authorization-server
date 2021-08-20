require('dotenv').config();
const express = require('express');
const app = express();
const { authRouter, accountRouter, testRouter } = require('./routers');
const { cors } = require('./middlewares');

app.use(cors);
app.use(express.json());
app.use('/test', testRouter);
app.use('/token', authRouter);
app.use('/account', accountRouter);

module.exports = app;
