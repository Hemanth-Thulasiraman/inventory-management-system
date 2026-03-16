import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, PencilSimple, Trash } from '@phosphor-icons/react';
import { fetchOrderById, confirmOrder, cancelOrder, deleteOrder } from '../store/orderSlice';
import StatusBadge from '../components/StatusBadge';
import DeleteModal from '../components/DeleteModal';

export default function OrderDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current: order } = useSelector(state => state.orders);
  const [showDelete, setShowDelete] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { dispatch(fetchOrderById(id)); }, [dispatch, id]);

  const handleDelete = async () => {
    await dispatch(deleteOrder(id));
    navigate('/orders');
  };

  const handleConfirm = async () => {
    const result = await dispatch(confirmOrder(id));
    if (result.meta.requestStatus === 'fulfilled') {
      setMessage('Order confirmed successfully!');
      dispatch(fetchOrderById(id));
    } else {
      setMessage(result.payload?.message || 'Failed to confirm order. Insufficient inventory.');
    }
  };

  const handleCancel = async () => {
    await dispatch(cancelOrder(id));
    setMessage('Order cancelled.');
    dispatch(fetchOrderById(id));
  };

  if (!order) return <div className="text-center py-8 text-gray-500">Loading...</div>;
  const product = order.Product;
  const inventory = product?.Inventory;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Link to="/orders" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft size={16} className="mr-1" /> Back to Orders
        </Link>
        <div className="flex items-center space-x-2">
          <button onClick={() => navigate(`/orders/${id}/edit`)} className="p-2 hover:bg-gray-100 rounded-lg">
            <PencilSimple size={20} className="text-gray-600" />
          </button>
          <button onClick={() => setShowDelete(true)} className="p-2 hover:bg-gray-100 rounded-lg">
            <Trash size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes('Failed') || message.includes('Insufficient') ? 'bg-red-50 border border-red-200 text-red-600' : 'bg-green-50 border border-green-200 text-green-600'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-purple-600 font-semibold text-sm">{order.orderId?.slice(-4)}</span>
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-semibold text-gray-900">{order.orderId}</h2>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-sm text-gray-500">
              Product: <Link to={`/products/${product?.id}`} className="text-blue-600 hover:underline">{product?.name}</Link> • {order.Tenant?.name}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">Requested Quantity</p>
          <p className="text-lg font-semibold text-gray-900">{order.quantity}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">Cost per Unit</p>
          <p className="text-lg font-semibold text-gray-900">${Number(product?.costPerUnit).toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">Current Stock</p>
          <p className="text-lg font-semibold text-blue-600">{inventory?.currentStock ?? 'N/A'}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">Reorder Point</p>
          <p className="text-lg font-semibold text-gray-900">{product?.reorderThreshold}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Additional Information</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-1">Order Notes</p>
          <p className="text-sm text-gray-700">{order.notes || 'No notes provided.'}</p>
        </div>
      </div>

      {(order.status === 'Created' || order.status === 'Pending') && (
        <div className="flex items-center space-x-3">
          <button onClick={handleConfirm} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Confirm</button>
          <button onClick={handleCancel} className="px-6 py-2.5 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50">Cancel Order</button>
        </div>
      )}

      <DeleteModal isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete}
        title="Delete Order" message="Are you sure you want to delete this order?" />
    </div>
  );
}
