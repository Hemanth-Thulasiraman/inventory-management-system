const { Op } = require('sequelize');
const { Inventory, Product, Tenant } = require('../models');

const inventoryRepository = {
  async findAll({ tenantId, search, page = 1, limit = 10, sortBy = 'currentStock', sortOrder = 'ASC' }) {
    const where = { tenantId };
    const productWhere = {};
    if (search) {
      productWhere[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { sku: { [Op.like]: `%${search}%` } },
      ];
    }
    const offset = (page - 1) * limit;

    const includeOpts = {
      model: Product,
      attributes: ['id', 'name', 'sku', 'costPerUnit', 'reorderThreshold', 'category', 'status'],
    };
    if (search) includeOpts.where = productWhere;

    const { rows, count } = await Inventory.findAndCountAll({
      where,
      include: [includeOpts],
      order: sortBy === 'name' ? [[Product, 'name', sortOrder]] : [[sortBy, sortOrder]],
      limit,
      offset,
    });
    return { data: rows, total: count, page, limit };
  },

  async findById(id) {
    return Inventory.findByPk(id, {
      include: [
        { model: Product, include: [{ model: Tenant, attributes: ['id', 'name', 'tenantId'] }] },
      ],
    });
  },

  async findByProductId(productId) {
    return Inventory.findOne({ where: { productId } });
  },

  async create(data) {
    return Inventory.create(data);
  },

  async update(id, data) {
    const inventory = await Inventory.findByPk(id);
    if (!inventory) return null;
    return inventory.update(data);
  },

  async delete(id) {
    const inventory = await Inventory.findByPk(id);
    if (!inventory) return null;
    await inventory.destroy();
    return inventory;
  },

  async countBelowThreshold(tenantId) {
    const inventories = await Inventory.findAll({
      where: { tenantId },
      include: [{ model: Product, attributes: ['reorderThreshold'] }],
    });
    return inventories.filter(inv => inv.currentStock < inv.Product.reorderThreshold).length;
  },
};

module.exports = inventoryRepository;
