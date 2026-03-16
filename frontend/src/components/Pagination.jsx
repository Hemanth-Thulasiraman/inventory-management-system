import { CaretLeft, CaretRight } from '@phosphor-icons/react';

export default function Pagination({ page, total, limit, onPageChange }) {
  const totalPages = Math.ceil(total / limit);
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const pageNumbers = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
    pageNumbers.push(i);
  }

  if (totalPages <= 0) return null;

  return (
    <div className="flex items-center justify-between mt-5 px-1">
      <span className="text-sm text-gray-500">
        Showing <span className="font-medium text-gray-700">{from}</span> to <span className="font-medium text-gray-700">{to}</span> of <span className="font-medium text-gray-700">{total}</span> results
      </span>
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <CaretLeft size={14} />
        </button>
        {pageNumbers.map(p => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
              p === page
                ? 'bg-blue-600 text-white shadow-sm'
                : 'border border-gray-200 hover:bg-gray-50 text-gray-600'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <CaretRight size={14} />
        </button>
      </div>
    </div>
  );
}
