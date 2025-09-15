const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    tableName: 'Roles',
    timestamps: false,
    underscored: true,
  });
  Role.associate = models => {
    Role.belongsToMany(models.User, {
      through: models.UserRole,
      as: 'users',
      foreignKey: 'role_id',
      otherKey: 'user_id'
    });
    Role.hasMany(models.UserRole, { foreignKey: 'role_id', as: 'userRoles' });
  };
  return Role;
};
