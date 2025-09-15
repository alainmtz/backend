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
    // Permisos para items
    'GET:/api/items',
    'POST:/api/items',
    'PUT:/api/items',
    'DELETE:/api/items',
    'GET:/api/items/:id',
    'PUT:/api/items/:id',
    'DELETE:/api/items/:id',
    'POST:/api/items/upload',
    'GET:/api/items/recommendations',
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


// Coincidencia flexible: ignora slash final y permite parámetros
function matchPath(permPath, reqPath) {
  // Quita slash final
  const cleanPerm = permPath.replace(/\/$/, '');
  const cleanReq = reqPath.replace(/\/$/, '');
  // Reemplaza :param por regex
  const regex = new RegExp('^' + cleanPerm.replace(/:[^/]+/g, '[^/]+') + '$');
  return regex.test(cleanReq);
}

function checkPermission(role, method, path) {
  const perms = rolesPermissions[role] || [];
  return perms.some(perm => {
    const [permMethod, permPath] = perm.split(':');
    return permMethod === method && matchPath(permPath, path);
  });
}

module.exports = (req, res, next) => {
  const user = req.user; // Debe estar seteado por el middleware de autenticación
  if (!user || (!user.role && !user.roles)) return res.status(401).json({ error: 'No autenticado' });
  // Normaliza el path para coincidencia flexible
  const cleanPath = req.baseUrl + (req.route?.path || '');
  // Soporta roles como string o array
  const userRoles = Array.isArray(user.roles)
    ? user.roles.map(r => typeof r === 'string' ? r : r.name)
    : user.role ? [user.role] : [];
  const hasPermission = userRoles.some(role => checkPermission(role, req.method, cleanPath));
  if (!hasPermission) {
    return res.status(403).json({ error: 'Permiso denegado' });
  }
  next();
};
