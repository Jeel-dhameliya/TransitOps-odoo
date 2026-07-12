import React, { useContext } from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 shadow-sm">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md md:hidden p-2"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="md:hidden ml-4 text-xl font-bold text-blue-600 tracking-tight">TransitOps</div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-slate-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-slate-100 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-bold text-slate-700 leading-tight">{user?.name || 'User'}</span>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{user?.role || 'Guest'}</span>
          </div>
          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200 shadow-sm cursor-pointer hover:bg-blue-200 transition-colors">
            <User className="h-5 w-5" />
          </div>
          <button 
            onClick={logout}
            className="ml-2 px-3 py-1.5 text-sm font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
