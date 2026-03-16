import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass, Stack, WarningCircle } from '@phosphor-icons/react';
import { fetchInventory, deleteInventory, fetchBelowThreshold } from '../store/inventorySlice';
import TenantDropdown from '../components/TenantDropdown';
import Pagination from '../components/Pagination';
import ActionMenu from '../components/ActionMenu';
import DeleteModal from '../components/DeleteModal';

export default function InventoryList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, page, loading, belowThreshold } = useSelector(state => state.inventory);
  const selectedTenantId = useSelector(state => state.ui.selectedTenantId);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [deleteId, setDeleteId] = useState(null);
  const limit = 10;

  useEffect(() => {
    if (selectedTenantId) {
      dispatch(fetchInventory({ tenantId: selectedTenantId, search, page: 1, limit, sortBy, sortOrder }));
      dispatch(fetchBelowThreshold({ tenantId: selectedTenantId }));
    }
  }, [dispatch, selectedTenantId, search, sortBy, sortOrder]);

  const handleDelete = async () => {
    await dispatch(deleteInventory(deleteId));
    setDeleteId(null);
    dispatch(fetchInventory({ tenantId: selectedTenantId, search, page: 1, limit, sortBy, sortOrder }));
    dispatch(fetchBelowThreshold({ tenantId: selectedTenantId }));
  };

  if (!selectedTenantId) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
          <Stack size={32} weight="duotone" className="text-blue-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">No tenant selected</h2>
        <p className="text-sm text-gray-500">Select a tenant from the sidebar to view inventory</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500 mt-0.5">Monitor stock levels</p>
        </div>
        <TenantDropdown />
      </div>

      {/* Alert Card */}
      {belowThreshold > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-center space-x-4 shadow-sm">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <WarningCircle size={22} weight="fill" className="text-red-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-800">
              <span className="text-lg">{belowThreshold}</span> products below reorder threshold
            </p>
            <p className="text-xs text-red-600 mt-0.5">These products require immediate restocking</p>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search inventory..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
        </div>
        <select value={`${sortBy}-${sortOrder}`} onChange={e => { const [s,o] = e.target.value.split('-'); setSortBy(s); setSortOrder(o); }}
          className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm shadow-sm">
          <option value="name-ASC">Name A-Z</option>
          <option value="currentStock-ASC">Stock Low-High</option>
          <option value="currentStock-DESC">Stock High-Low</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Name</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cost/Unit</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Stock</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reorder At</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">No inventory records found</td></tr>
            ) : items.map(item => {
              const isLow = item.currentStock < item.Product?.reorderThreshold;
              return (
                <tr key={item.id} className={`hover:bg-blue-50/30 transition-colors cursor-pointer ${isLow ? 'bg-red-50/30' : ''}`} onClick={() => navigate(`/inventory/${item.id}`)}>
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{item.Product?.name}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500 font-mono">{item.Product?.sku}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">${Number(item.Product?.costPerUnit).toFixed(2)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-semibold ${isLow ? 'bg-red-100 text-red-700' : 'text-blue-600'}`}>
                      {item.currentStock}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{item.Product?.reorderThreshold}</td>
                  <td className="px-5 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                    <ActionMenu
                      onView={() => navigate(`/inventory/${item.id}`)}
                      onEdit={() => navigate(`/inventory/${item.id}/edit`)}
                      onDelete={() => setDeleteId(item.id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination page={page} total={total} limit={limit} onPageChange={p => dispatch(fetchInventory({ tenantId: selectedTenantId, search, page: p, limit, sortBy, sortOrder }))} />

      <DeleteModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Inventory Record" message="Are you sure you want to delete this inventory record?" />
    </div>
  );
}
