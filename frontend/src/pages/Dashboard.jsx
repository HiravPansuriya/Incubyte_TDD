import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Admin form states
  const [editingId, setEditingId] = useState(null);
  const [makeInput, setMakeInput] = useState('');
  const [modelInput, setModelInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [quantityInput, setQuantityInput] = useState('');
  
  // Notification banner
  const [notification, setNotification] = useState({ message: '', type: '' });
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('email') || 'User';
  const userRole = localStorage.getItem('role') || 'user';
  const isAdmin = userRole === 'admin';

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Load categories and all vehicles initially and on filter changes
  useEffect(() => {
    if (token) {
      fetchVehicles();
    }
  }, [token, search, categoryFilter, minPrice, maxPrice]);

  // Separate effect to load list of all unique categories
  useEffect(() => {
    if (token) {
      loadAllCategories();
    }
  }, [token, vehicles.length]);

  const loadAllCategories = async () => {
    try {
      const response = await api.get('/vehicles');
      const cats = [...new Set(response.data.vehicles.map(v => v.category))];
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const response = await api.get('/vehicles/search', { params });
      setVehicles(response.data.vehicles);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch vehicles from the server.';
      showNotification(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 4500);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  const handlePurchase = async (id) => {
    try {
      const response = await api.post(`/vehicles/${id}/purchase`);
      showNotification(response.data.message || 'Vehicle purchased successfully!');
      fetchVehicles();
    } catch (err) {
      const msg = err.response?.data?.message || 'Purchase failed.';
      showNotification(msg, 'error');
    }
  };

  const handleSaveVehicle = async (e) => {
    e.preventDefault();
    if (!makeInput || !modelInput || !categoryInput || priceInput === '' || quantityInput === '') {
      showNotification('Please fill in all inputs', 'error');
      return;
    }

    const price = parseFloat(priceInput);
    const quantity = parseInt(quantityInput, 10);

    if (isNaN(price) || price < 0 || isNaN(quantity) || quantity < 0) {
      showNotification('Price and quantity must be non-negative numbers', 'error');
      return;
    }

    try {
      const payload = {
        make: makeInput,
        model: modelInput,
        category: categoryInput,
        price,
        quantity
      };

      if (editingId) {
        // Update vehicle
        const response = await api.put(`/vehicles/${editingId}`, payload);
        showNotification(response.data.message || 'Vehicle updated successfully');
        setEditingId(null);
      } else {
        // Add new vehicle
        const response = await api.post('/vehicles', payload);
        showNotification(response.data.message || 'Vehicle added successfully');
      }

      // Reset inputs & refresh
      setMakeInput('');
      setModelInput('');
      setCategoryInput('');
      setPriceInput('');
      setQuantityInput('');
      fetchVehicles();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save vehicle details.';
      showNotification(msg, 'error');
    }
  };

  const handleEditClick = (v) => {
    setEditingId(v._id);
    setMakeInput(v.make);
    setModelInput(v.model);
    setCategoryInput(v.category);
    setPriceInput(v.price.toString());
    setQuantityInput(v.quantity.toString());
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setMakeInput('');
    setModelInput('');
    setCategoryInput('');
    setPriceInput('');
    setQuantityInput('');
  };

  const handleQuickRestock = async (id, amount) => {
    try {
      const response = await api.post(`/vehicles/${id}/restock`, { quantity: amount });
      showNotification(response.data.message || `Restocked successfully (+${amount})`);
      fetchVehicles();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to restock vehicle.';
      showNotification(msg, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle listing?')) return;
    try {
      const response = await api.delete(`/vehicles/${id}`);
      showNotification(response.data.message || 'Deleted vehicle listing successfully', 'warning');
      if (editingId === id) handleCancelEdit();
      fetchVehicles();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete vehicle.';
      showNotification(msg, 'error');
    }
  };

  // Format currency into Indian Rupees (INR)
  const formatRupee = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              className="w-7 h-7 text-emerald-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <path d="M9 17h6" />
              <circle cx="17" cy="17" r="2" />
            </svg>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              ApexMotors
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs text-slate-400 font-medium">{userEmail}</span>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${isAdmin ? 'text-emerald-400' : 'text-cyan-400'}`}>
                {userRole === 'admin' ? 'Administrator' : 'Standard User'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-8 flex flex-col gap-8">
        
        {/* Toast Notifications */}
        {notification.message && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between text-sm transition-all duration-500 shadow-lg ${
              notification.type === 'error'
                ? 'border-red-500/20 bg-red-500/10 text-red-400'
                : notification.type === 'warning'
                ? 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400'
                : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-current animate-ping"></span>
              <p className="font-medium">{notification.message}</p>
            </div>
            <button onClick={() => setNotification({ message: '', type: '' })} className="hover:opacity-70">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Dashboard Title & Stats Grid */}
        <section className="flex flex-col gap-6">
          <div className="text-left flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-white">Dealership Dashboard</h1>
              <p className="text-slate-400 text-xs mt-1">Indian Automotive Inventory System (INR prices)</p>
            </div>
            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <svg className="animate-spin h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Syncing catalog...
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-sm flex flex-col text-left">
              <span className="text-slate-400 text-xs font-semibold">Total Stock Count</span>
              <span className="text-3xl font-black text-white mt-1">
                {vehicles.reduce((sum, v) => sum + v.quantity, 0)} cars
              </span>
              <span className="text-[10px] text-slate-500 mt-2">Sum of all quantities in database</span>
            </div>
            <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-sm flex flex-col text-left">
              <span className="text-slate-400 text-xs font-semibold">Out of Stock Listings</span>
              <span className={`text-3xl font-black mt-1 ${vehicles.filter(v => v.quantity === 0).length > 0 ? 'text-red-400' : 'text-slate-100'}`}>
                {vehicles.filter(v => v.quantity === 0).length} items
              </span>
              <span className="text-[10px] text-slate-500 mt-2">Requires immediate restocking</span>
            </div>
            <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-sm flex flex-col text-left">
              <span className="text-slate-400 text-xs font-semibold">Total Asset Valuation</span>
              <span className="text-3xl font-black text-emerald-400 mt-1">
                {formatRupee(vehicles.reduce((sum, v) => sum + (v.price * v.quantity), 0))}
              </span>
              <span className="text-[10px] text-slate-500 mt-2">Valuation of current stock</span>
            </div>
          </div>
        </section>

        {/* Catalog, Admin split screen */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Admin panel (If user is Admin) */}
          {isAdmin && (
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/30 backdrop-blur-sm text-left">
                <h3 className="text-lg font-bold text-white mb-4">
                  {editingId ? 'Edit Vehicle Details' : 'Add New Listing'}
                </h3>
                
                <form onSubmit={handleSaveVehicle} className="flex flex-col gap-4">
                  <div className="flex flex-col">
                    <label className="text-xs text-slate-400 font-semibold mb-1">Company Name (Make)</label>
                    <input
                      type="text"
                      value={makeInput}
                      onChange={(e) => setMakeInput(e.target.value)}
                      placeholder="e.g. Tata, Mahindra"
                      className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-white"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-slate-400 font-semibold mb-1">Model Name</label>
                    <input
                      type="text"
                      value={modelInput}
                      onChange={(e) => setModelInput(e.target.value)}
                      placeholder="e.g. Harrier, XUV700"
                      className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-white"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-slate-400 font-semibold mb-1">Category / Type</label>
                    <input
                      type="text"
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      placeholder="e.g. SUV, Electric, Sedan"
                      className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-xs text-slate-400 font-semibold mb-1">Price (₹)</label>
                      <input
                        type="number"
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                        placeholder="e.g. 1850000"
                        min="0"
                        step="0.01"
                        className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-white"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs text-slate-400 font-semibold mb-1">Initial Stock</label>
                      <input
                        type="number"
                        value={quantityInput}
                        onChange={(e) => setQuantityInput(e.target.value)}
                        placeholder="e.g. 5"
                        min="0"
                        className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button
                      type="submit"
                      className="flex-grow py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-semibold transition-all hover:shadow-lg hover:shadow-emerald-950/40 text-sm"
                    >
                      {editingId ? 'Save Changes' : 'Publish Listing'}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-3 py-2 rounded-lg border border-slate-800 hover:bg-slate-900 font-semibold text-xs transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Catalog Area */}
          <div className={`${isAdmin ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col gap-6`}>
            
            {/* Search and Filters box */}
            <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 backdrop-blur-sm flex flex-col gap-4 text-left">
              <h3 className="text-sm font-bold text-slate-300">Search and Filter Catalog</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Text query search */}
                <div className="md:col-span-2 relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search company, model, category..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-white"
                  />
                  <svg
                    className="absolute left-3.5 top-3 w-4 h-4 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Category select */}
                <div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Price range triggers */}
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min ₹"
                    className="w-1/2 px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs focus:outline-none focus:border-emerald-500 transition-colors text-white"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max ₹"
                    className="w-1/2 px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs focus:outline-none focus:border-emerald-500 transition-colors text-white"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Listings Catalog Grid */}
            <div className="grid md:grid-cols-2 gap-6 text-left">
              {vehicles.length > 0 ? (
                vehicles.map((v) => (
                  <div
                    key={v._id}
                    className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 hover:bg-slate-900/20 backdrop-blur-sm transition-all hover:border-slate-800 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Badge / Category */}
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                          {v.category}
                        </span>
                        
                        <div className="text-right">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${v.quantity === 0 ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-slate-800 text-slate-300'}`}>
                            {v.quantity === 0 ? 'Out of stock' : `${v.quantity} in stock`}
                          </span>
                        </div>
                      </div>

                      {/* Header */}
                      <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {v.make} <span className="font-normal text-slate-300">{v.model}</span>
                      </h4>
                      <p className="text-2xl font-black text-white mt-1">
                        {formatRupee(v.price)}
                      </p>
                    </div>

                    {/* Actions panel */}
                    <div className="mt-6 flex flex-col gap-2">
                      <button
                        onClick={() => handlePurchase(v._id)}
                        disabled={v.quantity === 0}
                        className="w-full py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 disabled:pointer-events-none"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Purchase
                      </button>

                      {/* Admin-only quick items */}
                      {isAdmin && (
                        <div className="flex gap-2 border-t border-slate-900/60 pt-2.5 mt-1">
                          <button
                            onClick={() => handleEditClick(v)}
                            className="flex-grow py-1 px-2.5 rounded bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-600 hover:text-slate-950 font-bold text-[10px] transition-all text-center"
                          >
                            Edit
                          </button>
                          
                          <button
                            onClick={() => handleQuickRestock(v._id, 5)}
                            className="py-1 px-2 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-bold text-[10px] border border-slate-800 transition-colors"
                            title="Restock 5 cars"
                          >
                            Restock +5
                          </button>

                          <button
                            onClick={() => handleDelete(v._id)}
                            className="py-1 px-2.5 rounded bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white font-bold text-[10px] transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="md:col-span-2 text-center py-12 border border-dashed border-slate-900 rounded-2xl">
                  <p className="text-slate-500 text-sm">No vehicles match your filter criteria.</p>
                  <button
                    onClick={() => {
                      setSearch('');
                      setCategoryFilter('');
                      setMinPrice('');
                      setMaxPrice('');
                    }}
                    className="text-xs text-emerald-400 hover:underline mt-2"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/40 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-600 text-[10px]">
          ApexMotors Indian Dealership Management Dashboard. Security Protocol Level JWT-30D.
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
