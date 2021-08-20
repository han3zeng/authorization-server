const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { userSchema, pendingUserSchema } = require('../db/models');
const mongoose = require('mongoose');
const { getPaylodFromJWT } = require('../utils');
const { createAccessToken } = require('../utils/password-auth-code');

const { githubSecret, googleSecret } = process.env;
// return type:
// accessToken: data.access_token,
// tokenType: data.token_type,
// scope: data.scope
async function fetchAccessToken ({
  code,
  clientID,
  redirectUri,
  service
}) {
  const url = (() => {
    switch (service) {
      case 'github':
        return 'https://github.com/login/oauth/access_token';
      case 'google':
        return 'https://oauth2.googleapis.com/token';
      default:
        return '';
    }
  })();

  const body = (() => {
    const base = {
      code,
      client_id: clientID,
      redirect_uri: redirectUri
    };
    if (service === 'github') {
      return {
        ...base,
        client_secret: githubSecret
      };
    }
    if (service === 'google') {
      return {
        ...base,
        grant_type: 'authorization_code',
        client_secret: googleSecret
      };
    }
  })();

  const options = {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(body)
  };
  const response = await fetch(url, options);
  const data = await response.json();
  return data;
}

async function fetchUserProfile ({
  accessToken
}) {
  const options = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      Accept: 'application/json',
      Authorization: `token ${accessToken}`
    }
  };
  const response = await fetch('https://api.github.com/user', options);
  const data = await response.json();
  return {
    name: data.name,
    email: data.email,
    avatarURL: data.avatar_url,
    sub: data.id
  };
}

async function createUser (storeData) {
  const User = mongoose.model(userSchema.key, userSchema.schema);
  const { sub } = storeData;
  const ifExisted = await User.exists({
    sub
  });
  if (!ifExisted) {
    await User.create({
      ...storeData
    });
  } else {
    await User.updateOne({
      sub
    }, {
      ...storeData
    });
  }
}

router.post('/github', async function (req, res, next) {
  const body = req.body;
  const { code, clientID, redirectUri } = body;
  try {
    let userProfile = null;
    const data = await fetchAccessToken({
      code,
      clientID,
      redirectUri,
      service: 'github'
    });
    const accessToken = data.access_token;
    if (accessToken) {
      userProfile = await fetchUserProfile({
        accessToken
      });
    }
    const storeData = {
      accessToken,
      tokenType: data.token_type,
      scope: data.scope,
      ...userProfile,
      authorizationServer: 'github'
    };
    await createUser(storeData);
    res.status(200).json({
      ok: true,
      accessToken
    });
  } catch (e) {
    res.status(200).json({
      ok: false,
      message: 'invalid auth code'
    });
    console.log('e: ', e);
  }
});

router.post('/google', async function (req, res, next) {
  const body = req.body;
  const { code, clientID, redirectUri } = body;
  try {
    const data = await fetchAccessToken({
      code,
      clientID,
      redirectUri,
      service: 'google'
    });
    const {
      access_token: accessToken,
      expires_in: expiresIn,
      refresh_token: refreshToken,
      scope,
      token_type: tokenType,
      id_token: idToken
    } = data;
    const userInfo = getPaylodFromJWT({ jwt: idToken });
    const {
      sub,
      email,
      name,
      picture: avatarURL
    } = userInfo;
    const storeData = {
      accessToken,
      refreshToken,
      scope,
      tokenType,
      idToken,
      sub,
      email,
      name,
      avatarURL,
      authorizationServer: 'google'
    };
    await createUser(storeData);
    res.status(200).json({
      ok: true,
      accessToken
    });
  } catch (e) {
    res.status(200).json({
      ok: false,
      message: 'invalid auth code'
    });
  }
});

router.post('/account', async function (req, res, next) {
  const { code } = req.body;
  const PendingUserSchema = mongoose.model(pendingUserSchema.key, pendingUserSchema.schema);
  const pendingUser = await PendingUserSchema.findOneAndDelete({ authorizationCode: code });
  if (!pendingUser) {
    res.status(200).json({
      ok: false,
      message: 'Invalid auth code'
    });
    return;
  }
  const {
    _id,
    username,
    email,
    password
  } = pendingUser;
  const accessToken = createAccessToken(email);
  const storeData = {
    sub: _id,
    accessToken,
    tokenType: 'Bearer',
    authorizationServer: 'account',
    email,
    name: username,
    avatarURL: null,
    password
  };
  await createUser(storeData);
  res.status(200).json({
    ok: true,
    accessToken
  });
});

module.exports = router;
