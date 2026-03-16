const sequelize = require('../config/database');
const Tenant = require('./Tenant');
const Product = require('./Product');
const Inventory = require('./Inventory');
const Order = require('./Order');

// Associations
Tenant.hasMany(Product, { foreignKey: 'tenantId', onDelete: 'CASCADE' });
Product.belongsTo(Tenant, { foreignKey: 'tenantId' });

Tenant.hasMany(Inventory, { foreignKey: 'tenantId', onDelete: 'CASCADE' });
Inventory.belongsTo(Tenant, { foreignKey: 'tenantId' });

Product.hasOne(Inventory, { foreignKey: 'productId', onDelete: 'CASCADE' });
Inventory.belongsTo(Product, { foreignKey: 'productId' });

Tenant.hasMany(Order, { foreignKey: 'tenantId', onDelete: 'CASCADE' });
Order.belongsTo(Tenant, { foreignKey: 'tenantId' });

Product.hasMany(Order, { foreignKey: 'productId' });
Order.belongsTo(Product, { foreignKey: 'productId' });

module.exports = { sequelize, Tenant, Product, Inventory, Order };
