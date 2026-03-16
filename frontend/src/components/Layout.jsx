import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Buildings, Package, Stack, ShoppingCart, CaretDown, SignOut } from '@phosphor-icons/react';
import { fetchTenants } from '../store/tenantSlice';
import { setSelectedTenant } from '../store/uiSlice';

const navItems = [
  { to: '/tenants', label: 'Tenants', icon: Buildings, description: 'Manage organizations' },
  { to: '/products', label: 'Products', icon: Package, description: 'Product catalog' },
  { to: '/inventory', label: 'Inventory', icon: Stack, description: 'Stock levels' },
  { to: '/orders', label: 'Orders', icon: ShoppingCart, description: 'Track orders' },
];

export default function Layout() {
  const dispatch = useDispatch();
  const location = useLocation();
  const tenants = useSelector(state => state.tenants.items);
  const selectedTenantId = useSelector(state => state.ui.selectedTenantId);
  const selectedTenant = tenants.find(t => t.id === selectedTenantId);

  // Fetch tenants on mount and auto-select first one
  useEffect(() => {
    dispatch(fetchTenants({ limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (tenants.length > 0 && !selectedTenantId) {
      dispatch(setSelectedTenant(tenants[0].id));
    }
  }, [tenants, selectedTenantId, dispatch]);

  const isTenantPage = location.pathname.startsWith('/tenants');

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="h-16 flex items-center px-5 border-b border-gray-100">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">
            IM
          </div>
          <div className="ml-3">
            <span className="font-semibold text-gray-900 text-sm">Inventory MS</span>
            <p className="text-[10px] text-gray-400 leading-tight">Management System</p>
          </div>
        </div>

        {/* Tenant Selector in Sidebar */}
        {!isTenantPage && (
          <div className="px-3 pt-4 pb-2">
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1.5 block">
              Workspace
            </label>
            <div className="relative">
              <select
                value={selectedTenantId || ''}
                onChange={e => dispatch(setSelectedTenant(e.target.value ? Number(e.target.value) : null))}
                className="w-full appearance-none bg-blue-50 border border-blue-100 text-blue-700 rounded-lg px-3 py-2 pr-8 text-sm font-medium cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select Tenant...</option>
                {tenants.filter(t => t.status === 'Active').map(tenant => (
                  <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                ))}
              </select>
              <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none" />
            </div>
          </div>
        )}

        <nav className="flex-1 px-3 py-3 space-y-0.5">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Navigation</p>
          {navItems.map(({ to, label, icon: Icon, description }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-100'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon size={20} weight="duotone" className="mr-3 flex-shrink-0" />
              <div>
                <span className="block">{label}</span>
                <span className="text-[10px] text-gray-400 group-hover:text-gray-500 font-normal">{description}</span>
              </div>
            </NavLink>
          ))}
        </nav>

        {/* User section at bottom */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center px-3 py-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-sm">
              JD
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
              <p className="text-[10px] text-gray-400 truncate">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center space-x-2">
            {selectedTenant && !isTenantPage && (
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-1.5">
                <Buildings size={14} className="text-gray-400" />
                <span className="text-xs font-medium text-gray-600">{selectedTenant.name}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-sm">
              JD
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
