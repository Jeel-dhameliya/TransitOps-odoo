import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ className = '', size = 32 }) => {
  return (
    <div className={`flex justify-center items-center h-48 w-full ${className}`}>
      <div className="relative flex justify-center items-center">
        <div className="absolute animate-ping inline-flex h-12 w-12 rounded-full bg-blue-400 opacity-20"></div>
        <Loader2 size={size} className="animate-spin text-blue-600 relative z-10" />
      </div>
    </div>
  );
};

export default Loader;
