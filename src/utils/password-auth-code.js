const crypto = require('crypto');
const randomBytesSize = +process.env.randomBytesSize;
const iterations = +process.env.iterations;

const hashPassword = (password) => {
  const { randomBytes, pbkdf2Sync } = crypto;
  const salt = randomBytes(randomBytesSize).toString('hex');
  const hash = pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');
  return `${salt}${hash}`;
};

const recreateHash = ({
  password,
  salt
}) => {
  const { pbkdf2Sync } = crypto;
  const hash = pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');
  return `${salt}${hash}`;
};

const createAccessToken = (email) => {
  const { randomBytes, pbkdf2Sync } = crypto;
  const salt = randomBytes(randomBytesSize).toString('hex');
  const hash = pbkdf2Sync(email, salt, iterations, 64, 'sha512').toString('hex');
  return `${salt}${hash}`;
};

module.exports = {
  hashPassword,
  recreateHash,
  createAccessToken
};
