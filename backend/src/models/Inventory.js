const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Inventory = sequelize.define('Inventory', {
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
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: { model: 'Products', key: 'id' },
  },
  currentStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  timestamps: true,
});

module.exports = Inventory;
