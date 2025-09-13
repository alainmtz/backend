const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('ProjectConsumible', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    consumible_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity_used: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    unit_cost: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    }
  }, {
    tableName: 'ProjectConsumibles',
    timestamps: false,
    underscored: true,
  });
};
