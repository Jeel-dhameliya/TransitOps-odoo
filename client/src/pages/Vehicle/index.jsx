import React, { useState, useEffect } from 'react';
import { vehicleApi } from '../../services/vehicleApi';
import Button from '../../components/Button';
import SearchBar from '../../components/SearchBar';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { Plus } from 'lucide-react';

const Vehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    registrationNumber: '',
    name: '',
    type: 'Truck',
    maxLoadCapacity: '',
    odometer: '',
    acquisitionCost: ''
  });

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

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await vehicleApi.create({
        ...formData,
        maxLoadCapacity: Number(formData.maxLoadCapacity),
        odometer: Number(formData.odometer) || 0,
        acquisitionCost: Number(formData.acquisitionCost)
      });
      setIsModalOpen(false);
      setFormData({
        registrationNumber: '',
        name: '',
        type: 'Truck',
        maxLoadCapacity: '',
        odometer: '',
        acquisitionCost: ''
      });
      fetchVehicles();
    } catch (error) {
      console.error('Failed to create vehicle:', error);
      alert(error.response?.data?.message || 'Failed to create vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await vehicleApi.delete(id);
        fetchVehicles();
      } catch (error) {
        console.error('Failed to delete vehicle', error);
        alert('Failed to delete vehicle');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Vehicles</h1>
        <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name / Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {vehicles.map((v) => (
                  <tr key={v._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{v.registrationNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{v.name} <span className="text-xs text-slate-400">({v.type})</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{v.maxLoadCapacity} kg</td>
                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={v.status} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleDelete(v._id)} className="text-red-600 hover:text-red-900 ml-4">Delete</button>
                    </td>
                  </tr>
                ))}
                {vehicles.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500 text-sm">
                      No vehicles found. Click "Add Vehicle" to register one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Vehicle">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Registration Number</label>
            <input type="text" name="registrationNumber" required value={formData.registrationNumber} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. MH12AB1234" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Name / Model</label>
            <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Volvo FH16" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Type</label>
            <select name="type" value={formData.type} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="Truck">Truck</option>
              <option value="Van">Van</option>
              <option value="Trailer">Trailer</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Capacity (kg)</label>
              <input type="number" name="maxLoadCapacity" required min="1" value={formData.maxLoadCapacity} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cost ($)</label>
              <input type="number" name="acquisitionCost" required min="0" value={formData.acquisitionCost} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Registering...' : 'Register Vehicle'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Vehicle;
