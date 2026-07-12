import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
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
        
        <div className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
            <User className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium text-slate-700 hidden sm:block pr-2">Admin User</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
