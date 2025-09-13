/**
 * @swagger
 * components:
 *   schemas:
 *     PasswordReset:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         token:
 *           type: string
 *         expires_at:
 *           type: string
 *           format: date-time
 *         used:
 *           type: boolean
 */

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('PasswordReset', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    token: { type: DataTypes.STRING, allowNull: false },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    used: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  }, {
    tableName: 'password_resets',
    timestamps: false,
  });
};