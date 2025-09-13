// Servicio básico de envío de emails (simulado)
// Para producción, integra nodemailer o un servicio externo

async function sendEmail({ to, subject, text }) {
  // Aquí iría la integración real con nodemailer, SendGrid, etc.
  console.log(`Enviando email a ${to}: ${subject}\n${text}`);
  // Simulación de éxito
  return { success: true };
}

module.exports = { sendEmail };
