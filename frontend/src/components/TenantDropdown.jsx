import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTenant } from '../store/uiSlice';
import { CaretDown } from '@phosphor-icons/react';

export default function TenantDropdown() {
  const dispatch = useDispatch();
  const tenants = useSelector(state => state.tenants.items);
  const selectedTenantId = useSelector(state => state.ui.selectedTenantId);

  return (
    <div className="relative">
      <select
        className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm cursor-pointer"
        value={selectedTenantId || ''}
        onChange={e => dispatch(setSelectedTenant(e.target.value ? Number(e.target.value) : null))}
      >
        <option value="">Select Tenant...</option>
        {tenants.filter(t => t.status === 'Active').map(tenant => (
          <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
        ))}
      </select>
      <CaretDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}
