const express = require('express');
const router = express.Router();
const { v4 } = require('uuid');
const mongoose = require('mongoose');
const { pendingUserSchema, userSchema } = require('../db/models');
const { hashPassword, recreateHash, createAccessToken } = require('../utils/password-auth-code');
const { randomBytesSize } = require('../../secrets.js');
const uuidv4 = v4;
const { mailTransporter, createUser } = require('../utils');
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
  const User = mongoose.model(userSchema.key, userSchema.schema);
  const ifExisted = await PendingUser.exists({ email }) || await User.exists({ email });
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
          message: 'Something went wrong in mail system'
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

router.post('/sign-in', async function (req, res, next) {
  const { email, password } = req.body;
  const User = mongoose.model(userSchema.key, userSchema.schema);
  const user = await User.findOne({ email, authorizationServer: 'account' });
  if (user) {
    const { password: storedPassword, accessToken, sub } = user;
    const salt = storedPassword.slice(0, randomBytesSize * 2);
    const passwordHash = recreateHash({
      password,
      salt
    });
    if (passwordHash === storedPassword) {
      if (accessToken) {
        res.status(200).json({
          ok: true,
          accessToken
        });
      } else {
        const accessToken = createAccessToken(email);
        await User.updateOne({
          sub
        }, {
          accessToken
        });
        res.status(200).json({
          ok: true,
          message: 'Receive valid access token',
          accessToken
        });
      }
    } else {
      res.status(401).json({
        ok: false,
        message: 'Incorrect email or password word'
      });
    }
  } else {
    res.status(401).json({
      ok: false,
      message: 'Incorrect email or password email'
    });
  }
});

module.exports = router;
