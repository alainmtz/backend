/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         sku:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *           format: float
 *         cost:
 *           type: number
 *           format: float
 *         brand:
 *           type: string
 *         model:
 *           type: string
 *         status:
 *           type: string
 *           enum: [in-stock, low-stock, out-of-stock, discontinued]
 *         supplier_id:
 *           type: integer
 *         provenance:
 *           type: string
 *         warranty_days:
 *           type: integer
 *         image_url:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Item = sequelize.define('Item', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      validate: { min: 0 }
    },
    cost: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      validate: { min: 0 }
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('in-stock','low-stock','out-of-stock','discontinued'),
      allowNull: false,
      defaultValue: 'in-stock'
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    provenance: {
      type: DataTypes.STRING,
      allowNull: true
    },
    warranty_days: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 0 }
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    tableName: 'Items',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Item.associate = models => {
    // Relación con Supplier
    Item.belongsTo(models.Supplier, {
      as: 'supplier',
      foreignKey: 'supplier_id'
    });
    // Relación con Stock
    Item.hasOne(models.Stock, {
      as: 'stock',
      foreignKey: 'item_id'
    });
  };

  return Item;
};
