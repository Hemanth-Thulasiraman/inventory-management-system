const inventoryService = require('../services/inventoryService');

const inventoryController = {
  async getAll(req, res) {
    try {
      const { tenantId, search, page = 1, limit = 10, sortBy = 'currentStock', sortOrder = 'ASC' } = req.query;
      if (!tenantId) return res.status(400).json({ message: 'tenantId is required' });
      const result = await inventoryService.getAll({ tenantId: parseInt(tenantId), search, page: parseInt(page), limit: parseInt(limit), sortBy, sortOrder });
      res.json(result);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const inventory = await inventoryService.getById(req.params.id);
      res.json(inventory);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },

  async update(req, res) {
    try {
      const inventory = await inventoryService.update(req.params.id, req.body);
      res.json(inventory);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },

  async delete(req, res) {
    try {
      await inventoryService.delete(req.params.id);
      res.json({ message: 'Inventory record deleted successfully' });
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },

  async getBelowThreshold(req, res) {
    try {
      const { tenantId } = req.query;
      if (!tenantId) return res.status(400).json({ message: 'tenantId is required' });
      const count = await inventoryService.getBelowThresholdCount(parseInt(tenantId));
      res.json({ belowThreshold: count });
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },
};

module.exports = inventoryController;
