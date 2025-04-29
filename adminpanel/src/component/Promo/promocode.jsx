
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function Promo() {
   // States for form inputs
   const [code, setCode] = useState('');
   const [prefix, setPrefix] = useState('');
   const [discountType, setDiscountType] = useState('percentage');
   const [discountValue, setDiscountValue] = useState('');
   const [expiryDate, setExpiryDate] = useState('');
   const [minOrderValue, setMinOrderValue] = useState('0');
   const [maxDiscountAmount, setMaxDiscountAmount] = useState('');
   const [bulkCount, setBulkCount] = useState('10');
   
   // States for data
   const [promoCodes, setPromoCodes] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const [success, setSuccess] = useState('');
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [selectedPromoCode, setSelectedPromoCode] = useState(null);
   const [view, setView] = useState('list'); // list, create, bulk, detail

  const token = localStorage.getItem('token');

  const config = useCallback(() => ({
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }), [token]);

  const fetchPromoCodes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:4000/api/adminpromo/get-all-code?page=${currentPage}&limit=10`, config());
      if (res.data.success) {
        setPromoCodes(res.data.promoCodes);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch promo codes');
    } finally {
      setLoading(false);
    }
  }, [currentPage, config]);

  useEffect(() => {
    fetchPromoCodes();
  }, [fetchPromoCodes]);

  const createPromoCode = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const data = {
        code: code || undefined,
        prefix,
        discountType,
        discountValue: Number(discountValue),
        expiryDate,
        minOrderValue: minOrderValue ? Number(minOrderValue) : 0,
        maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
      };

      const res = await axios.post('/api/admin/promocode/create', data, config());

      if (res.data.success) {
        setSuccess('Promo code created successfully!');
        resetForm();
        fetchPromoCodes();
        setView('list');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create promo code');
    } finally {
      setLoading(false);
    }
  };

  const generateBulkCodes = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const data = {
        count: Number(bulkCount),
        prefix,
        discountType,
        discountValue: Number(discountValue),
        expiryDate,
        minOrderValue: minOrderValue ? Number(minOrderValue) : 0,
        maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
      };

      const res = await axios.post('/api/admin/promocode/generate-bulk', data, config());

      if (res.data.success) {
        setSuccess(`Generated ${bulkCount} promo codes successfully!`);
        resetForm();
        fetchPromoCodes();
        setView('list');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate bulk promo codes');
    } finally {
      setLoading(false);
    }
  };

  const deletePromoCode = async (id) => {
    if (!window.confirm('Are you sure you want to delete this promo code?')) return;
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const res = await axios.delete(`/api/admin/promocode/${id}`, config());

      if (res.data.success) {
        setSuccess('Promo code deleted successfully!');
        fetchPromoCodes();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete promo code');
    } finally {
      setLoading(false);
    }
  };

  const getPromoCodeDetails = async (id) => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`/api/admin/promocode/${id}`, config());
      if (res.data.success) {
        setSelectedPromoCode(res.data.promoCode);
        setView('detail');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch promo code details');
    } finally {
      setLoading(false);
    }
  };

  const updatePromoCode = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const data = {
        isActive: selectedPromoCode.isActive,
        expiryDate: selectedPromoCode.expiryDate,
        minOrderValue: selectedPromoCode.minOrderValue,
        maxDiscountAmount: selectedPromoCode.maxDiscountAmount,
      };

      const res = await axios.put(`/api/admin/promocode/${selectedPromoCode._id}`, data, config());

      if (res.data.success) {
        setSuccess('Promo code updated successfully!');
        fetchPromoCodes();
        setView('list');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update promo code');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCode('');
    setPrefix('');
    setDiscountType('percentage');
    setDiscountValue('');
    setExpiryDate('');
    setMinOrderValue('0');
    setMaxDiscountAmount('');
    setBulkCount('10');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="promocode-container p-4 ml-64"> {/* FIXED: added ml-64 to avoid nav overlap */}
      <h1 className="text-2xl font-bold mb-4">Promo Code Management</h1>

      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">{success}</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

      <div className="flex gap-4 mb-6">
        <button onClick={() => setView('list')} className={`px-4 py-2 rounded ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>View All</button>
        <button onClick={() => setView('create')} className={`px-4 py-2 rounded ${view === 'create' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Create New</button>
        <button onClick={() => setView('bulk')} className={`px-4 py-2 rounded ${view === 'bulk' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Generate Bulk</button>
      </div>
      {/* Create single promo code form */}
      {view === 'create' && (
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Create New Promo Code</h2>
          <form onSubmit={createPromoCode}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Code (Optional)</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Enter code or leave blank for auto-generation"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Prefix (Optional)</label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="e.g., SUMMER"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Discount Value ({discountType === 'percentage' ? '%' : '$'})
                </label>
                <input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder={discountType === 'percentage' ? 'e.g., 10' : 'e.g., 25'}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Expiry Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Minimum Order Value ($)</label>
                <input
                  type="number"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="e.g., 50"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Max Discount Amount ($)</label>
                <input
                  type="number"
                  value={maxDiscountAmount}
                  onChange={(e) => setMaxDiscountAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="e.g., 100"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Promo Code'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded ml-2 hover:bg-gray-400"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Generate bulk promo codes form */}
      {view === 'bulk' && (
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Generate Bulk Promo Codes</h2>
          <form onSubmit={generateBulkCodes}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Number of Codes</label>
                <input
                  type="number"
                  value={bulkCount}
                  onChange={(e) => setBulkCount(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="e.g., 10"
                  min="1"
                  max="100"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Prefix (Optional)</label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="e.g., SUMMER"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Discount Value ({discountType === 'percentage' ? '%' : '$'})
                </label>
                <input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder={discountType === 'percentage' ? 'e.g., 10' : 'e.g., 25'}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Expiry Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Minimum Order Value ($)</label>
                <input
                  type="number"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="e.g., 50"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Max Discount Amount ($)</label>
                <input
                  type="number"
                  value={maxDiscountAmount}
                  onChange={(e) => setMaxDiscountAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="e.g., 100"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Promo Codes'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded ml-2 hover:bg-gray-400"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Promo code detail/edit view */}
      {view === 'detail' && selectedPromoCode && (
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Promo Code Details</h2>
          
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <span className="text-2xl font-bold">{selectedPromoCode.code}</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                selectedPromoCode.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {selectedPromoCode.isActive ? 'Active' : 'Inactive'}
              </span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                selectedPromoCode.isUsed ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {selectedPromoCode.isUsed ? 'Used' : 'Unused'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <p><strong>Discount:</strong> {selectedPromoCode.discountValue}{selectedPromoCode.discountType === 'percentage' ? '%' : ' $'}</p>
                <p><strong>Minimum Order:</strong> ${selectedPromoCode.minOrderValue}</p>
                <p><strong>Max Discount Amount:</strong> {selectedPromoCode.maxDiscountAmount ? `$${selectedPromoCode.maxDiscountAmount}` : 'No limit'}</p>
              </div>
              <div>
                <p><strong>Expiry Date:</strong> {formatDate(selectedPromoCode.expiryDate)}</p>
                <p><strong>Created On:</strong> {formatDate(selectedPromoCode.createdAt)}</p>
                <p><strong>Created By:</strong> {selectedPromoCode.createdBy?.name || 'N/A'}</p>
              </div>
            </div>
            
            {selectedPromoCode.isUsed && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <h3 className="font-semibold mb-2">Usage Details</h3>
                <p><strong>Used By:</strong> {selectedPromoCode.usedBy?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {selectedPromoCode.usedBy?.email || 'N/A'}</p>
                <p><strong>Used On:</strong> {selectedPromoCode.usedAt ? formatDate(selectedPromoCode.usedAt) : 'N/A'}</p>
              </div>
            )}
          </div>
          
          {!selectedPromoCode.isUsed && (
            <form onSubmit={updatePromoCode} className="mt-6">
              <h3 className="font-semibold mb-2">Edit Promo Code</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedPromoCode.isActive.toString()}
                    onChange={(e) => setSelectedPromoCode({
                      ...selectedPromoCode,
                      isActive: e.target.value === 'true'
                    })}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="date"
                    value={selectedPromoCode.expiryDate?.split('T')[0] || ''}
                    onChange={(e) => setSelectedPromoCode({
                      ...selectedPromoCode,
                      expiryDate: e.target.value
                    })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Minimum Order Value ($)</label>
                  <input
                    type="number"
                    value={selectedPromoCode.minOrderValue}
                    onChange={(e) => setSelectedPromoCode({
                      ...selectedPromoCode,
                      minOrderValue: e.target.value
                    })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Max Discount Amount ($)</label>
                  <input
                    type="number"
                    value={selectedPromoCode.maxDiscountAmount || ''}
                    onChange={(e) => setSelectedPromoCode({
                      ...selectedPromoCode,
                      maxDiscountAmount: e.target.value || null
                    })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Promo Code'}
                </button>
                <button
                  type="button"
                  onClick={() => deletePromoCode(selectedPromoCode._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  disabled={loading}
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Back to List
                </button>
              </div>
            </form>
          )}
        </div>
      )}
      
      {/* Promo codes list view */}
      {view === 'list' && (
        <div className="bg-white overflow-auto rounded shadow">
          {loading && <p className="p-4 text-center">Loading promo codes...</p>}
          
          {!loading && promoCodes.length === 0 && (
            <p className="p-4 text-center">No promo codes found. Create one to get started.</p>
          )}
          
          {!loading && promoCodes.length > 0 && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {promoCodes.map((promoCode) => (
                  <tr key={promoCode._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{promoCode.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {promoCode.discountValue}
                      {promoCode.discountType === 'percentage' ? '%' : ' $'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        !promoCode.isActive 
                          ? 'bg-red-100 text-red-800' 
                          : promoCode.isUsed 
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {!promoCode.isActive 
                          ? 'Inactive' 
                          : promoCode.isUsed 
                            ? 'Used'
                            : 'Active'
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(promoCode.expiryDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => getPromoCodeDetails(promoCode._id)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      {!promoCode.isUsed && (
                        <button
                          onClick={() => deletePromoCode(promoCode._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3 flex justify-between items-center border-t">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>
              
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
      
    </div>
  );
}

export default Promo;
