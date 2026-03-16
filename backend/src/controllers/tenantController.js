const tenantService = require('../services/tenantService');

const tenantController = {
  async getAll(req, res) {
    try {
      const { search, page = 1, limit = 10, sortBy = 'name', sortOrder = 'ASC' } = req.query;
      const result = await tenantService.getAll({ search, page: parseInt(page), limit: parseInt(limit), sortBy, sortOrder });
      res.json(result);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const tenant = await tenantService.getById(req.params.id);
      res.json(tenant);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },

  async create(req, res) {
    try {
      const tenant = await tenantService.create(req.body);
      res.status(201).json(tenant);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },

  async update(req, res) {
    try {
      const tenant = await tenantService.update(req.params.id, req.body);
      res.json(tenant);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },

  async delete(req, res) {
    try {
      await tenantService.delete(req.params.id);
      res.json({ message: 'Tenant deleted successfully' });
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },
};

module.exports = tenantController;
