/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         type:
 *           type: string
 *           description: Tipo de notificación (email, whatsapp, app)
 *         message:
 *           type: string
 *         status:
 *           type: string
 *           description: Estado (pendiente, enviada, fallida, leída)
 *         created_at:
 *           type: string
 *           format: date-time
 */

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Notification', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pendiente' },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'notifications',
    timestamps: false,
  });
};