const { sequelize, Tenant, Product, Inventory, Order } = require('./models');

async function seed() {
  await sequelize.sync({ force: true });

  // Create tenants
  const tenants = await Promise.all([
    Tenant.create({ tenantId: 'TEN-001', name: 'Acme Corp', status: 'Active' }),
    Tenant.create({ tenantId: 'TEN-002', name: 'Stark Industries', status: 'Active' }),
    Tenant.create({ tenantId: 'TEN-003', name: 'Wayne Enterprises', status: 'Active' }),
    Tenant.create({ tenantId: 'TEN-004', name: 'Umbrella Corp', status: 'Inactive' }),
  ]);

  const categories = ['Chemicals', 'Metals', 'Plastics', 'Electronics', 'Textiles'];
  const productNames = [
    'Industrial Adhesive', 'Aluminum Sheet', 'PVC Pipe', 'Circuit Board', 'Nylon Fabric',
    'Epoxy Resin', 'Steel Rod', 'Polycarbonate Panel', 'LED Module', 'Cotton Thread',
    'Acetone Solvent', 'Copper Wire', 'Rubber Gasket', 'Capacitor Pack', 'Silk Ribbon',
  ];

  let orderCount = 0;

  for (const tenant of tenants.slice(0, 3)) {
    for (let i = 0; i < 15; i++) {
      const product = await Product.create({
        tenantId: tenant.id,
        sku: `${categories[i % 5].substring(0, 3).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
        name: productNames[i],
        description: `High-quality ${productNames[i].toLowerCase()} for industrial use.`,
        category: categories[i % 5],
        reorderThreshold: Math.floor(Math.random() * 30) + 10,
        costPerUnit: (Math.random() * 500 + 10).toFixed(2),
        status: i < 12 ? 'Active' : 'Inactive',
      });

      const stock = Math.floor(Math.random() * 100);
      await Inventory.create({
        tenantId: tenant.id,
        productId: product.id,
        currentStock: stock,
      });

      if (i < 8) {
        orderCount++;
        const qty = Math.floor(Math.random() * 20) + 1;
        await Order.create({
          orderId: `ORD-${String(orderCount).padStart(4, '0')}`,
          tenantId: tenant.id,
          productId: product.id,
          quantity: qty,
          status: stock >= qty ? 'Created' : 'Pending',
          notes: `Order for ${productNames[i]}`,
        });
      }
    }
  }

  console.log('Database seeded successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
