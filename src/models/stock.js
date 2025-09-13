const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Stock', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('in-stock','low-stock','out-of-stock','discontinued'),
      defaultValue: 'in-stock',
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'Stock',
    timestamps: false,
    underscored: true,
  });
};
