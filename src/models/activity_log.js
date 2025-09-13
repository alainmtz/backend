
// ...existing code...

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ActivityLog', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    action: { type: DataTypes.STRING, allowNull: false },
    entity: { type: DataTypes.STRING, allowNull: false },
    entity_id: { type: DataTypes.INTEGER, allowNull: true },
    details: { type: DataTypes.JSON, allowNull: true },
    ip: { type: DataTypes.STRING, allowNull: true },
    result: { type: DataTypes.STRING, allowNull: false, defaultValue: 'success' },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'activity_logs',
    timestamps: false,
  });
};
