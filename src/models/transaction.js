/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         item_id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         type:
 *           type: string
 *           enum: [sale, purchase, adjustment]
 *         quantity:
 *           type: integer
 *         price:
 *           type: number
 *           format: float
 *         notes:
 *           type: string
 *         transaction_date:
 *           type: string
 *           format: date-time
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Transaction', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('sale','purchase','adjustment'),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 }
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      validate: { min: 0 }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    transaction_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'Transactions',
    timestamps: false,
    underscored: true,
  });
};
