const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { githubSecret } = require('../../secrets');
const { userSchema } = require('../db/models');
const mongoose = require('mongoose');

// return type:
// accessToken: data.access_token,
// tokenType: data.token_type,
// scope: data.scope
async function fetchAccessToken ({
  code,
  clientID,
  redirectUri
}) {
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
    body: JSON.stringify({
      code,
      client_id: clientID,
      redirect_uri: redirectUri,
      client_secret: githubSecret
    })
  };
  const response = await fetch('https://github.com/login/oauth/access_token', options);
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
    avatarURL: data.avatar_url
  };
}

async function createUser (storeData) {
  const User = mongoose.model(userSchema.key, userSchema.schema);
  const { email } = storeData;
  const ifExisted = await User.exists({
    email
  });
  if (!ifExisted) {
    await User.create({
      ...storeData
    });
  } else {
    await User.updateOne({
      email
    }, {
      accessToken: storeData.accessToken
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
      redirectUri
    });
    const accessToken = data.access_token;
    if (accessToken) {
      userProfile = await fetchUserProfile({
        accessToken
      });
    }
    const storeData = {
      accessToken,
      ...userProfile
    };
    await createUser(storeData);
    res.status(200).json({
      accessToken
    });
  } catch (e) {
    console.log('e: ', e);
  }
});

module.exports = router;
