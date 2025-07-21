const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(403);

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name,
    };

    console.log('🔍 req.user:', req.user); 

    next();
  } catch (err) {
    console.error('❌ Error al verificar JWT:', err.message);
    return res.sendStatus(403);
  }
};

module.exports = verifyJWT;
