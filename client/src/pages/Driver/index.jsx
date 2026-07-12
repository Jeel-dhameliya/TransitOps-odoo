import React, { useState, useEffect } from 'react';
import { driverApi } from '../../services/driverApi';
import Button from '../../components/Button';
import SearchBar from '../../components/SearchBar';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { Plus } from 'lucide-react';

const Driver = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    licenseCategory: 'Commercial',
    licenseExpiryDate: '',
    contactNumber: ''
  });

  const fetchDrivers = async () => {
    try {
      const response = await driverApi.getAll();
      setDrivers(response.data);
    } catch (error) {
      console.error('Failed to fetch drivers', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await driverApi.create(formData);
      setIsModalOpen(false);
      setFormData({
        name: '',
        licenseNumber: '',
        licenseCategory: 'Commercial',
        licenseExpiryDate: '',
        contactNumber: ''
      });
      fetchDrivers();
    } catch (error) {
      console.error('Failed to register driver:', error);
      alert(error.response?.data?.message || 'Failed to register driver');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this driver?')) {
      try {
        await driverApi.delete(id);
        fetchDrivers();
      } catch (error) {
        console.error('Failed to delete driver', error);
        alert('Failed to delete driver');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Drivers</h1>
        <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Register Driver
        </Button>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="mb-4 max-w-md">
          <SearchBar placeholder="Search drivers by name or license..." />
        </div>
        
        {loading ? (
          <div className="py-12"><Loader /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Driver Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">License</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {drivers.map((d) => (
                  <tr key={d._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{d.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {d.licenseNumber} <span className="text-xs text-slate-400 block">Exp: {new Date(d.licenseExpiryDate).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{d.contactNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${d.safetyScore >= 90 ? 'bg-green-100 text-green-700' : d.safetyScore >= 70 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {d.safetyScore}/100
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={d.status} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleDelete(d._id)} className="text-red-600 hover:text-red-900 ml-4">Remove</button>
                    </td>
                  </tr>
                ))}
                {drivers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500 text-sm">
                      No drivers registered. Click "Register Driver" to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Driver">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. John Doe" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">License Number</label>
              <input type="text" name="licenseNumber" required value={formData.licenseNumber} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select name="licenseCategory" value={formData.licenseCategory} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="Commercial">Commercial</option>
                <option value="Heavy Duty">Heavy Duty</option>
                <option value="Standard">Standard</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">License Expiry Date</label>
            <input type="date" name="licenseExpiryDate" required value={formData.licenseExpiryDate} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
            <input type="tel" name="contactNumber" required value={formData.contactNumber} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="+1 (555) 000-0000" />
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Registering...' : 'Register Driver'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Driver;
