const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('StockHistory', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    stock_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sales: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    tableName: 'stock_history',
    timestamps: false,
    underscored: true,
  });
};
