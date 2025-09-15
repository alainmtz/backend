const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('[AUTH] Token recibido:', token);
  if (!token) {
    console.log('[AUTH] Token requerido, no enviado');
    return res.status(401).json({ error: 'Token requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('[AUTH] Error al verificar token:', err);
      return res.status(403).json({ error: 'Token inválido' });
    }
    console.log('[AUTH] Usuario decodificado:', user);
    req.user = user;
    next();
  });
}


function authorizeRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    // req.user.roles puede ser array de strings o de objetos { name }
    const userRoles = Array.isArray(req.user.roles)
      ? req.user.roles.map(r => typeof r === 'string' ? r : r.name)
      : [req.user.role];
    const hasRole = roles.some(role => userRoles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRole };
