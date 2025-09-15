const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');

// Ruta protegida para dashboard
const models = require('../models');
const { Finance, Project, Transaction, Report, User, Role, UserRole } = models;

router.get('/', authenticateToken, async (req, res) => {
  try {
    // Datos agregados
    const financesCount = await Finance.count();
    const financesTotal = await Finance.sum('amount');
    const projectsCount = await Project.count();
    const transactionsCount = await Transaction.count();
    const reportsCount = await Report.count();

    // Usuarios agrupados por roles
    const roles = await Role.findAll();
    const usersByRole = {};
    for (const role of roles) {
      const userRoles = await UserRole.findAll({ where: { role_id: role.id } });
      usersByRole[role.name] = userRoles.length;
    }

    res.json({
      user: req.user,
      stats: {
        finances: { count: financesCount, total: financesTotal },
        projects: { count: projectsCount },
        transactions: { count: transactionsCount },
        reports: { count: reportsCount },
        usersByRole
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener datos del dashboard', details: err.message });
  }
});

module.exports = router;
