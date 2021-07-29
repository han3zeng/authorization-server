const getPaylodFromJWT = ({
  jwt
}) => {
  const base64string = jwt.split('.')[1];
  const bufferObj = Buffer.from(base64string, 'base64');
  return JSON.parse(bufferObj.toString('utf8'));
};

module.exports = {
  getPaylodFromJWT
};
