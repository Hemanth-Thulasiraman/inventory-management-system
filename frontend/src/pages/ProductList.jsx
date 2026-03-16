import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass, Plus, Package } from '@phosphor-icons/react';
import { fetchProducts, deleteProduct, fetchProductStats } from '../store/productSlice';
import TenantDropdown from '../components/TenantDropdown';
import Pagination from '../components/Pagination';
import ActionMenu from '../components/ActionMenu';
import StatusBadge from '../components/StatusBadge';
import DeleteModal from '../components/DeleteModal';

export default function ProductList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, page, loading, stats } = useSelector(state => state.products);
  const selectedTenantId = useSelector(state => state.ui.selectedTenantId);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [deleteId, setDeleteId] = useState(null);
  const limit = 10;

  useEffect(() => {
    if (selectedTenantId) {
      dispatch(fetchProducts({ tenantId: selectedTenantId, search, page: 1, limit, sortBy, sortOrder }));
      dispatch(fetchProductStats({ tenantId: selectedTenantId }));
    }
  }, [dispatch, selectedTenantId, search, sortBy, sortOrder]);

  const handleDelete = async () => {
    await dispatch(deleteProduct(deleteId));
    setDeleteId(null);
    dispatch(fetchProducts({ tenantId: selectedTenantId, search, page: 1, limit, sortBy, sortOrder }));
    dispatch(fetchProductStats({ tenantId: selectedTenantId }));
  };

  if (!selectedTenantId) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
          <Package size={32} weight="duotone" className="text-blue-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">No tenant selected</h2>
        <p className="text-sm text-gray-500 mb-4">Select a tenant from the sidebar to view products</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your product catalog</p>
        </div>
        <div className="flex items-center space-x-3">
          <TenantDropdown />
          <button onClick={() => navigate('/products/new')} className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            <Plus size={16} weight="bold" />
            <span>New Product</span>
          </button>
        </div>
      </div>

      {/* Summary Tiles */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              <p className="text-xs text-gray-400 mt-0.5">catalog items</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Package size={24} weight="duotone" className="text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active / Inactive</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                <span className="text-green-600">{stats.active}</span>
                <span className="text-gray-300 mx-1">/</span>
                <span className="text-gray-400">{stats.inactive}</span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">product status</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow" />
        </div>
        <select value={`${sortBy}-${sortOrder}`} onChange={e => { const [s,o] = e.target.value.split('-'); setSortBy(s); setSortOrder(o); }}
          className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm shadow-sm">
          <option value="name-ASC">Name A-Z</option>
          <option value="name-DESC">Name Z-A</option>
          <option value="status-ASC">Status</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-400">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-400">No products found</td></tr>
            ) : items.map(product => (
              <tr key={product.id} className="hover:bg-blue-50/30 transition-colors cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
                <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-5 py-3.5 text-sm text-gray-500 font-mono">{product.sku}</td>
                <td className="px-5 py-3.5 text-sm text-gray-500">{product.category}</td>
                <td className="px-5 py-3.5"><StatusBadge status={product.status} /></td>
                <td className="px-5 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                  <ActionMenu
                    onView={() => navigate(`/products/${product.id}`)}
                    onEdit={() => navigate(`/products/${product.id}/edit`)}
                    onDelete={() => setDeleteId(product.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} total={total} limit={limit} onPageChange={p => dispatch(fetchProducts({ tenantId: selectedTenantId, search, page: p, limit, sortBy, sortOrder }))} />

      <DeleteModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Product" message="Are you sure you want to delete this product? Associated inventory and orders may be affected." />
    </div>
  );
}
