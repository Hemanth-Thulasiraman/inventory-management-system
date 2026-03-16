import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, PencilSimple, Trash } from '@phosphor-icons/react';
import { fetchProductById, deleteProduct } from '../store/productSlice';
import { updateInventory } from '../store/inventorySlice';
import StatusBadge from '../components/StatusBadge';
import DeleteModal from '../components/DeleteModal';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current: product } = useSelector(state => state.products);
  const [showDelete, setShowDelete] = useState(false);
  const [stockValue, setStockValue] = useState('');

  useEffect(() => { dispatch(fetchProductById(id)); }, [dispatch, id]);

  useEffect(() => {
    if (product?.Inventory) setStockValue(product.Inventory.currentStock);
  }, [product]);

  const handleDelete = async () => {
    await dispatch(deleteProduct(id));
    navigate('/products');
  };

  const handleUpdateStock = async () => {
    if (product?.Inventory?.id) {
      await dispatch(updateInventory({ id: product.Inventory.id, currentStock: parseInt(stockValue) }));
      dispatch(fetchProductById(id));
    }
  };

  if (!product) return <div className="text-center py-8 text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Link to="/products" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft size={16} className="mr-1" /> Back to Products
        </Link>
        <div className="flex items-center space-x-2">
          <button onClick={() => navigate(`/products/${id}/edit`)} className="p-2 hover:bg-gray-100 rounded-lg">
            <PencilSimple size={20} className="text-gray-600" />
          </button>
          <button onClick={() => setShowDelete(true)} className="p-2 hover:bg-gray-100 rounded-lg">
            <Trash size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-600 font-semibold text-lg">{product.name.charAt(0)}</span>
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
              <StatusBadge status={product.status} />
            </div>
            <p className="text-sm text-gray-500">{product.sku} • {product.Tenant?.name}</p>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">Category</p>
          <p className="text-lg font-semibold text-gray-900">{product.category}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">Cost per Unit</p>
          <p className="text-lg font-semibold text-gray-900">${Number(product.costPerUnit).toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">Current Stock</p>
          <p className="text-lg font-semibold text-blue-600">{product.Inventory?.currentStock ?? 0}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">Reorder Point</p>
          <p className="text-lg font-semibold text-gray-900">{product.reorderThreshold}</p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Additional Information</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-1">Description</p>
          <p className="text-sm text-gray-700">{product.description || 'No description provided.'}</p>
        </div>
      </div>

      {/* Quick Update */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Inventory Quick Update</h3>
        </div>
        <div className="p-6 flex items-end space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
            <input type="number" value={stockValue} onChange={e => setStockValue(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-40" />
          </div>
          <button onClick={handleUpdateStock} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Update Stock</button>
        </div>
      </div>

      <DeleteModal isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete}
        title="Delete Product" message="Are you sure? This will also remove associated inventory records." />
    </div>
  );
}
