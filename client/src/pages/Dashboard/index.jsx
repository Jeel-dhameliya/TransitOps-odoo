import React from 'react';
import { Truck, Activity, Wrench, Map, Clock, Users, PieChart } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-3xl font-extrabold text-slate-800">{value}</h3>
    </div>
    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${colorClass}`}>
      <Icon className="w-7 h-7" />
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Operations Dashboard</h1>
          <p className="text-slate-500 font-medium">Real-time overview of your transit operations</p>
        </div>
        
        {/* Filters */}
        <div className="flex gap-3 w-full sm:w-auto">
          <select className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1">
            <option value="all">All Vehicle Types</option>
            <option value="van">Vans</option>
            <option value="truck">Trucks</option>
          </select>
          <select className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1">
            <option value="all">All Regions</option>
            <option value="north">North</option>
            <option value="south">South</option>
          </select>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Fleet Utilization" 
          value="82%" 
          icon={PieChart} 
          colorClass="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Available Vehicles" 
          value="12" 
          icon={Truck} 
          colorClass="bg-emerald-100 text-emerald-600" 
        />
        <StatCard 
          title="Active Vehicles" 
          value="45" 
          icon={Activity} 
          colorClass="bg-indigo-100 text-indigo-600" 
        />
        <StatCard 
          title="In Maintenance" 
          value="3" 
          icon={Wrench} 
          colorClass="bg-red-100 text-red-600" 
        />
        <StatCard 
          title="Active Trips" 
          value="28" 
          icon={Map} 
          colorClass="bg-purple-100 text-purple-600" 
        />
        <StatCard 
          title="Pending Trips" 
          value="7" 
          icon={Clock} 
          colorClass="bg-amber-100 text-amber-600" 
        />
        <StatCard 
          title="Drivers On Duty" 
          value="45" 
          icon={Users} 
          colorClass="bg-teal-100 text-teal-600" 
        />
      </div>
      
      {/* Visual Analytics Placeholder */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <PieChart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">Analytics Charts</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">Visual charts and operational insights will be populated here when real data is integrated.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
