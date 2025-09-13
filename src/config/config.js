require('dotenv').config();
require('dotenv').config();
module.exports = {
	development: {
		username: process.env.DB_USER || 'root',
		password: process.env.DB_PASS || '',
		database: process.env.DB_NAME || 'fulltime_db',
		host: process.env.DB_HOST || 'localhost',
		dialect: 'mariadb',
		port: process.env.DB_PORT || 3306
	}
};
module.exports = {
	development: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: 'mariadb',
		logging: false
	},
	production: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: 'mariadb',
		logging: false
	}
};
