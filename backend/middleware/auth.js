const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Controlla che JWT_SECRET sia definito
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET non definito! Assicurati di averlo impostato correttamente.');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Prendi l'header Authorization in modo case-insensitive
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Rimuovi il prefisso "Bearer " se presente
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verifica il token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
