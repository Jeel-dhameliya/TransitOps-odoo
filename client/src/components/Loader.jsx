import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ className = '', size = 24 }) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Loader2 size={size} className="animate-spin text-blue-600" />
    </div>
  );
};

export default Loader;
