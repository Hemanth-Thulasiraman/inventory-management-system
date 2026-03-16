import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';
import { fetchProductById, updateProduct, createProduct } from '../store/productSlice';

export default function ProductEdit() {
  const { id } = useParams();
  const isEdit = !!id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current } = useSelector(state => state.products);
  const selectedTenantId = useSelector(state => state.ui.selectedTenantId);

  const [form, setForm] = useState({
    sku: '', name: '', description: '', category: 'Chemicals',
    reorderThreshold: 0, costPerUnit: 0, status: 'Active',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) dispatch(fetchProductById(id));
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && current) {
      setForm({
        sku: current.sku, name: current.name, description: current.description || '',
        category: current.category, reorderThreshold: current.reorderThreshold,
        costPerUnit: current.costPerUnit, status: current.status,
      });
    }
  }, [current, isEdit]);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.sku.trim() || !form.name.trim() || !form.category || !form.reorderThreshold || !form.costPerUnit) {
      setError('Please fill all required fields'); return;
    }
    const data = { ...form, reorderThreshold: parseInt(form.reorderThreshold), costPerUnit: parseFloat(form.costPerUnit) };
    let result;
    if (isEdit) {
      result = await dispatch(updateProduct({ id, ...data }));
    } else {
      result = await dispatch(createProduct({ ...data, tenantId: selectedTenantId }));
    }
    if (result.meta.requestStatus === 'rejected') {
      setError(result.payload?.message || 'Operation failed');
    } else {
      navigate('/products');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/products')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Product' : 'Create Product'}</h1>
            <p className="text-sm text-gray-500">{isEdit ? 'Update product information' : 'Add a new product to the catalog'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/products')} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save Changes</button>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU <span className="text-red-500">*</span></label>
              {isEdit ? (
                <div>
                  <input type="text" value={form.sku} disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500" />
                  <p className="mt-1 text-xs text-gray-400">SKU cannot be changed after creation</p>
                </div>
              ) : (
                <input type="text" value={form.sku} onChange={e => handleChange('sku', e.target.value)}
                  placeholder="e.g. ADH-100" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name <span className="text-red-500">*</span></label>
              <input type="text" value={form.name} onChange={e => handleChange('name', e.target.value)}
                placeholder="e.g. Industrial Adhesive" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={e => handleChange('description', e.target.value)} rows={3}
              placeholder="Product description..." className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
              <select value={form.category} onChange={e => handleChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Chemicals</option><option>Metals</option><option>Plastics</option><option>Electronics</option><option>Textiles</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Threshold <span className="text-red-500">*</span></label>
              <input type="number" value={form.reorderThreshold} onChange={e => handleChange('reorderThreshold', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost per Unit <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input type="number" step="0.01" value={form.costPerUnit} onChange={e => handleChange('costPerUnit', e.target.value)}
                  className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="flex items-center mt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={form.status === 'Active'} onChange={e => handleChange('status', e.target.checked ? 'Active' : 'Inactive')} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
                <span className="ml-3 text-sm text-gray-700">{form.status}</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
