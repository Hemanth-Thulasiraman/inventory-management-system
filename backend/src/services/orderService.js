const orderRepository = require('../repositories/orderRepository');
const inventoryRepository = require('../repositories/inventoryRepository');
const productRepository = require('../repositories/productRepository');

const orderService = {
  async getAll(query) {
    return orderRepository.findAll(query);
  },

  async getById(id) {
    const order = await orderRepository.findById(id);
    if (!order) throw { status: 404, message: 'Order not found' };
    return order;
  },

  async create(data) {
    // Validate product is active
    const product = await productRepository.findById(data.productId);
    if (!product) throw { status: 404, message: 'Product not found' };
    if (product.status !== 'Active') throw { status: 400, message: 'Cannot create order for inactive product' };

    // Check inventory levels
    const inventory = await inventoryRepository.findByProductId(data.productId);
    const currentStock = inventory ? inventory.currentStock : 0;

    // Determine order status based on inventory
    if (currentStock >= data.quantity) {
      data.status = 'Created';
    } else {
      data.status = 'Pending';
    }

    return orderRepository.create(data);
  },

  async update(id, data) {
    const order = await orderRepository.update(id, data);
    if (!order) throw { status: 404, message: 'Order not found' };
    return order;
  },

  async confirm(id) {
    const order = await orderRepository.findById(id);
    if (!order) throw { status: 404, message: 'Order not found' };

    // Deduct inventory on confirm
    const inventory = await inventoryRepository.findByProductId(order.productId);
    if (inventory && inventory.currentStock >= order.quantity) {
      await inventory.update({ currentStock: inventory.currentStock - order.quantity });
      return orderRepository.update(id, { status: 'Confirmed' });
    }
    throw { status: 400, message: 'Insufficient inventory to confirm this order' };
  },

  async cancel(id) {
    return orderRepository.update(id, { status: 'Cancelled' });
  },

  async delete(id) {
    const order = await orderRepository.delete(id);
    if (!order) throw { status: 404, message: 'Order not found' };
    return order;
  },

  async getStats(tenantId) {
    return orderRepository.countByTenant(tenantId);
  },
};

module.exports = orderService;
