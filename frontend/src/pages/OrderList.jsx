import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass, Plus, ShoppingCart, ClockCountdown, CheckCircle } from '@phosphor-icons/react';
import { fetchOrders, deleteOrder, fetchOrderStats } from '../store/orderSlice';
import TenantDropdown from '../components/TenantDropdown';
import Pagination from '../components/Pagination';
import ActionMenu from '../components/ActionMenu';
import StatusBadge from '../components/StatusBadge';
import DeleteModal from '../components/DeleteModal';

export default function OrderList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, page, loading, stats } = useSelector(state => state.orders);
  const selectedTenantId = useSelector(state => state.ui.selectedTenantId);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [deleteId, setDeleteId] = useState(null);
  const limit = 10;

  useEffect(() => {
    if (selectedTenantId) {
      dispatch(fetchOrders({ tenantId: selectedTenantId, search, page: 1, limit, sortBy, sortOrder }));
      dispatch(fetchOrderStats({ tenantId: selectedTenantId }));
    }
  }, [dispatch, selectedTenantId, search, sortBy, sortOrder]);

  const handleDelete = async () => {
    await dispatch(deleteOrder(deleteId));
    setDeleteId(null);
    dispatch(fetchOrders({ tenantId: selectedTenantId, search, page: 1, limit, sortBy, sortOrder }));
    dispatch(fetchOrderStats({ tenantId: selectedTenantId }));
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (!selectedTenantId) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
          <ShoppingCart size={32} weight="duotone" className="text-blue-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">No tenant selected</h2>
        <p className="text-sm text-gray-500">Select a tenant from the sidebar to view orders</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track and manage orders</p>
        </div>
        <div className="flex items-center space-x-3">
          <TenantDropdown />
          <button onClick={() => navigate('/orders/new')} className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            <Plus size={16} weight="bold" />
            <span>New Order</span>
          </button>
        </div>
      </div>

      {/* Summary Tiles */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              <p className="text-xs text-gray-400 mt-0.5">all-time orders</p>
            </div>
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
              <ShoppingCart size={24} weight="duotone" className="text-gray-400" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
              <p className="text-xs text-gray-400 mt-0.5">awaiting inventory</p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
              <ClockCountdown size={24} weight="duotone" className="text-yellow-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Created</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.created}</p>
              <p className="text-xs text-gray-400 mt-0.5">ready to process</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle size={24} weight="duotone" className="text-green-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
        </div>
        <select value={`${sortBy}-${sortOrder}`} onChange={e => { const [s,o] = e.target.value.split('-'); setSortBy(s); setSortOrder(o); }}
          className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm shadow-sm">
          <option value="createdAt-DESC">Newest First</option>
          <option value="createdAt-ASC">Oldest First</option>
          <option value="status-ASC">Status</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">No orders found</td></tr>
            ) : items.map(order => (
              <tr key={order.id} className="hover:bg-blue-50/30 transition-colors cursor-pointer" onClick={() => navigate(`/orders/${order.id}`)}>
                <td className="px-5 py-3.5 text-sm font-semibold text-gray-900 font-mono">{order.orderId}</td>
                <td className="px-5 py-3.5 text-sm text-gray-600">{order.Product?.name}</td>
                <td className="px-5 py-3.5 text-sm text-gray-600 font-medium">{order.quantity}</td>
                <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                <td className="px-5 py-3.5 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                <td className="px-5 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                  <ActionMenu
                    onView={() => navigate(`/orders/${order.id}`)}
                    onEdit={() => navigate(`/orders/${order.id}/edit`)}
                    onDelete={() => setDeleteId(order.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} total={total} limit={limit} onPageChange={p => dispatch(fetchOrders({ tenantId: selectedTenantId, search, page: p, limit, sortBy, sortOrder }))} />

      <DeleteModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Order" message="Are you sure you want to delete this order?" />
    </div>
  );
}
