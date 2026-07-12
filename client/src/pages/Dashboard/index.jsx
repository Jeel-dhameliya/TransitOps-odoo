import React, { useState, useEffect } from 'react';
import { Truck, Activity, Wrench, Map, Clock, Users, PieChart, Download } from 'lucide-react';
import api from '../../services/api';
import { tripApi } from '../../services/tripApi';
import { driverApi } from '../../services/driverApi';
import { reportApi } from '../../services/reportApi';
import SearchBar from '../../components/SearchBar';
import Loader from '../../components/Loader';

const StatCard = ({ title, value, colorClass, iconBgClass, icon: Icon }) => (
  <div className={`bg-white p-4 rounded-md shadow-sm border border-slate-200 border-l-4 ${colorClass} flex flex-col justify-center min-h-[90px]`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-extrabold text-slate-800">{value}</h3>
      </div>
      {Icon && (
        <div className={`p-2 rounded-lg ${iconBgClass || ''}`}>
          <Icon size={20} />
        </div>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [financials, setFinancials] = useState([]);
  const [driversCount, setDriversCount] = useState(0);
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [kpiRes, driverRes, finRes, tripsRes] = await Promise.all([
        reportApi.getDashboardKPIs().catch(() => ({ data: {} })),
        driverApi.getAll().catch(() => ({ data: [] })),
        reportApi.getVehicleFinancials().catch(() => ({ data: [] })),
        tripApi.getAll().catch(() => ({ data: [] }))
      ]);
      setKpis(kpiRes.data || {});
      
      const activeDrivers = Array.isArray(driverRes.data) 
        ? driverRes.data.filter(d => d.status === 'On Duty' || d.status === 'On Trip').length 
        : 0;
      setDriversCount(activeDrivers);
      
      setFinancials(Array.isArray(finRes.data) ? finRes.data : []);
      
      const sortedTrips = Array.isArray(tripsRes.data) 
        ? tripsRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5) 
        : [];
      setRecentTrips(sortedTrips);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const response = await reportApi.exportFinancialsCSV();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transitops_financial_report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to export CSV report:', error);
      alert('Failed to export financial report CSV.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader />
      </div>
    );
  }

  const vCounts = kpis?.vehicleCounts || { Available: 0, 'On Trip': 0, 'In Shop': 0, Retired: 0 };
  const activeVehicles = (vCounts.Available || 0) + (vCounts['On Trip'] || 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Operations Dashboard</h1>
          <p className="text-slate-500 font-medium">Real-time overview of your transit operations</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            <Download size={16} />
            {exporting ? 'Exporting...' : 'Export Financials CSV'}
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Fleet Utilization" 
          value={kpis?.fleetUtilization || '0%'} 
          icon={PieChart} 
          colorClass="border-blue-500"
          iconBgClass="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Available Vehicles" 
          value={vCounts.Available || 0} 
          icon={Truck} 
          colorClass="border-green-500"
          iconBgClass="bg-emerald-100 text-emerald-600" 
        />
        <StatCard 
          title="Active Vehicles" 
          value={vCounts['On Trip'] || 0} 
          icon={Activity} 
          colorClass="border-indigo-500"
          iconBgClass="bg-indigo-100 text-indigo-600" 
        />
        <StatCard 
          title="In Maintenance" 
          value={vCounts['In Shop'] || 0} 
          icon={Wrench} 
          colorClass="border-orange-500"
          iconBgClass="bg-red-100 text-red-600" 
        />
        <StatCard 
          title="Active Trips" 
          value={kpis?.activeTrips || 0} 
          icon={Map} 
          colorClass="border-purple-500"
          iconBgClass="bg-purple-100 text-purple-600" 
        />
        <StatCard 
          title="Pending Trips" 
          value={kpis?.pendingTrips || 0} 
          icon={Clock} 
          colorClass="border-amber-500"
          iconBgClass="bg-amber-100 text-amber-600" 
        />
        <StatCard 
          title="Drivers On Duty" 
          value={driversCount} 
          icon={Users} 
          colorClass="border-teal-500"
          iconBgClass="bg-teal-100 text-teal-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Tables */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Real-Time Operational & Financial Analytics Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Vehicle Operational & Financial Analytics</h3>
                <p className="text-sm text-slate-500">Live analytics derived from fuel logs, maintenance tickets, and completed trips</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Registration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vehicle Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total Distance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Operational Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fuel Efficiency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ROI</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {financials.map((v) => (
                    <tr key={v._id || v.registrationNumber} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{v.registrationNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{v.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{v.totalDistance || 0} km</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">${Number(v.operationalCost || 0).toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{Number(v.fuelEfficiency || 0).toFixed(2)} km/L</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">{Number(v.roi || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                  {financials.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-slate-500 text-sm">
                        No financial data available yet. Complete trips and log expenses to view live analytics.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Trips Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Recent Trips</h3>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">TRIP</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">VEHICLE</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">DRIVER</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">STATUS</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">ETA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentTrips.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-sm text-slate-500">No trips found.</td>
                    </tr>
                  )}
                  {recentTrips.map((trip, idx) => {
                    let statusBg = 'bg-slate-500';
                    if (trip.status === 'On Trip' || trip.status === 'Dispatched') statusBg = 'bg-blue-600';
                    if (trip.status === 'Completed') statusBg = 'bg-green-600';
                    
                    return (
                      <tr key={trip._id} className="text-sm">
                        <td className="px-4 py-3 font-semibold text-slate-700">TR00{idx + 1}</td>
                        <td className="px-4 py-3 text-slate-600">{trip.vehicle?.registrationNumber || '-'}</td>
                        <td className="px-4 py-3 text-slate-600">{trip.driver?.name || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${statusBg}`}>
                            {trip.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {trip.status === 'Draft' ? 'Awaiting vehicle' : 
                           trip.status === 'Completed' ? '-' : 
                           '~ 45 min'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Vehicle Status Bars */}
        <div className="lg:col-span-1">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">VEHICLE STATUS</h3>
          
          <div className="space-y-6 mt-6">
            
            {/* Available */}
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>Available</span>
                <span>{vCounts.Available || 0}</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full" style={{ width: `${((vCounts.Available || 0) / Math.max(activeVehicles, 1)) * 100}%` }}></div>
              </div>
            </div>

            {/* On Trip */}
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>On Trip</span>
                <span>{vCounts['On Trip'] || 0}</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: `${((vCounts['On Trip'] || 0) / Math.max(activeVehicles, 1)) * 100}%` }}></div>
              </div>
            </div>

            {/* In Shop */}
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>In Shop</span>
                <span>{vCounts['In Shop'] || 0}</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full" style={{ width: `${((vCounts['In Shop'] || 0) / Math.max(activeVehicles, 1)) * 100}%` }}></div>
              </div>
            </div>

            {/* Retired */}
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>Retired</span>
                <span>{vCounts.Retired || 0}</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full" style={{ width: '10%' }}></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
