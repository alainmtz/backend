const { Report, Finance } = require('../models');

// Genera y guarda un reporte financiero para un periodo
exports.generate = async (req, res) => {
  try {
    const { period } = req.body; // Ejemplo: '2025-09'
    // Obtén datos agregados de finanzas para el periodo
    const finances = await Finance.findAll({
      where: Finance.sequelize.where(
        Finance.sequelize.fn('DATE_FORMAT', Finance.sequelize.col('created_at'), '%Y-%m'),
        period
      )
    });
    // Ejemplo de agregación simple
    const total = finances.reduce((sum, f) => sum + parseFloat(f.amount), 0);
    const report = await Report.create({
      type: 'financiero',
      period,
      data: { total, count: finances.length }
    });
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lista reportes financieros
exports.list = async (req, res) => {
  try {
    const reports = await Report.findAll({ where: { type: 'financiero' } });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
