import React, { useState, useEffect } from 'react';
import { vehicleApi } from '../../services/vehicleApi';
import Button from '../../components/Button';
import SearchBar from '../../components/SearchBar';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';
import { Plus } from 'lucide-react';

const Vehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await vehicleApi.getAll();
        setVehicles(response.data);
      } catch (error) {
        console.error('Failed to fetch vehicles', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Vehicles</h1>
        <Button className="flex items-center gap-2">
          <Plus size={16} /> Add Vehicle
        </Button>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="mb-4 max-w-md">
          <SearchBar placeholder="Search vehicles by registration or make..." />
        </div>
        
        {loading ? (
          <div className="py-12"><Loader /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Registration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Make / Model</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {vehicles.map((v) => (
                  <tr key={v._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{v.registrationNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{v.name} ({v.type})</td>
                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={v.status} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vehicle;
