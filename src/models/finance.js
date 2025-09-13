/**
 * @swagger
 * components:
 *   schemas:
 *     Finance:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         role_id:
 *           type: integer
 *         type:
 *           type: string
 *           enum: [ingreso, egreso, venta, compra, gasto, transferencia]
 *         amount:
 *           type: number
 *           format: float
 *         currency:
 *           type: string
 *         description:
 *           type: string
 *         reference_id:
 *           type: integer
 *         reference_type:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Finance = sequelize.define('Finance', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        type: {
            type: DataTypes.ENUM('ingreso','egreso','venta','compra','gasto','transferencia'),
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(12,2),
            allowNull: false,
        },
        currency: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'MXN',
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        reference_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        reference_type: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    }, {
        tableName: 'Finances',
        timestamps: false,
        underscored: true,
    });
    return Finance;
};