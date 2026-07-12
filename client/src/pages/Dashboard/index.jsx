import React, { useState, useEffect } from 'react';
import { Truck, Activity, Wrench, Map, Clock, Users, PieChart, Download } from 'lucide-react';
import { reportApi } from '../../services/reportApi';
import { driverApi } from '../../services/driverApi';
import Loader from '../../components/Loader';

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
  const [kpis, setKpis] = useState(null);
  const [financials, setFinancials] = useState([]);
  const [driversCount, setDriversCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [kpiRes, driverRes, finRes] = await Promise.all([
        reportApi.getDashboardKPIs(),
        driverApi.getAll(),
        reportApi.getVehicleFinancials().catch(() => ({ data: [] }))
      ]);
      setKpis(kpiRes.data || {});
      setDriversCount(Array.isArray(driverRes.data) ? driverRes.data.length : 0);
      setFinancials(Array.isArray(finRes.data) ? finRes.data : []);
    } catch (error) {
      console.error('Failed to fetch dashboard live reports:', error);
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

  const vehicleCounts = kpis?.vehicleCounts || {};

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
          colorClass="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Available Vehicles" 
          value={vehicleCounts.Available || 0} 
          icon={Truck} 
          colorClass="bg-emerald-100 text-emerald-600" 
        />
        <StatCard 
          title="Active Vehicles" 
          value={vehicleCounts['On Trip'] || 0} 
          icon={Activity} 
          colorClass="bg-indigo-100 text-indigo-600" 
        />
        <StatCard 
          title="In Maintenance" 
          value={vehicleCounts['In Shop'] || 0} 
          icon={Wrench} 
          colorClass="bg-red-100 text-red-600" 
        />
        <StatCard 
          title="Active Trips" 
          value={kpis?.activeTrips || 0} 
          icon={Map} 
          colorClass="bg-purple-100 text-purple-600" 
        />
        <StatCard 
          title="Pending Trips" 
          value={kpis?.pendingTrips || 0} 
          icon={Clock} 
          colorClass="bg-amber-100 text-amber-600" 
        />
        <StatCard 
          title="Drivers On Duty" 
          value={driversCount} 
          icon={Users} 
          colorClass="bg-teal-100 text-teal-600" 
        />
      </div>
      
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
    </div>
  );
};

export default Dashboard;
