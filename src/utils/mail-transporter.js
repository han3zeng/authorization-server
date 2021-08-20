const nodemailer = require('nodemailer');
const { gmailSecret, gmailClientId, token: tokenString } = process.env;

const token = JSON.parse(tokenString);

const auth = {
  type: 'OAuth2',
  user: 'han3zeng@gmail.com',
  clientId: gmailClientId,
  clientSecret: gmailSecret,
  refreshToken: token.refresh_token,
  accessToken: token.access_token,
  expires: 1628503545070
};

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth
});

module.exports = transporter;
