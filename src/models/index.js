
const { Sequelize, DataTypes } = require('sequelize');
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

const models = {
	Item: require('./item')(sequelize, DataTypes),
	Stock: require('./stock')(sequelize, DataTypes),
	Supplier: require('./supplier')(sequelize, DataTypes),
	ProjectItem: require('./project_item')(sequelize, DataTypes),
	Consumible: require('./consumible')(sequelize, DataTypes),
	ProjectConsumible: require('./project_consumible')(sequelize, DataTypes),
	User: require('./user')(sequelize, DataTypes),
	Transaction: require('./transaction')(sequelize, DataTypes),
	Purchase: require('./purchase')(sequelize, DataTypes),
	Role: require('./role')(sequelize, DataTypes),
	UserRole: require('./user_role')(sequelize, DataTypes),
	Finance: require('./finance')(sequelize, DataTypes),
	FinanceHistory: require('./finance_history')(sequelize, DataTypes),
	Service: require('./service')(sequelize, DataTypes),
	Ticket: require('./ticket')(sequelize, DataTypes),
	Appointment: require('./appointment')(sequelize, DataTypes),
	Project: require('./project')(sequelize, DataTypes),
	Report: require('./report')(sequelize, DataTypes),
	StockHistory: require('./stock_history')(sequelize, DataTypes),
	ActivityLog: require('./activity_log')(sequelize, DataTypes),
};

// Asociaciones
Object.values(models).forEach(model => {
	if (model.associate) model.associate(models);
});

module.exports = {
	sequelize,
	...models,
};
