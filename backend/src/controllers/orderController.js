const orderService = require('../services/orderService');

const orderController = {
  async getAll(req, res) {
    try {
      const { tenantId, search, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
      if (!tenantId) return res.status(400).json({ message: 'tenantId is required' });
      const result = await orderService.getAll({ tenantId: parseInt(tenantId), search, page: parseInt(page), limit: parseInt(limit), sortBy, sortOrder });
      res.json(result);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const order = await orderService.getById(req.params.id);
      res.json(order);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },

  async create(req, res) {
    try {
      const order = await orderService.create(req.body);
      res.status(201).json(order);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },

  async update(req, res) {
    try {
      const order = await orderService.update(req.params.id, req.body);
      res.json(order);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },

  async confirm(req, res) {
    try {
      const order = await orderService.confirm(req.params.id);
      res.json(order);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },

  async cancel(req, res) {
    try {
      const order = await orderService.cancel(req.params.id);
      res.json(order);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },

  async delete(req, res) {
    try {
      await orderService.delete(req.params.id);
      res.json({ message: 'Order deleted successfully' });
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },

  async getStats(req, res) {
    try {
      const { tenantId } = req.query;
      if (!tenantId) return res.status(400).json({ message: 'tenantId is required' });
      const stats = await orderService.getStats(parseInt(tenantId));
      res.json(stats);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },
};

module.exports = orderController;
