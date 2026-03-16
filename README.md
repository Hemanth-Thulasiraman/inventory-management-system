# Inventory Management System

A full-stack, multi-tenant inventory management system built with React, Node.js/Express, and SQLite.

## Tech Stack

- **Frontend:** React 19, Redux Toolkit, React Router, Tailwind CSS, Phosphor Icons
- **Backend:** Node.js, Express, Sequelize ORM
- **Database:** SQLite (RDBMS)
- **Architecture:** Routes → Controllers → Services → Repositories

## Features

- **Multi-Tenant Support:** Tenant-scoped data isolation across all modules
- **Tenant Management:** Create, edit, delete tenants with duplicate name validation
- **Product Catalog:** CRUD operations with SKU uniqueness per tenant, category management
- **Inventory Tracking:** Real-time stock levels, below-threshold alerts, quick stock updates
- **Order Management:** Order creation with automatic inventory validation (Created/Pending status), order confirmation with stock deduction, cancellation
- **Business Rules:**
  - Orders can only be placed for Active products
  - Orders with insufficient inventory get Pending status
  - Order confirmation deducts inventory
  - Duplicate tenant names are rejected
  - SKU is unique per tenant and immutable after creation

## Setup & Running

### Prerequisites
- Node.js 18+

### Backend
```bash
cd backend
npm install
npm run seed    # Seeds database with sample data
npm run dev     # Starts on port 5001
```

### Frontend
```bash
cd frontend
npm install
npm run dev     # Starts on port 5173
```

### Access
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001/api

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tenants | List tenants (search, pagination, sort) |
| POST | /api/tenants | Create tenant |
| GET | /api/tenants/:id | Get tenant details |
| PUT | /api/tenants/:id | Update tenant |
| DELETE | /api/tenants/:id | Delete tenant |
| GET | /api/products?tenantId= | List products for tenant |
| GET | /api/products/stats?tenantId= | Product statistics |
| GET | /api/products/active?tenantId= | Active products only |
| POST | /api/products | Create product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |
| GET | /api/inventory?tenantId= | List inventory for tenant |
| GET | /api/inventory/below-threshold?tenantId= | Below threshold count |
| PUT | /api/inventory/:id | Update stock level |
| DELETE | /api/inventory/:id | Delete inventory record |
| GET | /api/orders?tenantId= | List orders for tenant |
| GET | /api/orders/stats?tenantId= | Order statistics |
| POST | /api/orders | Create order (auto inventory check) |
| PUT | /api/orders/:id | Update order |
| POST | /api/orders/:id/confirm | Confirm order (deducts inventory) |
| POST | /api/orders/:id/cancel | Cancel order |
| DELETE | /api/orders/:id | Delete order |

## Database Schema

```
Tenant (1) ──→ (N) Product (1) ──→ (1) Inventory
Tenant (1) ──→ (N) Order (N) ←── (1) Product
```

- **Tenant:** id, tenantId, name (unique), status
- **Product:** id, tenantId (FK), sku (unique per tenant), name, description, category, reorderThreshold, costPerUnit, status
- **Inventory:** id, tenantId (FK), productId (FK, unique), currentStock
- **Order:** id, orderId, tenantId (FK), productId (FK), quantity, status, notes
