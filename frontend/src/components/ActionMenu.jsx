import { useState, useRef, useEffect } from 'react';
import { DotsThreeVertical, Eye, PencilSimple, Trash } from '@phosphor-icons/react';

export default function ActionMenu({ onView, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(prev => !prev); }}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <DotsThreeVertical size={18} weight="bold" className="text-gray-400" />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20 animate-in fade-in duration-100">
          <button
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => { onView(); setOpen(false); }}
          >
            <Eye size={16} className="mr-2.5 text-gray-400" />
            View
          </button>
          <button
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => { onEdit(); setOpen(false); }}
          >
            <PencilSimple size={16} className="mr-2.5 text-gray-400" />
            Edit
          </button>
          <div className="my-1 border-t border-gray-100"></div>
          <button
            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            onClick={() => { onDelete(); setOpen(false); }}
          >
            <Trash size={16} className="mr-2.5 text-red-400" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
