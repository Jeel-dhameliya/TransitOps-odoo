import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Truck, Users, Map, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useContext(AuthContext);
  
  const allNavItems = [
    { name: 'Vehicles', path: '/vehicles', icon: Truck, roles: ['Fleet Manager'] },
    { name: 'Drivers', path: '/drivers', icon: Users, roles: ['Safety Officer'] },
    { name: 'Trips', path: '/trips', icon: Map, roles: ['Dispatcher'] },
  ];

  // Filter items based on role. (In the future, add other roles' pages)
  const navItems = allNavItems.filter(item => user && item.roles.includes(user.role));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#171e28] text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-[#0f151c] border-b border-slate-800">
          <span className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 border border-amber-500 rounded flex items-center justify-center text-amber-500 bg-amber-500/10">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z"/><path d="M4 8h16"/><path d="M4 12h16"/><path d="M4 16h16"/><path d="M8 4v16"/><path d="M12 4v16"/><path d="M16 4v16"/></svg>
            </div>
            <span>Transit<span className="text-slate-300 font-normal">Ops</span></span>
          </span>
          <button onClick={toggleSidebar} className="md:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-2 px-2">
            Management
          </div>
          {navItems.length > 0 ? navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-900/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon size={20} className="shrink-0" />
                <span className="font-medium text-sm">{item.name}</span>
              </NavLink>
            );
          }) : (
            <div className="text-sm text-slate-500 px-3 py-2 italic font-[cursive]">
              Features for {user?.role} are under construction.
            </div>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
