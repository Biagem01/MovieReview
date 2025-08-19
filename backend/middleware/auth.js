const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Prendi l'header Authorization in modo case-insensitive
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Rimuovi il prefisso "Bearer " se presente
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7, authHeader.length) : authHeader;
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verifica il token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
