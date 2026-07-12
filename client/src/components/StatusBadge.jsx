import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'completed':
      case 'available':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'inactive':
      case 'cancelled':
      case 'unavailable':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
      case 'in-transit':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
