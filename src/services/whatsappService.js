// Servicio para enviar notificaciones por WhatsApp
// Requiere una integración real con la API de WhatsApp Business (ejemplo: Twilio, Meta API)

const sendWhatsApp = async ({ to, message }) => {
  // Aquí iría la integración real con la API de WhatsApp
  // Ejemplo con Twilio o Meta API
  console.log(`Enviando WhatsApp a ${to}: ${message}`);
  // Simulación de éxito
  return { success: true };
};

module.exports = { sendWhatsApp };
