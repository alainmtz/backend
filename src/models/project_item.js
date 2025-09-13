const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProjectItem = sequelize.define('ProjectItem', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    unit_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    }
  }, {
    tableName: 'ProjectItems',
    timestamps: false,
    underscored: true,
  });
  return ProjectItem;
};
