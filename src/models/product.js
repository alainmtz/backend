/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *           format: float
 *         category:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         stock:
 *           type: integer
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Product', {
        name: {
            type: DataTypes.STRING(120),
            allowNull: false,
            validate: { notEmpty: true }
        },
        description: {
            type: DataTypes.STRING(2000),
            allowNull: false,
            validate: { notEmpty: true }
        },
        price: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
            defaultValue: 0,
            validate: { min: 0 }
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true }
        },
        images: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: { min: 0 }
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    }, {
        tableName: 'products',
        timestamps: false
    });
};