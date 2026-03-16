const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  tenantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Tenants', key: 'id' },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Products', key: 'id' },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Created', 'Pending', 'Confirmed', 'Cancelled'),
    defaultValue: 'Created',
  },
  notes: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
}, {
  timestamps: true,
});

module.exports = Order;
