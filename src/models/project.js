/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         labor_cost:
 *           type: number
 *           format: float
 */
// Eliminado import innecesario

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         start_date:
 *           type: string
 *           format: date
 *         end_date:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 */

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    start_date: { type: DataTypes.DATE, allowNull: true },
    end_date: { type: DataTypes.DATE, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'projects',
    timestamps: false,
  });

  Project.associate = models => {
    Project.belongsToMany(models.Item, { through: models.ProjectItem, foreignKey: 'project_id', otherKey: 'item_id', as: 'items' });
    Project.hasMany(models.ProjectItem, { foreignKey: 'project_id', as: 'projectItems' });
    Project.belongsToMany(models.Consumible, { through: models.ProjectConsumible, foreignKey: 'project_id', otherKey: 'consumible_id', as: 'consumibles' });
    Project.hasMany(models.ProjectConsumible, { foreignKey: 'project_id', as: 'projectConsumibles' });
  };
  return Project;
};
// ...existing code...
