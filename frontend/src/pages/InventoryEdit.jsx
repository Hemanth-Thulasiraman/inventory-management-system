import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';
import { fetchInventoryById, updateInventory } from '../store/inventorySlice';

export default function InventoryEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current: inventory } = useSelector(state => state.inventory);
  const [currentStock, setCurrentStock] = useState(0);

  useEffect(() => { dispatch(fetchInventoryById(id)); }, [dispatch, id]);
  useEffect(() => { if (inventory) setCurrentStock(inventory.currentStock); }, [inventory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateInventory({ id: parseInt(id), currentStock: parseInt(currentStock) }));
    navigate('/inventory');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/inventory')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Inventory</h1>
            <p className="text-sm text-gray-500">Update inventory stock level</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/inventory')} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save Changes</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input type="text" value={inventory?.Product?.name || ''} disabled
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
            <input type="text" value={inventory?.Product?.sku || ''} disabled
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock <span className="text-red-500">*</span></label>
            <input type="number" value={currentStock} onChange={e => setCurrentStock(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
          </div>
        </form>
      </div>
    </div>
  );
}
