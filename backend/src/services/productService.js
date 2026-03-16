const productRepository = require('../repositories/productRepository');
const inventoryRepository = require('../repositories/inventoryRepository');

const productService = {
  async getAll(query) {
    return productRepository.findAll(query);
  },

  async getById(id) {
    const product = await productRepository.findById(id);
    if (!product) throw { status: 404, message: 'Product not found' };
    return product;
  },

  async create(data) {
    const existing = await productRepository.findBySkuAndTenant(data.sku, data.tenantId);
    if (existing) throw { status: 409, message: 'Product with this SKU already exists for this tenant' };
    const product = await productRepository.create(data);
    // Auto-create inventory record for the product
    await inventoryRepository.create({
      tenantId: data.tenantId,
      productId: product.id,
      currentStock: 0,
    });
    return product;
  },

  async update(id, data) {
    const product = await productRepository.update(id, data);
    if (!product) throw { status: 404, message: 'Product not found' };
    return product;
  },

  async delete(id) {
    const product = await productRepository.delete(id);
    if (!product) throw { status: 404, message: 'Product not found' };
    return product;
  },

  async getStats(tenantId) {
    return productRepository.countByTenant(tenantId);
  },

  async getActiveProducts(tenantId) {
    return productRepository.findActiveByTenant(tenantId);
  },
};

module.exports = productService;
