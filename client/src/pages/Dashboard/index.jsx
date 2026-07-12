import React, { useState, useEffect } from 'react';
import { Truck, Activity, Wrench, Map, Clock, Users, PieChart } from 'lucide-react';
import api from '../../services/api';
import { tripApi } from '../../services/tripApi';
import { driverApi } from '../../services/driverApi';
import SearchBar from '../../components/SearchBar';
import Loader from '../../components/Loader';

const StatCard = ({ title, value, colorClass }) => (
  <div className={`bg-white p-4 rounded-md shadow-sm border border-slate-200 border-l-4 ${colorClass} flex flex-col justify-center min-h-[90px]`}>
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
    <h3 className="text-2xl font-extrabold text-slate-800">{value}</h3>
  </div>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentTrips, setRecentTrips] = useState([]);
  const [driversOnDuty, setDriversOnDuty] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportRes, tripsRes, driversRes] = await Promise.all([
          api.get('/reports/dashboard'),
          tripApi.getAll(),
          driverApi.getAll()
        ]);
        
        setStats(reportRes.data);
        
        // Get 5 most recent trips
        const sortedTrips = tripsRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
        setRecentTrips(sortedTrips);
        
        const activeDrivers = driversRes.data.filter(d => d.status === 'On Duty' || d.status === 'On Trip').length;
        setDriversOnDuty(activeDrivers);
        
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return <div className="py-12"><Loader /></div>;

  const vCounts = stats?.vehicleCounts || { Available: 0, 'On Trip': 0, 'In Shop': 0, Retired: 0 };
  const activeVehicles = vCounts.Available + vCounts['On Trip'];

  return (
    <div className="space-y-8">
      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-slate-200 pb-4">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">FILTERS</span>
        <select className="p-2 border border-slate-300 rounded text-sm min-w-[150px]">
          <option>Vehicle Type: All</option>
        </select>
        <select className="p-2 border border-slate-300 rounded text-sm min-w-[150px]">
          <option>Status: All</option>
        </select>
        <select className="p-2 border border-slate-300 rounded text-sm min-w-[150px]">
          <option>Region: All</option>
        </select>
      </div>

      {/* KPI Row (Matches Wireframe Content) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <StatCard title="ACTIVE VEHICLES" value={activeVehicles} colorClass="border-blue-500" />
        <StatCard title="AVAILABLE VEHICLES" value={vCounts.Available} colorClass="border-green-500" />
        <StatCard title="VEHICLES IN MAINTENANCE" value={vCounts['In Shop']} colorClass="border-orange-500" />
        <StatCard title="ACTIVE TRIPS" value={stats?.activeTrips || 0} colorClass="border-blue-500" />
        <StatCard title="PENDING TRIPS" value={stats?.pendingTrips || 0} colorClass="border-blue-500" />
        <StatCard title="DRIVERS ON DUTY" value={driversOnDuty} colorClass="border-blue-500" />
        <StatCard title="FLEET UTILIZATION" value={stats?.fleetUtilization || '0%'} colorClass="border-green-500" />
      </div>

      {/* Two Column Layout Below */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Trips Table */}
        <div className="lg:col-span-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">RECENT TRIPS</h3>
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
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

        {/* Right Column: Vehicle Status Bars */}
        <div className="lg:col-span-1">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">VEHICLE STATUS</h3>
          
          <div className="space-y-6 mt-6">
            
            {/* Available */}
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>Available</span>
                <span>{vCounts.Available}</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full" style={{ width: `${(vCounts.Available / Math.max(activeVehicles, 1)) * 100}%` }}></div>
              </div>
            </div>

            {/* On Trip */}
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>On Trip</span>
                <span>{vCounts['On Trip']}</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: `${(vCounts['On Trip'] / Math.max(activeVehicles, 1)) * 100}%` }}></div>
              </div>
            </div>

            {/* In Shop */}
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>In Shop</span>
                <span>{vCounts['In Shop']}</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full" style={{ width: `${(vCounts['In Shop'] / Math.max(activeVehicles, 1)) * 100}%` }}></div>
              </div>
            </div>

            {/* Retired */}
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>Retired</span>
                <span>{vCounts.Retired}</span>
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
