import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { tripApi } from '../../services/tripApi';
import { vehicleApi } from '../../services/vehicleApi';
import { driverApi } from '../../services/driverApi';
import Button from '../../components/Button';
import SearchBar from '../../components/SearchBar';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { Plus } from 'lucide-react';

const Trip = () => {
  const [trips, setTrips] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    vehicle: '',
    driver: '',
    cargoWeight: '',
    plannedDistance: ''
  });

  const fetchData = async () => {
    try {
      const [tripsRes, vehiclesRes, driversRes] = await Promise.all([
        tripApi.getAll(),
        vehicleApi.getAll(),
        driverApi.getAll()
      ]);
      setTrips(tripsRes.data);
      // Only keep Available assets for the dropdown
      setVehicles(vehiclesRes.data.filter(v => v.status === 'Available'));
      setDrivers(driversRes.data.filter(d => d.status === 'Available'));
    } catch (error) {
      console.error('Failed to fetch trip data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await tripApi.create({
        ...formData,
        cargoWeight: Number(formData.cargoWeight),
        plannedDistance: Number(formData.plannedDistance)
      });
      setIsModalOpen(false);
      setFormData({
        source: '',
        destination: '',
        vehicle: '',
        driver: '',
        cargoWeight: '',
        plannedDistance: ''
      });
      toast.success('Trip created successfully!');
      fetchData(); // Refresh the list
    } catch (error) {
      console.error('Failed to create trip:', error);
      toast.error(error.response?.data?.message || 'Failed to create trip');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id, action) => {
    try {
      if (action === 'dispatch') {
        await tripApi.dispatch(id);
        toast.success('Trip dispatched! Assets are now On Trip.');
      } else if (action === 'complete') {
        const finalOdometer = prompt("Enter final odometer reading (optional):", "0");
        if (finalOdometer === null) return; // User cancelled
        await tripApi.complete(id, finalOdometer);
        toast.success('Trip completed! Assets are now Available.');
      } else if (action === 'cancel') {
        await tripApi.cancel(id);
        toast.info('Trip cancelled.');
      }
      fetchData();
    } catch (error) {
      console.error('Failed to update trip status', error);
      toast.error(error.response?.data?.message || 'Failed to update trip status');
    }
  };

  const filteredTrips = trips.filter(t => 
    (t.source || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.destination || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.vehicle?.registrationNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.driver?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Trip Dispatch</h1>
        <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Create Trip
        </Button>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="mb-4 max-w-md">
          <SearchBar 
            placeholder="Search trips by destination, source, vehicle, or driver..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {loading ? (
          <div className="py-12"><Loader /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Driver</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Load / Dist.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredTrips.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                      {t.source} <span className="text-slate-400 mx-1">→</span> {t.destination}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {t.vehicle?.registrationNumber || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {t.driver?.name || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {t.cargoWeight} kg / {t.plannedDistance} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={t.status} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      {t.status === 'Draft' && (
                        <>
                          <button onClick={() => handleStatusChange(t._id, 'dispatch')} className="text-blue-600 hover:text-blue-900">Dispatch</button>
                        </>
                      )}
                      {t.status === 'Dispatched' && (
                        <>
                          <button onClick={() => handleStatusChange(t._id, 'complete')} className="text-green-600 hover:text-green-900">Complete</button>
                          <button onClick={() => handleStatusChange(t._id, 'cancel')} className="text-red-600 hover:text-red-900">Cancel</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredTrips.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500 text-sm">
                      {searchTerm ? 'No trips match your search.' : 'No trips found. Click "Create Trip" to start dispatching.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Trip">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
              <input type="text" name="source" required value={formData.source} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g. Warehouse A" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Destination</label>
              <input type="text" name="destination" required value={formData.destination} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g. Retail Store B" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Assign Vehicle</label>
            <select name="vehicle" required value={formData.vehicle} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Select an available vehicle...</option>
              {vehicles.map(v => (
                <option key={v._id} value={v._id}>{v.registrationNumber} - {v.name} (Cap: {v.maxLoadCapacity}kg)</option>
              ))}
            </select>
            {vehicles.length === 0 && <p className="text-xs text-red-500 mt-1">No available vehicles. Return vehicles from trips first.</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Assign Driver</label>
            <select name="driver" required value={formData.driver} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Select an available driver...</option>
              {drivers.map(d => (
                <option key={d._id} value={d._id}>{d.name} (Score: {d.safetyScore})</option>
              ))}
            </select>
            {drivers.length === 0 && <p className="text-xs text-red-500 mt-1">No available drivers.</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cargo Weight (kg)</label>
              <input type="number" name="cargoWeight" required min="1" value={formData.cargoWeight} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Planned Distance (km)</label>
              <input type="number" name="plannedDistance" required min="1" value={formData.plannedDistance} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
            <Button type="submit" disabled={isSubmitting || vehicles.length === 0 || drivers.length === 0}>
              {isSubmitting ? 'Creating...' : 'Create Trip Draft'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Trip;
