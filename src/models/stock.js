const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Stock = sequelize.define('Stock', {
    item_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    status: DataTypes.ENUM('in-stock','low-stock','out-of-stock','discontinued'),
    updated_at: DataTypes.DATE
  }, {
    tableName: 'Stock',
    underscored: true,
    timestamps: false
  });

  Stock.associate = models => {
    Stock.belongsTo(models.Item, {
      as: 'item',
      foreignKey: 'item_id'
    });
  };

  return Stock;
};
