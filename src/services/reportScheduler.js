const cron = require('node-cron');
const { Report, Finance } = require('../models');
const { sendWhatsApp } = require('./whatsappService');

// Automatiza la generación y envío de reportes financieros cada mes
cron.schedule('0 8 1 * *', async () => {
  const now = new Date();
  const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  // Obtén datos agregados de finanzas para el periodo
  const finances = await Finance.findAll({
    where: Finance.sequelize.where(
      Finance.sequelize.fn('DATE_FORMAT', Finance.sequelize.col('created_at'), '%Y-%m'),
      period
    )
  });
  const total = finances.reduce((sum, f) => sum + parseFloat(f.amount), 0);
  const report = await Report.create({
    type: 'financiero',
    period,
    data: { total, count: finances.length }
  });
  // Envía el reporte por WhatsApp a todos los admins
  const { User } = require('../models');
  const admins = await User.findAll({ where: { role: 'admin' } });
  for (const admin of admins) {
    if (admin.phone) {
      await sendWhatsApp({
        to: admin.phone,
        message: `Reporte financiero mensual (${period}): Total: $${total}, Movimientos: ${finances.length}`
      });
    }
  }
  console.log(`Reporte financiero mensual generado y enviado (${period})`);
});
