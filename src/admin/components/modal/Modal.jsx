import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className={`bg-slate-800 border border-slate-700 rounded-xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto p-6 text-slate-100 shadow-2xl relative font-sans`}>
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-700 mb-6">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};
