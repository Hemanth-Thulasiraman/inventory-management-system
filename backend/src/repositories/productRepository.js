const { Op } = require('sequelize');
const { Product, Inventory, Tenant } = require('../models');

const productRepository = {
  async findAll({ tenantId, search, page = 1, limit = 10, sortBy = 'name', sortOrder = 'ASC' }) {
    const where = { tenantId };
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { sku: { [Op.like]: `%${search}%` } },
        { category: { [Op.like]: `%${search}%` } },
      ];
    }
    const offset = (page - 1) * limit;
    const { rows, count } = await Product.findAndCountAll({
      where,
      include: [{ model: Inventory, attributes: ['currentStock'] }],
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });
    return { data: rows, total: count, page, limit };
  },

  async findById(id) {
    return Product.findByPk(id, {
      include: [
        { model: Inventory, attributes: ['id', 'currentStock'] },
        { model: Tenant, attributes: ['id', 'name', 'tenantId'] },
      ],
    });
  },

  async findBySkuAndTenant(sku, tenantId) {
    return Product.findOne({ where: { sku, tenantId } });
  },

  async create(data) {
    return Product.create(data);
  },

  async update(id, data) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    return product.update(data);
  },

  async delete(id) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    await product.destroy();
    return product;
  },

  async countByTenant(tenantId) {
    const total = await Product.count({ where: { tenantId } });
    const active = await Product.count({ where: { tenantId, status: 'Active' } });
    return { total, active, inactive: total - active };
  },

  async findActiveByTenant(tenantId) {
    return Product.findAll({
      where: { tenantId, status: 'Active' },
      include: [{ model: Inventory, attributes: ['currentStock'] }],
    });
  },
};

module.exports = productRepository;
