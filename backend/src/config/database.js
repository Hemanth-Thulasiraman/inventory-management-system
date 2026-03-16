const { Sequelize } = require('sequelize');
const path = require('path');

const DB_DIALECT = process.env.DB_DIALECT || 'sqlite';

const dialectConfig = {
  sqlite: {
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../database.sqlite'),
  },
  postgres: {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'inventory_ms',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
  },
  mysql: {
    dialect: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'inventory_ms',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
  },
};

const config = dialectConfig[DB_DIALECT];
if (!config) {
  throw new Error(`Unsupported DB_DIALECT: ${DB_DIALECT}. Use sqlite, postgres, or mysql.`);
}

const sequelize = new Sequelize({
  ...config,
  logging: false,
});

module.exports = sequelize;
