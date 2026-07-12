import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Plus, Eye, Edit2, Trash2, ShieldAlert, AlertTriangle, 
  CheckCircle, Ban, X, RefreshCw, Star, Phone, FileText, ChevronDown, Check, User
} from 'lucide-react';

const INITIAL_DRIVERS = [
  { id: '1', name: 'Alex Patel', licenseNo: 'DL-88213', licenseCategory: 'LMV', licenseExpiry: '2028-12-15', contact: '+91 98765 43210', tripCompletion: 96, safetyScore: 98, status: 'Available' },
  { id: '2', name: 'John Doe', licenseNo: 'DL-44120', licenseCategory: 'HMV', licenseExpiry: '2025-03-30', contact: '+91 98220 12345', tripCompletion: 81, safetyScore: 76, status: 'Suspended' },
  { id: '3', name: 'Priya Sharma', licenseNo: 'DL-77031', licenseCategory: 'LMV', licenseExpiry: '2026-08-20', contact: '+91 99110 56789', tripCompletion: 99, safetyScore: 95, status: 'On Trip' },
  { id: '4', name: 'Suresh Kumar', licenseNo: 'DL-90045', licenseCategory: 'HMV', licenseExpiry: '2027-01-10', contact: '+91 97440 98765', tripCompletion: 88, safetyScore: 89, status: 'Available' },
  { id: '5', name: 'Vikram Singh', licenseNo: 'DL-12890', licenseCategory: 'HMV', licenseExpiry: '2026-07-30', contact: '+91 95400 11223', tripCompletion: 92, safetyScore: 91, status: 'Off Duty' },
  { id: '6', name: 'Ananya Rao', licenseNo: 'DL-34567', licenseCategory: 'LMV', licenseExpiry: '2026-09-05', contact: '+91 91234 56789', tripCompletion: 95, safetyScore: 92, status: 'Available' },
  { id: '7', name: 'Rajesh Nair', licenseNo: 'DL-56789', licenseCategory: 'MCWG', licenseExpiry: '2026-02-15', contact: '+91 88990 01122', tripCompletion: 74, safetyScore: 68, status: 'Available' },
  { id: '8', name: 'David Miller', licenseNo: 'DL-78901', licenseCategory: 'HMV', licenseExpiry: '2028-09-18', contact: '+91 76543 21098', tripCompletion: 90, safetyScore: 88, status: 'On Trip' },
  { id: '9', name: 'Neha Gupta', licenseNo: 'DL-23456', licenseCategory: 'LMV', licenseExpiry: '2024-11-05', contact: '+91 99887 76655', tripCompletion: 0, safetyScore: 82, status: 'Off Duty' }
];

export default function DriversPage() {
  const [drivers, setDrivers] = useState(INITIAL_DRIVERS);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [validityFilter, setValidityFilter] = useState('All');
  const [safetyFilter, setSafetyFilter] = useState('All');

  // Modal Open States
  const [activeModal, setActiveModal] = useState(null); // 'add' | 'edit' | 'view' | 'delete' | null
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formLicenseNo, setFormLicenseNo] = useState('');
  const [formCategory, setFormCategory] = useState('LMV');
  const [formExpiry, setFormExpiry] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formTripCompletion, setFormTripCompletion] = useState(90);
  const [formSafetyScore, setFormSafetyScore] = useState(90);
  const [formStatus, setFormStatus] = useState('Available');
  const [formErrors, setFormErrors] = useState({});

  // Today marker for dynamic calculation
  const TODAY = new Date('2026-07-12');

  const getLicenseValidity = (expiryStr) => {
    const expiry = new Date(expiryStr);
    const timeDiff = expiry.getTime() - TODAY.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff < 0) return 'Expired';
    if (daysDiff <= 60) return 'Expiring Soon';
    return 'Valid';
  };

  const getSafetyCategory = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    return 'Needs Attention';
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setCategoryFilter('All');
    setValidityFilter('All');
    setSafetyFilter('All');
  };

  // Filter application
  const filteredDrivers = drivers.filter(d => {
    const valStatus = getLicenseValidity(d.licenseExpiry);
    const safCategory = getSafetyCategory(d.safetyScore);

    const matchesSearch = 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.licenseNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.contact.includes(searchQuery) ||
      d.status.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || d.licenseCategory === categoryFilter;
    const matchesValidity = validityFilter === 'All' || valStatus === validityFilter;
    
    let matchesSafety = true;
    if (safetyFilter !== 'All') {
      if (safetyFilter === 'Excellent') matchesSafety = d.safetyScore >= 90;
      else if (safetyFilter === 'Good') matchesSafety = d.safetyScore >= 80 && d.safetyScore < 90;
      else if (safetyFilter === 'Needs Attention') matchesSafety = d.safetyScore < 80;
    }

    return matchesSearch && matchesStatus && matchesCategory && matchesValidity && matchesSafety;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return { bg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', icon: CheckCircle };
      case 'On Trip':
        return { bg: 'bg-blue-500/10 text-blue-400 border border-blue-500/20', icon: Star };
      case 'Off Duty':
        return { bg: 'bg-slate-800 text-slate-400 border border-slate-700/50', icon: Ban };
      case 'Suspended':
        return { bg: 'bg-rose-500/10 text-rose-400 border border-rose-500/20', icon: ShieldAlert };
      default:
        return { bg: 'bg-slate-800 text-slate-400', icon: Ban };
    }
  };

  const getValidityBadge = (expiryStr) => {
    const status = getLicenseValidity(expiryStr);
    switch (status) {
      case 'Expired':
        return { text: 'Expired', color: 'text-rose-500 font-extrabold flex items-center gap-1' };
      case 'Expiring Soon':
        return { text: 'Expiring Soon', color: 'text-amber-500 font-bold flex items-center gap-1' };
      default:
        return { text: 'Valid', color: 'text-slate-400' };
    }
  };

  const getSafetyColor = (score) => {
    if (score >= 90) return 'stroke-emerald-500';
    if (score >= 80) return 'stroke-amber-500';
    return 'stroke-rose-500';
  };

  // Form Initializers
  const openAddModal = () => {
    setFormName('');
    setFormLicenseNo('');
    setFormCategory('LMV');
    setFormExpiry('');
    setFormContact('');
    setFormTripCompletion(90);
    setFormSafetyScore(90);
    setFormStatus('Available');
    setFormErrors({});
    setActiveModal('add');
  };

  const openEditModal = (driver) => {
    setSelectedDriver(driver);
    setFormName(driver.name);
    setFormLicenseNo(driver.licenseNo);
    setFormCategory(driver.licenseCategory);
    setFormExpiry(driver.licenseExpiry);
    setFormContact(driver.contact);
    setFormTripCompletion(driver.tripCompletion);
    setFormSafetyScore(driver.safetyScore);
    setFormStatus(driver.status);
    setFormErrors({});
    setActiveModal('edit');
  };

  const openViewModal = (driver) => {
    setSelectedDriver(driver);
    setActiveModal('view');
  };

  const openDeleteModal = (driver) => {
    setSelectedDriver(driver);
    setActiveModal('delete');
  };

  const validateForm = () => {
    const errors = {};
    if (!formName.trim()) errors.name = 'Driver Name is required';
    if (!formLicenseNo.trim()) {
      errors.licenseNo = 'License Number is required';
    } else if (!/^DL-[A-Z0-9]{5,8}$/i.test(formLicenseNo.trim())) {
      errors.licenseNo = 'Invalid license format (Ex: DL-88213)';
    }
    if (!formContact.trim()) {
      errors.contact = 'Contact number is required';
    } else if (!/^\+?[0-9\s-]{10,14}$/.test(formContact.trim())) {
      errors.contact = 'Valid contact number layout required';
    }
    if (!formExpiry) errors.expiry = 'Expiry Date is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveDriver = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (activeModal === 'add') {
      const newD = {
        id: (drivers.length + 1).toString(),
        name: formName,
        licenseNo: formLicenseNo.toUpperCase(),
        licenseCategory: formCategory,
        licenseExpiry: formExpiry,
        contact: formContact,
        tripCompletion: parseInt(formTripCompletion),
        safetyScore: parseInt(formSafetyScore),
        status: formStatus
      };
      setDrivers([newD, ...drivers]);
    } else if (activeModal === 'edit' && selectedDriver) {
      setDrivers(drivers.map(d => d.id === selectedDriver.id ? {
        ...d,
        name: formName,
        licenseNo: formLicenseNo.toUpperCase(),
        licenseCategory: formCategory,
        licenseExpiry: formExpiry,
        contact: formContact,
        tripCompletion: parseInt(formTripCompletion),
        safetyScore: parseInt(formSafetyScore),
        status: formStatus
      } : d));
    }
    setActiveModal(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedDriver) {
      setDrivers(drivers.filter(d => d.id !== selectedDriver.id));
    }
    setActiveModal(null);
  };

  // Rule warning messages resolution based on active driver parameters
  const isDriverBlocked = (driver) => {
    const isExpired = getLicenseValidity(driver.licenseExpiry) === 'Expired';
    const isSuspended = driver.status === 'Suspended';
    return isExpired || isSuspended;
  };

  const getBlockedReason = (driver) => {
    const isExpired = getLicenseValidity(driver.licenseExpiry) === 'Expired';
    const isSuspended = driver.status === 'Suspended';
    if (isExpired && isSuspended) return 'License expired & suspended';
    if (isExpired) return 'License Expired';
    if (isSuspended) return 'Personnel Suspended';
    return '';
  };

  return (
    <div className="flex-1 flex flex-col gap-6 p-6 md:p-8 text-left bg-slate-950 min-h-screen relative">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 tracking-tight">Drivers & Safety Profiles</h1>
          <p className="text-xs text-slate-500 max-w-xl mt-1">
            Manage driver information, license validity, trip availability and safety compliance.
          </p>
        </div>
        
        {/* ADD DRIVER BUTTON */}
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95 flex-shrink-0"
        >
          <Plus size={14} className="stroke-[3]" />
          Add Driver
        </button>
      </div>

      {/* DUAL COLUMN UPPER SECTION: FILTERS & RBAC BUSINESS CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* FILTERS PANEL */}
        <div className="lg:col-span-8 bg-slate-900/35 border border-slate-850 p-5 rounded-2xl flex flex-col gap-4">
          <div className="flex justify-between items-center select-none">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Filters</span>
            <button 
              onClick={handleResetFilters}
              className="text-[10px] text-primary hover:text-blue-400 font-bold flex items-center gap-1 transition-colors"
            >
              <RefreshCw size={10} />
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-900">
            {/* DRIVER STATUS */}
            <div className="flex flex-col gap-1 border-r border-slate-900 last:border-0 pr-1.5">
              <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-300 font-bold outline-none cursor-pointer"
              >
                <option value="All" className="bg-slate-900">All Status</option>
                <option value="Available" className="bg-slate-900">Available</option>
                <option value="On Trip" className="bg-slate-900">On Trip</option>
                <option value="Off Duty" className="bg-slate-900">Off Duty</option>
                <option value="Suspended" className="bg-slate-900">Suspended</option>
              </select>
            </div>

            {/* LICENSE CATEGORY */}
            <div className="flex flex-col gap-1 border-r border-slate-900 last:border-0 pr-1.5">
              <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-300 font-bold outline-none cursor-pointer"
              >
                <option value="All" className="bg-slate-900">All</option>
                <option value="LMV" className="bg-slate-900">LMV Only</option>
                <option value="HMV" className="bg-slate-900">HMV Only</option>
                <option value="MCWG" className="bg-slate-900">MCWG Only</option>
              </select>
            </div>

            {/* LICENSE VALIDITY */}
            <div className="flex flex-col gap-1 border-r border-slate-900 last:border-0 pr-1.5">
              <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Validity</label>
              <select
                value={validityFilter}
                onChange={(e) => setValidityFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-300 font-bold outline-none cursor-pointer"
              >
                <option value="All" className="bg-slate-900">All Licenses</option>
                <option value="Valid" className="bg-slate-900">Valid Only</option>
                <option value="Expiring Soon" className="bg-slate-900">Expiring Soon</option>
                <option value="Expired" className="bg-slate-900">Expired Only</option>
              </select>
            </div>

            {/* SAFETY SCORE */}
            <div className="flex flex-col gap-1 last:border-0">
              <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Safety score</label>
              <select
                value={safetyFilter}
                onChange={(e) => setSafetyFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-300 font-bold outline-none cursor-pointer"
              >
                <option value="All" className="bg-slate-900">All Scores</option>
                <option value="Excellent" className="bg-slate-900">Excellent (90+)</option>
                <option value="Good" className="bg-slate-900">Good (80-89)</option>
                <option value="Needs Attention" className="bg-slate-900">Needs work (&lt;80)</option>
              </select>
            </div>
          </div>

          {/* SEARCH BAR INPUT */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by driver name, license, contact number, or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-850 text-xs text-slate-100 rounded-xl pl-9 pr-4 py-2.5 placeholder-slate-500 focus:border-primary outline-none transition-colors"
            />
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          </div>
        </div>

        {/* RBAC BUSINESS RULES CARD */}
        <div className="lg:col-span-4 bg-gradient-to-br from-indigo-950/30 to-slate-900/35 border border-indigo-900/30 p-5 rounded-2xl h-full shadow-premium flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 select-none">
              <ShieldAlert size={16} className="text-secondary-light stroke-[2.5]" />
              <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider">RBAC Business Rules</h3>
            </div>
            <ul className="text-[10px] text-slate-400 font-sans leading-relaxed flex flex-col gap-2">
              <li className="flex gap-2">
                <span className="text-rose-500 font-bold">⚠️</span>
                <span>Drivers with <strong className="text-slate-300 font-bold">Expired Licenses</strong> cannot be assigned to active trips.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-rose-500 font-bold">⚠️</span>
                <span><strong className="text-slate-300 font-bold">Suspended</strong> drivers are blocked from scheduling & dispatches.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400 font-bold">ℹ️</span>
                <span>Drivers already <strong className="text-slate-300 font-bold">On Trip</strong> are locked out from secondary dispatches.</span>
              </li>
            </ul>
          </div>
          <div className="text-[9px] text-indigo-400 font-mono mt-3 uppercase tracking-wider select-none">
            Scope validation active
          </div>
        </div>

      </div>

      {/* DRIVER LIST DATA AREA */}
      <div className="w-full z-15">
        
        {filteredDrivers.length > 0 ? (
          <>
            {/* DESKTOP RESPONSIVE TABLE VIEW */}
            <div className="hidden md:block w-full bg-slate-900/15 border border-slate-850 rounded-2xl overflow-hidden shadow-premium">
              <table className="w-full text-xs font-sans text-left border-collapse select-none">
                <thead>
                  <tr className="border-b border-slate-850/80 bg-slate-900/40 text-slate-500 uppercase tracking-widest text-[9px] font-extrabold font-mono">
                    <th className="px-5 py-4">Driver</th>
                    <th className="px-5 py-4">License Category</th>
                    <th className="px-5 py-4">Expiry Condition</th>
                    <th className="px-5 py-4">Contact</th>
                    <th className="px-5 py-4 text-center">Trip Completion</th>
                    <th className="px-5 py-4 text-center">Safety score</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/40 divide-dashed">
                  {filteredDrivers.map((d) => {
                    const BadgeIcon = getStatusBadge(d.status).icon;
                    const valBadge = getValidityBadge(d.licenseExpiry);
                    const isBlocked = isDriverBlocked(d);
                    const isExpired = getLicenseValidity(d.licenseExpiry) === 'Expired';
                    const activeSafetyColor = getSafetyColor(d.safetyScore);

                    // Circular gauge details
                    const radius = 16;
                    const circumference = 2 * Math.PI * radius;
                    const strokeDashoffset = circumference - (d.safetyScore / 100) * circumference;

                    return (
                      <motion.tr
                        layout
                        key={d.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`hover:bg-slate-900/20 transition-colors text-slate-300 font-medium ${isBlocked ? 'bg-rose-500/[0.015]' : ''}`}
                      >
                        {/* Driver details cell view */}
                        <td className="px-5 py-4.5">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-white text-xs">{d.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono tracking-wider">{d.licenseNo}</span>
                          </div>
                        </td>

                        {/* License Category */}
                        <td className="px-5 py-4.5 font-bold font-mono text-[10px] text-slate-400">
                          {d.licenseCategory}
                        </td>

                        {/* Expiry Condition */}
                        <td className="px-5 py-4.5 font-mono text-[10px]">
                          <div className="flex flex-col">
                            <span className={valBadge.color}>
                              {isExpired && <AlertTriangle size={10} className="stroke-[3] inline animate-bounce" />}
                              {valBadge.text}
                            </span>
                            <span className="text-slate-550 text-[9px]">{d.licenseExpiry}</span>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-5 py-4.5 font-mono text-[10px] text-slate-400">
                          {d.contact}
                        </td>

                        {/* Trip Completion bar */}
                        <td className="px-5 py-4.5 w-[140px]">
                          <div className="flex flex-col gap-1 items-center mt-1">
                            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-900">
                              <div
                                style={{ width: `${d.tripCompletion}%` }}
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                              />
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 font-bold select-none">{d.tripCompletion}%</span>
                          </div>
                        </td>

                        {/* Safety Score Radial Dial */}
                        <td className="px-5 py-4.5">
                          <div className="flex items-center justify-center relative">
                            <svg className="w-10 h-10 rotate-[-90deg]">
                              <circle
                                cx="20"
                                cy="20"
                                r={radius}
                                className="stroke-slate-850 fill-transparent stroke-2"
                              />
                              <circle
                                cx="20"
                                cy="20"
                                r={radius}
                                className={`fill-transparent stroke-2 transition-all duration-500 ${activeSafetyColor}`}
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                              />
                            </svg>
                            <span className="absolute text-[10px] font-mono font-black text-white">{d.safetyScore}</span>
                          </div>
                        </td>

                        {/* Status badge */}
                        <td className="px-5 py-4.5">
                          <div className="flex flex-col items-start gap-1">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wide select-none ${getStatusBadge(d.status).bg}`}>
                              <BadgeIcon size={12} className="stroke-[2.5]" />
                              {d.status}
                            </span>
                            {isBlocked && (
                              <span className="text-[9px] font-bold text-rose-500 font-mono lowercase tracking-tight bg-rose-500/5 px-2 py-0.2 rounded border border-rose-500/10">
                                Dispatch Lock: {getBlockedReason(d)}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Actions buttons */}
                        <td className="px-5 py-4.5 text-right w-[110px]">
                          <div className="flex justify-end gap-1.5">
                            {/* VIEW TOOLTIP ICON */}
                            <button
                              onClick={() => openViewModal(d)}
                              title="View safety stats"
                              className="w-7 h-7 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-850 transition-colors"
                            >
                              <Eye size={12} />
                            </button>
                            {/* EDIT ICON */}
                            <button
                              onClick={() => openEditModal(d)}
                              title="Edit driver"
                              className="w-7 h-7 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-850 transition-colors"
                            >
                              <Edit2 size={12} />
                            </button>
                            {/* DELETE ICON */}
                            <button
                              onClick={() => openDeleteModal(d)}
                              title="Delete record"
                              className="w-7 h-7 bg-slate-900 border border-slate-850/80 rounded-lg flex items-center justify-center text-rose-400 hover:text-rose-350 hover:bg-rose-500/10 hover:border-rose-900/30 transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* MOBILE SCREEN CARD VIEW */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {filteredDrivers.map(d => {
                const BadgeIcon = getStatusBadge(d.status).icon;
                const valBadge = getValidityBadge(d.licenseExpiry);
                const isBlocked = isDriverBlocked(d);
                const isExpired = getValidityBadge(d.licenseExpiry).text === 'Expired';
                
                return (
                  <motion.div
                    key={d.id}
                    layout
                    whileHover={{ scale: 1.01 }}
                    className={`bg-slate-900/35 border border-slate-850 p-5 rounded-2xl flex flex-col gap-4 relative shadow-sm ${
                      isBlocked ? 'border-rose-900/30 bg-rose-500/[0.015]' : ''
                    }`}
                  >
                    {/* Header name & status */}
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-white text-sm">{d.name}</span>
                        <span className="text-[10px] text-slate-550 font-mono">ID: {d.id} | Lic: {d.licenseNo}</span>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wide select-none ${getStatusBadge(d.status).bg}`}>
                        <BadgeIcon size={10} className="stroke-[2.5]" />
                        {d.status}
                      </span>
                    </div>

                    {/* License specifications */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-950/40 p-3 rounded-xl border border-slate-900 text-[10px] font-mono">
                      <div>
                        <span className="text-slate-500 text-[8px] uppercase block font-bold">Category</span>
                        <span className="text-slate-300 font-bold block mt-0.5">{d.licenseCategory}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[8px] uppercase block font-bold">License Expiry</span>
                        <span className={`font-bold mt-0.5 block ${valBadge.color}`}>
                          {isExpired && <AlertTriangle size={9} className="inline mr-1" />}
                          {d.licenseExpiry}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[8px] uppercase block font-bold">Safety rating</span>
                        <span className="text-white font-bold block mt-0.5">{d.safetyScore} points</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[8px] uppercase block font-bold">Trip Completion</span>
                        <span className="text-white font-bold block mt-0.5">{d.tripCompletion}% ratio</span>
                      </div>
                    </div>

                    {/* Dispatch Warning state row */}
                    {isBlocked && (
                      <span className="text-[9px] font-bold text-rose-500 font-mono tracking-tight bg-rose-500/5 px-2.5 py-1.5 rounded border border-rose-500/10 flex items-center gap-1.5">
                        <AlertTriangle size={12} />
                        Dispatch Blocked: {getBlockedReason(d)}
                      </span>
                    )}

                    {/* Bottom controls panel */}
                    <div className="flex justify-between items-center border-t border-slate-850/40 pt-3">
                      <span className="text-[10px] text-slate-500 font-mono">{d.contact}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openViewModal(d)}
                          className="px-2.5 py-1.5 bg-slate-800 border border-slate-700/60 rounded-lg text-slate-300 text-[10px] font-bold"
                        >
                          View Safety
                        </button>
                        <button
                          onClick={() => openEditModal(d)}
                          className="px-2.5 py-1.5 bg-slate-800 border border-slate-700/60 rounded-lg text-slate-300 text-[10px] font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(d)}
                          className="px-2.5 py-1.5 bg-rose-950/20 border border-rose-900/30 rounded-lg text-rose-400 text-[10px] font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          </>
        ) : (
          /* EMPTY STATE CARD ILLUSTRATION */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-slate-900/35 border border-slate-850 p-12 rounded-2xl flex flex-col justify-center items-center text-center shadow-premium backdrop-blur-sm select-none"
          >
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border border-slate-750 text-slate-500 mb-4 animate-pulse">
              <Users size={28} />
            </div>
            <h3 className="text-md font-bold text-white mb-1">No drivers found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
              There are no records matching your active search fields or filter categories. Try resetting filters.
            </p>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
            >
              <Plus size={12} className="stroke-[3]" />
              Add New Driver
            </button>
          </motion.div>
        )}

      </div>

      {/* ================= MODALS SECTION ================= */}
      <AnimatePresence>
        
        {/* ADD / EDIT DIALOG FORM MODAL */}
        {(activeModal === 'add' || activeModal === 'edit') && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-premium-lg rel overflow-hidden"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-1"
              >
                <X size={16} />
              </button>

              <h3 className="text-sm font-black text-slate-200 uppercase tracking-widest mb-6 block border-b border-slate-850 pb-3 flex items-center gap-2">
                <User size={14} className="text-primary" />
                {activeModal === 'add' ? 'Register New Driver' : 'Edit Driver Dossier'}
              </h3>

              <form onSubmit={handleSaveDriver} className="flex flex-col gap-4">
                {/* NAME INPUT */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Driver Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-primary transition-colors"
                  />
                  {formErrors.name && <span className="text-[9px] font-bold text-rose-500 mt-0.5">{formErrors.name}</span>}
                </div>

                {/* LICENSE NO & CATEGORY ROW */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">License No</label>
                    <input
                      type="text"
                      required
                      placeholder="DL-88213"
                      value={formLicenseNo}
                      onChange={(e) => setFormLicenseNo(e.target.value)}
                      className="bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-primary transition-colors uppercase"
                    />
                    {formErrors.licenseNo && <span className="text-[9px] font-bold text-rose-500 mt-0.5">{formErrors.licenseNo}</span>}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white outline-none cursor-pointer focus:border-primary transition-colors focus:bg-slate-950"
                    >
                      <option value="LMV">LMV (Light Vehicle)</option>
                      <option value="HMV">HMV (Heavy Vehicle)</option>
                      <option value="MCWG">MCWG (Motorcycle)</option>
                    </select>
                  </div>
                </div>

                {/* EXPIRY DATE & CONTACT */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Expiry Date</label>
                    <input
                      type="date"
                      required
                      value={formExpiry}
                      onChange={(e) => setFormExpiry(e.target.value)}
                      className="bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white outline-none cursor-pointer focus:border-primary transition-colors font-mono"
                    />
                    {formErrors.expiry && <span className="text-[9px] font-bold text-rose-500 mt-0.5">{formErrors.expiry}</span>}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Contact Number</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98765 00000"
                      value={formContact}
                      onChange={(e) => setFormContact(e.target.value)}
                      className="bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-primary transition-colors"
                    />
                    {formErrors.contact && <span className="text-[9px] font-bold text-rose-500 mt-0.5">{formErrors.contact}</span>}
                  </div>
                </div>

                {/* SAFETY SCORE & TRIP COMPLETION VALUES */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Safety Rating (1-100)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="100"
                      value={formSafetyScore}
                      onChange={(e) => setFormSafetyScore(e.target.value)}
                      className="bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Trip Completion %</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={formTripCompletion}
                      onChange={(e) => setFormTripCompletion(e.target.value)}
                      className="bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                {/* CURRENT STATS STATUS PROFILE */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Initial Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white outline-none cursor-pointer focus:border-primary transition-colors"
                  >
                    <option value="Available">Available</option>
                    <option value="On Trip">On Trip</option>
                    <option value="Off Duty">Off Duty</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-850 pt-5 mt-3">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 border border-slate-800 hover:bg-slate-850 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                  >
                    {activeModal === 'add' ? 'Register Driver' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* VIEW SAFETY DOSSIER MODAL */}
        {activeModal === 'view' && selectedDriver && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-premium-lg relative overflow-hidden"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-1"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mt-3">
                  <User size={24} className="stroke-[2]" />
                </div>
                
                <div>
                  <h3 className="text-md font-extrabold text-white">{selectedDriver.name}</h3>
                  <span className="text-[10px] text-slate-500 font-mono">{selectedDriver.licenseNo} ({selectedDriver.licenseCategory})</span>
                </div>

                <div className="w-full bg-slate-950/50 p-4 rounded-xl border border-slate-850 font-sans flex flex-col gap-3.5 mt-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400 font-bold block">Status badge</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase select-none ${getStatusBadge(selectedDriver.status).bg}`}>
                      {selectedDriver.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400 font-bold block">Safety Compliance</span>
                    <span className={`font-mono font-black ${
                      selectedDriver.safetyScore >= 90 ? 'text-emerald-400' : selectedDriver.safetyScore >= 80 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {selectedDriver.safetyScore} points ({getSafetyCategory(selectedDriver.safetyScore)})
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400 font-bold block">Trip Completion</span>
                    <span className="text-white font-mono font-bold">{selectedDriver.tripCompletion}% success rate</span>
                  </div>

                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400 font-bold block">Mobile Contact</span>
                    <span className="text-slate-300 font-mono">{selectedDriver.contact}</span>
                  </div>

                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400 font-bold block">License Expiry</span>
                    <span className="text-slate-300 font-mono">{selectedDriver.licenseExpiry}</span>
                  </div>
                </div>

                {isDriverBlocked(selectedDriver) && (
                  <div className="bg-rose-500/5 border border-rose-900/30 p-3 rounded-xl w-full flex items-start gap-2.5 text-left">
                    <ShieldAlert size={16} className="text-rose-500 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-extrabold text-rose-400 uppercase tracking-wide">License Lock Blocked</span>
                      <span className="text-[9px] text-slate-400 leading-normal">
                        This user does not pass corporate verification rules due to: {getBlockedReason(selectedDriver)}. Fleet assignments are disabled.
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full bg-slate-800 hover:bg-slate-750 text-slate-100 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all border border-slate-700"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* DELETE CONFIRM DIALOG MODAL */}
        {activeModal === 'delete' && selectedDriver && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-premium-lg rel overflow-hidden text-center"
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-900/20 flex items-center justify-center text-rose-500 mx-auto mb-4 mt-2">
                <Trash2 size={20} />
              </div>

              <h3 className="text-sm font-bold text-white mb-2">Delete Driver Record</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Are you sure you want to remove <strong className="text-white font-bold">{selectedDriver.name}</strong> from the TransitOps registry? This action is permanent and cannot be undone.
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2.5 border border-slate-800 hover:bg-slate-850 rounded-xl text-xs font-bold text-slate-450 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  Delete Record
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>

    </div>
  );
}
