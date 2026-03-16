const { Op } = require('sequelize');
const { Order, Product, Inventory, Tenant } = require('../models');

const orderRepository = {
  async findAll({ tenantId, search, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' }) {
    const where = { tenantId };
    if (search) {
      where[Op.or] = [
        { orderId: { [Op.like]: `%${search}%` } },
        { '$Product.name$': { [Op.like]: `%${search}%` } },
      ];
    }
    const offset = (page - 1) * limit;
    const { rows, count } = await Order.findAndCountAll({
      where,
      include: [
        { model: Product, attributes: ['id', 'name', 'sku', 'costPerUnit', 'status'] },
      ],
      order: [[sortBy, sortOrder]],
      limit,
      offset,
      subQuery: false,
    });
    return { data: rows, total: count, page, limit };
  },

  async findById(id) {
    return Order.findByPk(id, {
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'sku', 'costPerUnit', 'category', 'reorderThreshold', 'status'],
          include: [{ model: Inventory, attributes: ['currentStock'] }],
        },
        { model: Tenant, attributes: ['id', 'name', 'tenantId'] },
      ],
    });
  },

  async create(data) {
    const count = await Order.count();
    data.orderId = `ORD-${String(count + 1).padStart(4, '0')}`;
    return Order.create(data);
  },

  async update(id, data) {
    const order = await Order.findByPk(id);
    if (!order) return null;
    return order.update(data);
  },

  async delete(id) {
    const order = await Order.findByPk(id);
    if (!order) return null;
    await order.destroy();
    return order;
  },

  async countByTenant(tenantId) {
    const total = await Order.count({ where: { tenantId } });
    const pending = await Order.count({ where: { tenantId, status: 'Pending' } });
    const created = await Order.count({ where: { tenantId, status: 'Created' } });
    return { total, pending, created };
  },
};

module.exports = orderRepository;
