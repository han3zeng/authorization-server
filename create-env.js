const fs = require('fs');
const path = require('path');

const tokenFilePath = path.resolve(__dirname, './token.json');
const envFilePath = path.resolve(__dirname, './.env.json');

const tokenJsonString = fs.readFileSync(tokenFilePath);
const envJsontring = fs.readFileSync(envFilePath);

const env = JSON.parse(envJsontring);
const token = JSON.parse(tokenJsonString);
env.token = token;

const result = `secrets=${JSON.stringify(env)}`;

fs.writeFileSync(path.resolve(__dirname, './.env'), result);
