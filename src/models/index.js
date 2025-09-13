const { Sequelize } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(
	config.development.database,
	config.development.username,
	config.development.password,
	{
		host: config.development.host,
		dialect: config.development.dialect,
		port: config.development.port
	}
);

const Item = require('./item')(sequelize);
const Stock = require('./stock')(sequelize);
const Supplier = require('./supplier')(sequelize);
const Project = require('./project')(sequelize);
const ProjectItem = require('./project_item')(sequelize);
const Consumible = require('./consumible')(sequelize);
const ProjectConsumible = require('./project_consumible')(sequelize);
const User = require('./user')(sequelize);
const Transaction = require('./transaction')(sequelize);
const Purchase = require('./purchase')(sequelize);

// Relación: Un proyecto tiene muchos items a través de ProjectItem
Project.belongsToMany(Item, { through: ProjectItem, foreignKey: 'project_id', otherKey: 'item_id', as: 'items' });
Item.belongsToMany(Project, { through: ProjectItem, foreignKey: 'item_id', otherKey: 'project_id', as: 'projects' });
Project.hasMany(ProjectItem, { foreignKey: 'project_id', as: 'projectItems' });
ProjectItem.belongsTo(Item, { foreignKey: 'item_id', as: 'item' });
ProjectItem.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

// Relación: Un item pertenece a un proveedor
Item.belongsTo(Supplier, { foreignKey: 'supplier_id', as: 'supplier' });
Item.hasOne(Stock, { foreignKey: 'item_id', as: 'stock' });
Stock.belongsTo(Item, { foreignKey: 'item_id', as: 'item' });

// Relación: Un proyecto puede tener muchos consumibles a través de ProjectConsumible
Project.belongsToMany(Consumible, { through: ProjectConsumible, foreignKey: 'project_id', otherKey: 'consumible_id', as: 'consumibles' });
Consumible.belongsToMany(Project, { through: ProjectConsumible, foreignKey: 'consumible_id', otherKey: 'project_id', as: 'projects' });
Project.hasMany(ProjectConsumible, { foreignKey: 'project_id', as: 'projectConsumibles' });
ProjectConsumible.belongsTo(Consumible, { foreignKey: 'consumible_id', as: 'consumible' });
ProjectConsumible.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });
Transaction.belongsTo(Item, { foreignKey: 'item_id', as: 'item' });
Transaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
	sequelize,
	Item,
	Stock,
	Supplier,
	Project,
	ProjectItem,
	Consumible,
	ProjectConsumible,
	User,
	Transaction,
	Purchase,
	// otros modelos
};
