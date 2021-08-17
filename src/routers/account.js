const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { v4 } = require('uuid');
const mongoose = require('mongoose');
const { pendingUserSchema } = require('../db/models');
const { hashPassword } = require('../utils/password-auth-code');
const uuidv4 = v4;
const { mailTransporter } = require('../utils');
const { clientOrigin, clientCallbackPath } = require('../config');

router.post('/authorize', async function (req, res, next) {
  const body = req.body;
  const {
    email,
    password,
    username
  } = body;
  const authorizationCode = uuidv4();
  const PendingUser = mongoose.model(pendingUserSchema.key, pendingUserSchema.schema);
  const ifExisted = await PendingUser.exists({
    email
  });
  if (!ifExisted) {
    await PendingUser.create({
      username,
      email,
      password: hashPassword(password),
      authorizationCode
    });

    const params = new URLSearchParams([
      ['code', authorizationCode],
      ['state', encodeURIComponent(JSON.stringify({ service: 'account' }))]
    ]);
    const url = `${clientOrigin}/${clientCallbackPath}?${params.toString()}`;

    mailTransporter.sendMail({
      from: 'han3zeng@gmail.com',
      to: email,
      subject: 'Auth Code send by han3zeng service',
      text: `please click on the following url to initate your account and login: ${url}`
    }, (err, info) => {
      if (err) {
        res.status(200).json({
          ok: false,
          error: err,
          message: 'Something went wrong during sending mail'
        });
        next();
      } else {
        res.status(200).json({
          ok: true,
          message: 'Receive auth code successfully'
        });
      }
    });
  } else {
    res.status(200).json({
      ok: false,
      message: 'The mail has been used to sign up'
    });
  }
});

module.exports = router;
