import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';
import { createOrder } from '../store/orderSlice';
import { fetchActiveProducts } from '../store/productSlice';

export default function OrderCreate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedTenantId = useSelector(state => state.ui.selectedTenantId);
  const { activeProducts } = useSelector(state => state.products);
  const tenants = useSelector(state => state.tenants.items);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (selectedTenantId) dispatch(fetchActiveProducts({ tenantId: selectedTenantId }));
  }, [dispatch, selectedTenantId]);

  const tenantName = tenants.find(t => t.id === selectedTenantId)?.name || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId) { setError('Please select a product'); return; }
    if (quantity < 1) { setError('Quantity must be at least 1'); return; }

    const result = await dispatch(createOrder({ tenantId: selectedTenantId, productId: parseInt(productId), quantity: parseInt(quantity), notes: '' }));
    if (result.meta.requestStatus === 'fulfilled') {
      if (result.payload.status === 'Pending') {
        setStatusMessage('Order created with Pending status due to insufficient inventory.');
        setTimeout(() => navigate('/orders'), 2000);
      } else {
        navigate('/orders');
      }
    } else {
      setError(result.payload?.message || 'Failed to create order');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/orders')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Order</h1>
            <p className="text-sm text-gray-500">Create a new order{tenantName ? ` for ${tenantName}` : ''}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/orders')} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save Changes</button>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
      {statusMessage && <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">{statusMessage}</div>}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Product <span className="text-red-500">*</span></label>
              <select value={productId} onChange={e => { setProductId(e.target.value); setError(''); }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select a product...</option>
                {activeProducts.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Requested Quantity <span className="text-red-500">*</span></label>
              <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
