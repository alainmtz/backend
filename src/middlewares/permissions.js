// Middleware de permisos granulares por rol y endpoint
const rolesPermissions = {
  admin: [
    'GET:/api/users',
    'POST:/api/users',
    'PUT:/api/users',
    'DELETE:/api/users',
    'GET:/api/finances',
    'POST:/api/finances',
    'PUT:/api/finances',
    'DELETE:/api/finances',
    'GET:/api/reports',
    'POST:/api/reports',
    'GET:/api/notifications',
    'POST:/api/notifications',
    'POST:/api/notifications/:id/confirm',
    // ...otros endpoints
  ],
  staff: [
    'GET:/api/finances',
    'GET:/api/reports',
    'GET:/api/notifications',
    // ...otros endpoints
  ],
  developer: [
    'GET:/api/users',
    'GET:/api/finances',
    'GET:/api/reports',
    // ...otros endpoints
  ],
  vendedor: [
    'GET:/api/finances',
    'GET:/api/reports',
    // ...otros endpoints
  ]
};

function checkPermission(role, method, path) {
  const key = `${method}:${path}`;
  return rolesPermissions[role]?.includes(key);
}

module.exports = (req, res, next) => {
  const user = req.user; // Debe estar seteado por el middleware de autenticación
  if (!user || !user.role) return res.status(401).json({ error: 'No autenticado' });
  // Normaliza el path para coincidencia exacta
  const cleanPath = req.route?.path ? req.baseUrl + req.route.path : req.originalUrl;
  if (!checkPermission(user.role, req.method, cleanPath)) {
    return res.status(403).json({ error: 'Permiso denegado' });
  }
  next();
};
