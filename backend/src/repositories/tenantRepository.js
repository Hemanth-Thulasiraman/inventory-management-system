const { Op } = require('sequelize');
const { Tenant } = require('../models');

const tenantRepository = {
  async findAll({ search, page = 1, limit = 10, sortBy = 'name', sortOrder = 'ASC' }) {
    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { tenantId: { [Op.like]: `%${search}%` } },
      ];
    }
    const offset = (page - 1) * limit;
    const { rows, count } = await Tenant.findAndCountAll({
      where,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });
    return { data: rows, total: count, page, limit };
  },

  async findById(id) {
    return Tenant.findByPk(id);
  },

  async findByName(name) {
    return Tenant.findOne({ where: { name } });
  },

  async create(data) {
    const count = await Tenant.count();
    data.tenantId = `TEN-${String(count + 1).padStart(3, '0')}`;
    return Tenant.create(data);
  },

  async update(id, data) {
    const tenant = await Tenant.findByPk(id);
    if (!tenant) return null;
    return tenant.update(data);
  },

  async delete(id) {
    const tenant = await Tenant.findByPk(id);
    if (!tenant) return null;
    await tenant.destroy();
    return tenant;
  },
};

module.exports = tenantRepository;
