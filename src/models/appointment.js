/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         service_id:
 *           type: integer
 *         date:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *         notes:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Appointment', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        service_id: { type: DataTypes.INTEGER, allowNull: false },
        date: { type: DataTypes.DATE, allowNull: false },
        status: { type: DataTypes.STRING, allowNull: false },
        notes: { type: DataTypes.TEXT, allowNull: true },
        created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    }, {
        tableName: 'appointments',
        timestamps: false,
    });
};