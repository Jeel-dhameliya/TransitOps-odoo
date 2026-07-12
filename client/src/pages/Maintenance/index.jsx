import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { maintenanceApi } from '../../services/maintenanceApi';
import { vehicleApi } from '../../services/vehicleApi';
import Button from '../../components/Button';
import SearchBar from '../../components/SearchBar';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { Wrench } from 'lucide-react';

const Maintenance = () => {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    vehicle: '',
    description: '',
    cost: ''
  });

  const fetchData = async () => {
    try {
      const [mRes, vRes] = await Promise.all([
        maintenanceApi.getAll(),
        vehicleApi.getAll()
      ]);
      setLogs(mRes.data);
      // Can only perform maintenance on Available or Retired vehicles (not those On Trip)
      setVehicles(vRes.data.filter(v => v.status !== 'On Trip' && v.status !== 'In Shop'));
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
      await maintenanceApi.create({
        ...formData,
        cost: Number(formData.cost)
      });
      setIsModalOpen(false);
      setFormData({
        vehicle: '',
        description: '',
        cost: ''
      });
      toast.success('Maintenance logged successfully! Vehicle is now In Shop.');
      fetchData();
    } catch (error) {
      console.error('Failed to log maintenance:', error);
      toast.error(error.response?.data?.message || 'Failed to log maintenance');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = async (id) => {
    if (window.confirm('Are you sure you want to close this maintenance ticket? The vehicle will be restored to Available.')) {
      try {
        await maintenanceApi.close(id);
        toast.success('Maintenance closed! Vehicle is now Available.');
        fetchData();
      } catch (error) {
        console.error('Failed to close maintenance:', error);
        toast.error('Failed to close maintenance');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Maintenance Logs</h1>
        <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <Wrench size={16} /> Log Maintenance
        </Button>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="mb-4 max-w-md">
          <SearchBar placeholder="Search maintenance logs..." />
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                      {log.vehicle?.registrationNumber || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                      {log.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      ${log.cost?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.status === 'Open' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {log.status === 'Open' && (
                        <button onClick={() => handleClose(log._id)} className="text-blue-600 hover:text-blue-900">Close Ticket</button>
                      )}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500 text-sm">
                      No maintenance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Maintenance">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Vehicle</label>
            <select name="vehicle" required value={formData.vehicle} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Select a vehicle...</option>
              {vehicles.map(v => (
                <option key={v._id} value={v._id}>{v.registrationNumber} - {v.name}</option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">Note: Logging maintenance will move the vehicle to 'In Shop' status.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea name="description" required rows="3" value={formData.description} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g. Engine oil replacement and tire alignment..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Estimated / Actual Cost ($)</label>
            <input type="number" name="cost" required min="0" value={formData.cost} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Logging...' : 'Log Maintenance'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Maintenance;
