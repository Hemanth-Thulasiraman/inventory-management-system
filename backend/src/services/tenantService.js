const tenantRepository = require('../repositories/tenantRepository');

const tenantService = {
  async getAll(query) {
    return tenantRepository.findAll(query);
  },

  async getById(id) {
    const tenant = await tenantRepository.findById(id);
    if (!tenant) throw { status: 404, message: 'Tenant not found' };
    return tenant;
  },

  async create(data) {
    const existing = await tenantRepository.findByName(data.name);
    if (existing) throw { status: 409, message: 'Tenant with this name already exists' };
    return tenantRepository.create(data);
  },

  async update(id, data) {
    if (data.name) {
      const existing = await tenantRepository.findByName(data.name);
      if (existing && existing.id !== parseInt(id)) {
        throw { status: 409, message: 'Tenant with this name already exists' };
      }
    }
    const tenant = await tenantRepository.update(id, data);
    if (!tenant) throw { status: 404, message: 'Tenant not found' };
    return tenant;
  },

  async delete(id) {
    const tenant = await tenantRepository.delete(id);
    if (!tenant) throw { status: 404, message: 'Tenant not found' };
    return tenant;
  },
};

module.exports = tenantService;
