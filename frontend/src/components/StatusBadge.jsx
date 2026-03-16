const colorMap = {
  Active: 'bg-green-50 text-green-700 ring-green-600/20',
  Created: 'bg-green-50 text-green-700 ring-green-600/20',
  Inactive: 'bg-gray-50 text-gray-600 ring-gray-500/10',
  Cancelled: 'bg-gray-50 text-gray-600 ring-gray-500/10',
  Pending: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  Confirmed: 'bg-blue-50 text-blue-700 ring-blue-600/20',
};

export default function StatusBadge({ status }) {
  const colorClass = colorMap[status] || 'bg-gray-50 text-gray-600 ring-gray-500/10';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ring-1 ring-inset ${colorClass}`}>
      {status}
    </span>
  );
}
