const nodemailer = require('nodemailer');
const { readFileSync } = require('fs');
const path = require('path');
const { gmailSecret } = process.env;

const TOKEN_PATH = path.resolve(__dirname, '../../token.json');
const tokenBinary = readFileSync(TOKEN_PATH);
const token = JSON.parse(tokenBinary);

const clientId = '1085091594760-3osdss6996tb3f4drohm41sv59ep6tfo.apps.googleusercontent.com';

const auth = {
  type: 'OAuth2',
  user: 'han3zeng@gmail.com',
  clientId,
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
