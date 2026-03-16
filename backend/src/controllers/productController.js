const productService = require('../services/productService');

const productController = {
  async getAll(req, res) {
    try {
      const { tenantId, search, page = 1, limit = 10, sortBy = 'name', sortOrder = 'ASC' } = req.query;
      if (!tenantId) return res.status(400).json({ message: 'tenantId is required' });
      const result = await productService.getAll({ tenantId: parseInt(tenantId), search, page: parseInt(page), limit: parseInt(limit), sortBy, sortOrder });
      res.json(result);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const product = await productService.getById(req.params.id);
      res.json(product);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },

  async create(req, res) {
    try {
      const product = await productService.create(req.body);
      res.status(201).json(product);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },

  async update(req, res) {
    try {
      const product = await productService.update(req.params.id, req.body);
      res.json(product);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },

  async delete(req, res) {
    try {
      await productService.delete(req.params.id);
      res.json({ message: 'Product deleted successfully' });
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },

  async getStats(req, res) {
    try {
      const { tenantId } = req.query;
      if (!tenantId) return res.status(400).json({ message: 'tenantId is required' });
      const stats = await productService.getStats(parseInt(tenantId));
      res.json(stats);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },

  async getActiveProducts(req, res) {
    try {
      const { tenantId } = req.query;
      if (!tenantId) return res.status(400).json({ message: 'tenantId is required' });
      const products = await productService.getActiveProducts(parseInt(tenantId));
      res.json(products);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },
};

module.exports = productController;
