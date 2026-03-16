const inventoryRepository = require('../repositories/inventoryRepository');

const inventoryService = {
  async getAll(query) {
    return inventoryRepository.findAll(query);
  },

  async getById(id) {
    const inventory = await inventoryRepository.findById(id);
    if (!inventory) throw { status: 404, message: 'Inventory record not found' };
    return inventory;
  },

  async update(id, data) {
    const inventory = await inventoryRepository.update(id, data);
    if (!inventory) throw { status: 404, message: 'Inventory record not found' };
    return inventory;
  },

  async delete(id) {
    const inventory = await inventoryRepository.delete(id);
    if (!inventory) throw { status: 404, message: 'Inventory record not found' };
    return inventory;
  },

  async getBelowThresholdCount(tenantId) {
    return inventoryRepository.countBelowThreshold(tenantId);
  },
};

module.exports = inventoryService;
