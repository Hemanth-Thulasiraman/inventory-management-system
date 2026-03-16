import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';
import { createTenant } from '../store/tenantSlice';

export default function TenantCreate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Tenant name is required'); return; }
    const result = await dispatch(createTenant({ name: name.trim() }));
    if (result.meta.requestStatus === 'rejected') {
      setError(result.payload?.message || 'Failed to create tenant');
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
            <h1 className="text-2xl font-bold text-gray-900">Create Tenant</h1>
            <p className="text-sm text-gray-500">Add a new tenant to the system</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/tenants')} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save Changes</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-3xl">
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tenant Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              placeholder="e.g. Stark Industries"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
