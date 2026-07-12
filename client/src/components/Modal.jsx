import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-lg p-6 mx-auto bg-white rounded-xl shadow-2xl z-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
          <button
            className="p-1 ml-auto bg-transparent border-0 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        <div className="relative flex-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
