/**
 * @swagger
 * components:
 *   schemas:
 *     Consumible:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         usage_count:
 *           type: integer
 *         cost_price:
 *           type: number
 *           format: float
 *         sale_price:
 *           type: number
 *           format: float
 *         created_at:
 *           type: string
 *           format: date-time
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Consumible', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { notEmpty: true }
    },
    usage_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: { min: 0 }
    },
    cost_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      validate: { min: 0 }
    },
    sale_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      validate: { min: 0 }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    tableName: 'Consumibles',
    timestamps: false,
    underscored: true,
  });
};
