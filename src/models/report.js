/**
 * @swagger
 * components:
 *   schemas:
 *     Report:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         type:
 *           type: string
 *           description: Tipo de reporte (financiero, inventario, etc)
 *         period:
 *           type: string
 *           description: Periodo del reporte (ej: 2025-09)
 *         data:
 *           type: object
 *           description: Datos agregados del reporte
 *         created_at:
 *           type: string
 *           format: date-time
 */

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Report', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    type: { type: DataTypes.STRING, allowNull: false },
    period: { type: DataTypes.STRING, allowNull: false },
    data: { type: DataTypes.JSON, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'reports',
    timestamps: false,
  });
};