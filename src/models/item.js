const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Item', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
    cost: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    model: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('in-stock','low-stock','out-of-stock','discontinued'),
      defaultValue: 'in-stock',
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    provenance: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    warranty_days: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'Items',
    timestamps: false,
    underscored: true,
  });
};
