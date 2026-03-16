const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tenantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Tenants', key: 'id' },
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reorderThreshold: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  costPerUnit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    defaultValue: 'Active',
  },
}, {
  timestamps: true,
  indexes: [
    { unique: true, fields: ['tenantId', 'sku'] },
  ],
});

module.exports = Product;
