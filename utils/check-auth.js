const { AuthenticationError } = require('apollo-server');
const JWT = require('jsonwebtoken');

module.exports = (context) => {
  const SECRET = process.env.JWT_SECRET;
  const authHeader = context.req.headers.authorization;
  if (!authHeader) throw new AuthenticationError('you are not authorized');

  const token = authHeader.split('Bearer ')[1];

  if (!authHeader) throw new AuthenticationError('you are not authorized');

  try {
    const user = JWT.verify(token, SECRET);
    return user;
  } catch (error) {
    throw new AuthenticationError(error);
  }
};
