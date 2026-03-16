import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass, Plus, Buildings } from '@phosphor-icons/react';
import { fetchTenants, deleteTenant } from '../store/tenantSlice';
import Pagination from '../components/Pagination';
import ActionMenu from '../components/ActionMenu';
import StatusBadge from '../components/StatusBadge';
import DeleteModal from '../components/DeleteModal';

export default function TenantList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, page, loading } = useSelector(state => state.tenants);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [deleteId, setDeleteId] = useState(null);
  const limit = 10;

  useEffect(() => {
    dispatch(fetchTenants({ search, page, limit, sortBy, sortOrder }));
  }, [dispatch, search, page, sortBy, sortOrder]);

  const handleDelete = async () => {
    await dispatch(deleteTenant(deleteId));
    setDeleteId(null);
    dispatch(fetchTenants({ search, page: 1, limit, sortBy, sortOrder }));
  };

  const activeCount = items.filter(t => t.status === 'Active').length;
  const inactiveCount = items.filter(t => t.status === 'Inactive').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your organizations</p>
        </div>
        <button onClick={() => navigate('/tenants/new')} className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
          <Plus size={16} weight="bold" />
          <span>New Tenant</span>
        </button>
      </div>

      {/* Summary Tiles */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Tenants</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{total}</p>
              <p className="text-xs text-gray-400 mt-0.5">tracked organizations</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Buildings size={24} weight="duotone" className="text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active / Inactive</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                <span className="text-green-600">{activeCount}</span>
                <span className="text-gray-300 mx-1">/</span>
                <span className="text-gray-400">{inactiveCount}</span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">organization status</p>
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
          <input type="text" placeholder="Search tenants..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
        </div>
        <select value={`${sortBy}-${sortOrder}`} onChange={e => { const [s, o] = e.target.value.split('-'); setSortBy(s); setSortOrder(o); }}
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
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tenant ID</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tenant Name</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={4} className="px-5 py-12 text-center text-gray-400">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-12 text-center text-gray-400">No tenants found</td></tr>
            ) : items.map(tenant => (
              <tr key={tenant.id} className="hover:bg-blue-50/30 transition-colors cursor-pointer" onClick={() => navigate(`/tenants/${tenant.id}/edit`)}>
                <td className="px-5 py-3.5 text-sm text-gray-500 font-mono">{tenant.tenantId}</td>
                <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{tenant.name}</td>
                <td className="px-5 py-3.5"><StatusBadge status={tenant.status} /></td>
                <td className="px-5 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                  <ActionMenu
                    onView={() => navigate(`/tenants/${tenant.id}`)}
                    onEdit={() => navigate(`/tenants/${tenant.id}/edit`)}
                    onDelete={() => setDeleteId(tenant.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} total={total} limit={limit} onPageChange={p => dispatch(fetchTenants({ search, page: p, limit, sortBy, sortOrder }))} />

      <DeleteModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Tenant" message="Are you sure you want to delete this tenant? All associated data will be removed." />
    </div>
  );
}
