import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';
import { fetchTenantById, updateTenant } from '../store/tenantSlice';

export default function TenantEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current } = useSelector(state => state.tenants);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Active');
  const [error, setError] = useState('');

  useEffect(() => {
    dispatch(fetchTenantById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (current) {
      setName(current.name);
      setStatus(current.status);
    }
  }, [current]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Tenant name is required'); return; }
    const result = await dispatch(updateTenant({ id, name: name.trim(), status }));
    if (result.meta.requestStatus === 'rejected') {
      setError(result.payload?.message || 'Failed to update tenant');
    } else {
      navigate('/tenants');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/tenants')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Tenant</h1>
            <p className="text-sm text-gray-500">Update tenant information</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/tenants')} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save Changes</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tenant Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={status === 'Active'} onChange={e => setStatus(e.target.checked ? 'Active' : 'Inactive')} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
              <span className="ml-3 text-sm text-gray-700">{status}</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
