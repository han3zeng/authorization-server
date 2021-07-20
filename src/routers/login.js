const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { githubSecret } = require('../../secrets');

router.post('/github/access_token', async function (req, res, next) {
  const body = req.body;
  const { code, clientID, redirectUri } = body;
  const options = {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Accept': 'application/json',
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
  fetch('https://github.com/login/oauth/access_token', options)
    .then((response) => {
      response.json()
        .then((data) => {
          console.log('data: ', data);
        })
        .catch((err) => {
          console.log('err: ', err);
        });
    })
    .catch((err) => {
      console.log('err: ', err);
    });
});

module.exports = router;
