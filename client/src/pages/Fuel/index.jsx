import React, { useState, useEffect } from 'react';
import { fuelApi } from '../../services/fuelApi';
import { vehicleApi } from '../../services/vehicleApi';
import Button from '../../components/Button';
import SearchBar from '../../components/SearchBar';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { Fuel as FuelIcon } from 'lucide-react';

const Fuel = () => {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    vehicle: '',
    liters: '',
    cost: '',
    date: ''
  });

  const fetchData = async () => {
    try {
      const [fRes, vRes] = await Promise.all([
        fuelApi.getAll(),
        vehicleApi.getAll()
      ]);
      setLogs(fRes.data);
      setVehicles(vRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
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
      await fuelApi.create({
        ...formData,
        liters: Number(formData.liters),
        cost: Number(formData.cost)
      });
      setIsModalOpen(false);
      setFormData({
        vehicle: '',
        liters: '',
        cost: '',
        date: ''
      });
      fetchData();
    } catch (error) {
      console.error('Failed to log fuel:', error);
      alert(error.response?.data?.message || 'Failed to log fuel');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Fuel & Expenses</h1>
        <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <FuelIcon size={16} /> Log Fuel
        </Button>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="mb-4 max-w-md">
          <SearchBar placeholder="Search logs..." />
        </div>
        
        {loading ? (
          <div className="py-12"><Loader /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Liters (L)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cost ($)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(log.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                      {log.vehicle?.registrationNumber || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {log.liters} L
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      ${log.cost?.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500 text-sm">
                      No fuel records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Fuel Expense">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Vehicle</label>
            <select name="vehicle" required value={formData.vehicle} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Select a vehicle...</option>
              {vehicles.map(v => (
                <option key={v._id} value={v._id}>{v.registrationNumber} - {v.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fuel Quantity (Liters)</label>
              <input type="number" name="liters" required min="1" step="0.1" value={formData.liters} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Total Cost ($)</label>
              <input type="number" name="cost" required min="0" step="0.01" value={formData.cost} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date (Optional, defaults to today)</label>
            <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Logging...' : 'Log Fuel'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Fuel;
