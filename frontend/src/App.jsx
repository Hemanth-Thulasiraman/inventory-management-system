import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import TenantList from './pages/TenantList';
import TenantCreate from './pages/TenantCreate';
import TenantEdit from './pages/TenantEdit';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import ProductEdit from './pages/ProductEdit';
import InventoryList from './pages/InventoryList';
import InventoryDetail from './pages/InventoryDetail';
import InventoryEdit from './pages/InventoryEdit';
import OrderList from './pages/OrderList';
import OrderDetail from './pages/OrderDetail';
import OrderCreate from './pages/OrderCreate';
import OrderEdit from './pages/OrderEdit';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/tenants" replace />} />
        <Route path="tenants" element={<TenantList />} />
        <Route path="tenants/new" element={<TenantCreate />} />
        <Route path="tenants/:id" element={<TenantEdit />} />
        <Route path="tenants/:id/edit" element={<TenantEdit />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/new" element={<ProductEdit />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="products/:id/edit" element={<ProductEdit />} />
        <Route path="inventory" element={<InventoryList />} />
        <Route path="inventory/:id" element={<InventoryDetail />} />
        <Route path="inventory/:id/edit" element={<InventoryEdit />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="orders/new" element={<OrderCreate />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="orders/:id/edit" element={<OrderEdit />} />
      </Route>
    </Routes>
  );
}
