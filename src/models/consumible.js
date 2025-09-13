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
    },
    usage_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    cost_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
    sale_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
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
