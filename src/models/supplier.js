/**
 * @swagger
 * components:
 *   schemas:
 *     Supplier:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         contact_person:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         items_supplied:
 *           type: string
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Supplier = sequelize.define('Supplier', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { notEmpty: true }
    },
    contact_person: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: { isEmail: true }
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    items_supplied: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'Suppliers',
    underscored: true,
    timestamps: false
  });

  Supplier.associate = models => {
    Supplier.hasMany(models.Item, {
      as: 'items',
      foreignKey: 'supplier_id'
    });
  };

  return Supplier;
};
