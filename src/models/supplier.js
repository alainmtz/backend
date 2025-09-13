const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Supplier', {
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
    },
    contact_person: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
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
    timestamps: false,
    underscored: true,
  });
};
