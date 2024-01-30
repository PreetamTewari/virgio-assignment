const { verifyToken } = require('../utils/jwtUtils');

const authMiddleware = (req, res, next) => {
  let token = req.headers.authorization;
  token = token ? token.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  try {
    const decoded = verifyToken(token);
    // console.log(decoded);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

module.exports = authMiddleware;
