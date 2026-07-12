import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { vehicleApi } from '../../services/vehicleApi';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { Plus } from 'lucide-react';

const Vehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filters
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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
      toast.success('Vehicle registered successfully!');
      fetchVehicles();
    } catch (error) {
      console.error('Failed to create vehicle:', error);
      toast.error(error.response?.data?.message || 'Failed to create vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered Data
  const filteredVehicles = vehicles.filter(v => {
    const matchType = filterType === 'All' || v.type === filterType;
    const matchStatus = filterStatus === 'All' || v.status === filterStatus;
    const matchSearch = v.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        v.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Bar with Filters and Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2 border border-slate-300 rounded text-sm min-w-[150px]"
          >
            <option value="All">Type: All</option>
            <option value="Truck">Truck</option>
            <option value="Van">Van</option>
            <option value="Trailer">Trailer</option>
          </select>
          
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-slate-300 rounded text-sm min-w-[150px]"
          >
            <option value="All">Status: All</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="In Shop">In Shop</option>
            <option value="Retired">Retired</option>
          </select>

          <input 
            type="text" 
            placeholder="Search reg. no..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-slate-300 rounded text-sm min-w-[200px] flex-1"
          />
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded whitespace-nowrap"
        >
          + Add Vehicle
        </button>
      </div>
      
      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="py-12"><Loader /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">REG. NO. (UNIQUE)</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">NAME/MODEL</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">TYPE</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">CAPACITY</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">ODOMETER</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">ACQ. COST</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">STATUS</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredVehicles.map((v) => {
                  let statusBg = 'bg-slate-500';
                  if (v.status === 'Available') statusBg = 'bg-green-600';
                  else if (v.status === 'On Trip') statusBg = 'bg-blue-600';
                  else if (v.status === 'In Shop') statusBg = 'bg-amber-500';
                  else if (v.status === 'Retired') statusBg = 'bg-red-500';

                  return (
                    <tr key={v._id} className="hover:bg-slate-50 transition-colors text-sm">
                      <td className="px-4 py-3 whitespace-nowrap font-bold text-slate-900">{v.registrationNumber}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-700">{v.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-700">{v.type}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-700">{v.maxLoadCapacity} kg</td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-700">{v.odometer?.toLocaleString() || 0}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-700">{v.acquisitionCost?.toLocaleString() || 0}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-[11px] leading-5 font-semibold rounded-md text-white ${statusBg}`}>
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
                {filteredVehicles.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500 text-sm">
                      No vehicles match the filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rules text below table */}
      <div className="text-xs font-semibold text-orange-600 italic">
        Rule: Registration No. must be unique • Retired/In Shop vehicles are hidden from Trip Dispatcher
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
