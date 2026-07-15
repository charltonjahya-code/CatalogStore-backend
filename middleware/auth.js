const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // 1. get the Authorization header
  const authHeader = req.headers.authorization;

  // 2. check it exists and starts with 'Bearer '
  //    if not → respond 401 "No token provided" (and return)

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({error: 'No token provided'});
  }

  // 3. extract the token (the part after 'Bearer ')
  const token = authHeader.split(' ')[1];

  // 4. verify the token, wrapped in try/catch:
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({error: 'Invalid token'});
  }
}

module.exports = authMiddleware;