const fs = require('fs');
const path = require('path');

const envFilePath = path.resolve(__dirname, './.env.json');

const file = fs.readFileSync(envFilePath);

const content = JSON.parse(file);

const result = `secrets=${JSON.stringify(content)}`;

fs.writeFileSync(path.resolve(__dirname, './.env'), result);
