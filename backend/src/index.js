require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const tenantRoutes = require('./routes/tenantRoutes');
const productRoutes = require('./routes/productRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tenants', tenantRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Sync database and start server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

module.exports = app;
