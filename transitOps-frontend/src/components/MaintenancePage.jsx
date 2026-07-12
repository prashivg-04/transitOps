import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, Play, CheckCircle2, XCircle, AlertTriangle, Search, Plus, 
  Trash2, Edit2, Eye, Calendar, DollarSign, RefreshCw, X, ShieldAlert,
  ClipboardList, Info, HelpCircle
} from 'lucide-react';

const SAMPLE_VEHICLES = ['VAN-05', 'TRUCK-11', 'MINI-03', 'TRAILER-08', 'TRUCK-09', 'SUV-14'];
const SERVICE_TYPES = [
  'Oil Change', 'Tyre Replacement', 'Brake Service', 'Engine Repair', 
  'Battery Replacement', 'General Inspection', 'Air Filter Replacement'
];
const TECHNICIANS = ['Alex Patel', 'Sarah Jenkins', 'Mohammed Al-Fayed', 'Robert Chen', 'Elena Rostova'];

const INITIAL_RECORDS = [
  { id: '1', vehicle: 'VAN-05', serviceType: 'Oil Change', cost: 120, date: '2026-07-10', technician: 'Sarah Jenkins', status: 'Completed', description: 'Regular preventative engine oil replacement. Filters swapped.', notes: 'Next replacement in 10,000 km.' },
  { id: '2', vehicle: 'TRUCK-11', serviceType: 'Engine Repair', cost: 1450, date: '2026-07-11', technician: 'Mohammed Al-Fayed', status: 'In Shop', description: 'Overheating issues, diagnosed gasket replacement.', notes: 'Waiting for custom radiator seals.' },
  { id: '3', vehicle: 'MINI-03', serviceType: 'Tyre Replacement', cost: 380, date: '2026-07-12', technician: 'Robert Chen', status: 'In Shop', description: 'Rear tyre alignment and tread wear swap.', notes: 'All weather radial tyres installed.' },
  { id: '4', vehicle: 'TRUCK-09', serviceType: 'Brake Service', cost: 420, date: '2026-07-08', technician: 'Elena Rostova', status: 'Completed', description: 'Front ceramic disc brake pad replacements.', notes: 'Rotors resurfaced.' },
  { id: '5', vehicle: 'TRAILER-08', serviceType: 'General Inspection', cost: 95, date: '2026-07-05', technician: 'Alex Patel', status: 'Completed', description: 'Biannual chassis and wiring review.', notes: 'All indicators and air brakes operational.' },
  { id: '6', vehicle: 'VAN-05', serviceType: 'Battery Replacement', cost: 180, date: '2026-07-12', technician: 'Elena Rostova', status: 'Scheduled', description: 'Low voltage detected during morning fleet startup scans.', notes: 'Scheduled for 3:00 PM.' },
  { id: '7', vehicle: 'TRUCK-11', serviceType: 'Air Filter Replacement', cost: 65, date: '2026-07-02', technician: 'Robert Chen', status: 'Cancelled', description: 'Replaced during custom repairs last week.', notes: 'Cancelled by fleet dispatcher.' }
];

export default function MaintenancePage() {
  const [records, setRecords] = useState(INITIAL_RECORDS);

  // Form State
  const [vehicle, setVehicle] = useState(SAMPLE_VEHICLES[0]);
  const [serviceType, setServiceType] = useState(SERVICE_TYPES[0]);
  const [cost, setCost] = useState('');
  const [date, setDate] = useState('2026-07-12');
  const [status, setStatus] = useState('In Shop');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [technician, setTechnician] = useState(TECHNICIANS[0]);
  
  const [formErrors, setFormErrors] = useState({});
  const [editingId, setEditingId] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('All');

  // Modals
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewRecordModal, setViewRecordModal] = useState(false);
  const [deleteRecordModal, setDeleteRecordModal] = useState(false);

  // Form Handler Actions
  const handleResetForm = () => {
    setVehicle(SAMPLE_VEHICLES[0]);
    setServiceType(SERVICE_TYPES[0]);
    setCost('');
    setDate('2026-07-12');
    setStatus('In Shop');
    setDescription('');
    setNotes('');
    setTechnician(TECHNICIANS[0]);
    setFormErrors({});
    setEditingId(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!cost || isNaN(cost) || parseFloat(cost) <= 0) {
      errors.cost = 'Please provide a valid service cost (> 0)';
    }
    if (!date) {
      errors.date = 'Date is required';
    }
    if (!description.trim()) {
      errors.description = 'Description is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveRecord = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingId) {
      // Modify
      setRecords(records.map(r => r.id === editingId ? {
        ...r,
        vehicle,
        serviceType,
        cost: parseFloat(cost),
        date,
        technician,
        status,
        description,
        notes
      } : r));
      setEditingId(null);
    } else {
      // Add
      const newRecord = {
        id: (records.length + 1).toString(),
        vehicle,
        serviceType,
        cost: parseFloat(cost),
        date,
        technician,
        status,
        description,
        notes
      };
      setRecords([newRecord, ...records]);
    }
    handleResetForm();
  };

  const triggerEdit = (record) => {
    setEditingId(record.id);
    setVehicle(record.vehicle);
    setServiceType(record.serviceType);
    setCost(record.cost.toString());
    setDate(record.date);
    setStatus(record.status);
    setDescription(record.description);
    setNotes(record.notes || '');
    setTechnician(record.technician);
    setFormErrors({});
  };

  const triggerDelete = (record) => {
    setSelectedRecord(record);
    setDeleteRecordModal(true);
  };

  const confirmDelete = () => {
    if (selectedRecord) {
      setRecords(records.filter(r => r.id !== selectedRecord.id));
    }
    setDeleteRecordModal(false);
    setSelectedRecord(null);
  };

  const triggerView = (record) => {
    setSelectedRecord(record);
    setViewRecordModal(true);
  };

  // Status Styles
  const getStatusBadge = (statusName) => {
    switch (statusName) {
      case 'In Shop':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Scheduled':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'Cancelled':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      default:
        return 'bg-slate-800 text-slate-400 border border-slate-700/50';
    }
  };

  // KPI Calculations
  const vehiclesInShop = Array.from(new Set(
    records.filter(r => r.status === 'In Shop').map(r => r.vehicle)
  )).length;

  const todayCount = records.filter(r => r.date === '2026-07-12').length;
  const completedCount = records.filter(r => r.status === 'Completed').length;
  const pendingCount = records.filter(r => r.status === 'In Shop' || r.status === 'Scheduled').length;
  
  const totalCost = records
    .filter(r => r.status !== 'Cancelled')
    .reduce((sum, r) => sum + r.cost, 0);

  // Group costs by service type for the custom mini SVG visual report
  const typeCosts = SERVICE_TYPES.reduce((acc, type) => {
    const costForType = records
      .filter(r => r.serviceType === type && r.status !== 'Cancelled')
      .reduce((s, r) => s + r.cost, 0);
    if (costForType > 0) acc.push({ name: type, amount: costForType });
    return acc;
  }, []);

  const maxCost = Math.max(...typeCosts.map(t => t.amount), 1);

  // Filter application
  const filteredRecords = records.filter(r => {
    const matchesSearch = r.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.technician.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesService = serviceTypeFilter === 'All' || r.serviceType === serviceTypeFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  return (
    <div className="flex-1 flex flex-col gap-6 p-6 md:p-8 text-left bg-slate-950 min-h-screen relative font-sans">
      
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <Wrench size={20} className="text-primary" />
          Maintenance Management
        </h1>
        <p className="text-xs text-slate-500 max-w-xl mt-1">
          Track vehicle maintenance, service history and workshop status.
        </p>
      </div>

      {/* TOP SUMMARY KPI ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Vehicles In Shop */}
        <div className="bg-slate-900/35 border border-slate-850 p-4 rounded-xl shadow-sm flex flex-col justify-between">
          <span className="text-[9px] uppercase font-bold text-slate-550 tracking-wider">Vehicles In Shop</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-white">{String(vehiclesInShop).padStart(2, '0')}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping inline-block" />
          </div>
        </div>

        {/* Today's Services */}
        <div className="bg-slate-900/35 border border-slate-850 p-4 rounded-xl shadow-sm flex flex-col justify-between">
          <span className="text-[9px] uppercase font-bold text-slate-550 tracking-wider">Today's Services</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-white">{String(todayCount).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Completed Services */}
        <div className="bg-slate-900/35 border border-slate-850 p-4 rounded-xl shadow-sm flex flex-col justify-between">
          <span className="text-[9px] uppercase font-bold text-slate-550 tracking-wider">Completed Services</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-white">{String(completedCount).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Pending Services */}
        <div className="bg-slate-900/35 border border-slate-850 p-4 rounded-xl shadow-sm flex flex-col justify-between">
          <span className="text-[9px] uppercase font-bold text-slate-550 tracking-wider">Pending Services</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-white">{String(pendingCount).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Monthly Cost */}
        <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-indigo-950/20 to-slate-900/35 border border-indigo-900/20 p-4 rounded-xl shadow-sm flex flex-col justify-between">
          <span className="text-[9px] uppercase font-bold text-indigo-400 tracking-wider">Total Expense</span>
          <div className="flex items-baseline mt-1 font-mono text-xl font-black text-slate-100">
            ${totalCost.toLocaleString()}
          </div>
        </div>

      </div>

      {/* TWO-COLUMN GRID ASSEMBLY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: MAINTENANCE FORM & BUSINESS CARD */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          <div className="bg-slate-905 border border-slate-850/80 p-5 p-py-4.5 rounded-2xl shadow-premium backdrop-blur-sm">
            <h2 className="text-xs font-black text-slate-200 uppercase tracking-widest mb-4 flex items-center gap-2 pb-2.5 border-b border-slate-850/60">
              <ClipboardList size={13} className="text-primary" />
              {editingId ? 'Edit Service Record' : 'Log Service Record'}
            </h2>

            <form onSubmit={handleSaveRecord} className="flex flex-col gap-4">
              
              {/* VEHICLE DROP SELECT */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Vehicle</label>
                <select
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-250 cursor-pointer focus:border-primary outline-none"
                >
                  {SAMPLE_VEHICLES.map((v) => (
                    <option key={v} value={v} className="bg-slate-900 text-slate-100">{v}</option>
                  ))}
                </select>
              </div>

              {/* SERVICE TYPE SELECT */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Service Type</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-250 cursor-pointer focus:border-primary outline-none"
                >
                  {SERVICE_TYPES.map((st) => (
                    <option key={st} value={st} className="bg-slate-900 text-slate-100">{st}</option>
                  ))}
                </select>
              </div>

              {/* DUAL ROW: COST & DATE */}
              <div className="grid grid-cols-2 gap-4">
                
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Cost ($)</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      placeholder="Cost"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-6 pr-3 py-2 text-xs text-slate-100 placeholder-slate-700 focus:border-primary outline-none"
                    />
                    <DollarSign size={10} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600" />
                  </div>
                  {formErrors.cost && <span className="text-[8px] font-bold text-rose-500 mt-0.5">{formErrors.cost}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none cursor-pointer focus:border-primary font-mono"
                  />
                  {formErrors.date && <span className="text-[8px] font-bold text-rose-500 mt-0.5">{formErrors.date}</span>}
                </div>

              </div>

              {/* DUAL ROW: STATUS & TECHNICIAN */}
              <div className="grid grid-cols-2 gap-4">
                
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-250 cursor-pointer focus:border-primary outline-none"
                  >
                    <option value="In Shop" className="bg-slate-900">In Shop</option>
                    <option value="Completed" className="bg-slate-900">Completed</option>
                    <option value="Scheduled" className="bg-slate-900">Scheduled</option>
                    <option value="Cancelled" className="bg-slate-900">Cancelled</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Technician</label>
                  <select
                    value={technician}
                    onChange={(e) => setTechnician(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-250 cursor-pointer focus:border-primary outline-none"
                  >
                    {TECHNICIANS.map((t) => (
                      <option key={t} value={t} className="bg-slate-900 text-slate-100">{t}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* DESCRIPTION TEXTAREA */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Service details</label>
                <textarea
                  placeholder="Describe work done, diagnoses, or specifications..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-primary outline-none resize-none"
                />
                {formErrors.description && <span className="text-[8px] font-bold text-rose-500 mt-0.5">{formErrors.description}</span>}
              </div>

              {/* OPTIONAL NOTES TEXTAREA */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold text-slate-550 tracking-wider">Internal Notes (Optional)</label>
                <textarea
                  placeholder="Warranty logs, warning flags, or follow-ups..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={1}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-700 focus:border-primary outline-none resize-none"
                />
              </div>

              {/* ACTION BUTTONS ROW */}
              <div className="flex justify-end gap-3.5 border-t border-slate-850/80 pt-4 mt-1">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-850 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  {editingId ? 'Update Record' : 'Save Record'}
                </button>
              </div>

            </form>
          </div>

          {/* BUSINESS RULE CARD ACCORDING TO WIREFRAME */}
          <div className="bg-gradient-to-br from-indigo-950/20 to-slate-900/35 border border-indigo-900/30 p-5 rounded-2xl shadow-premium">
            <div className="flex items-center gap-2 mb-3.5">
              <ShieldAlert size={16} className="text-secondary-light" />
              <h3 className="text-xs font-black text-slate-200 uppercase tracking-widest">Maintenance Rules</h3>
            </div>
            
            <div className="flex flex-col gap-3 font-sans text-[10px] text-slate-400 leading-normal">
              
              <div className="flex items-start gap-3 border-b border-slate-900 pb-2.5">
                <span className="inline-block mt-0.5 bg-amber-500/10 text-amber-400 p-0.8 rounded">🛠️</span>
                <div>
                  <strong className="text-slate-350 font-bold block mb-0.2">Auto Shop Assignment</strong>
                  Switching a driver/vehicle record to <span className="text-amber-500 font-bold">Active (In Shop)</span> maintenance shifts the asset state immediately, dropping it from availability pools.
                </div>
              </div>

              <div className="flex items-start gap-3 border-b border-slate-900 pb-2.5">
                <span className="inline-block mt-0.5 bg-rose-500/10 text-rose-400 p-0.8 rounded">🚫</span>
                <div>
                  <strong className="text-slate-355 font-bold block mb-0.2">Dispatch lockout regulations</strong>
                  Vehicles undergoing maintenance cannot be assigned to active client routes until technicians submit full structural checklists.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="inline-block mt-0.5 bg-emerald-500/10 text-emerald-400 p-0.8 rounded">✅</span>
                <div>
                  <strong className="text-slate-355 font-bold block mb-0.2">Auto-Restore Availability</strong>
                  Marking active logs as <span className="text-emerald-400 font-bold">Completed</span> automatically releases the vehicle for dispatcher schedules.
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: LISTING & COST TREND ANALYSIS */}
        <div className="lg:col-span-7 flex flex-col gap-6">

          {/* FILTERS PANEL */}
          <div className="bg-slate-900/35 border border-slate-850 p-5 rounded-2xl flex flex-col gap-4">
            
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-400 font-extrabold uppercase tracking-widest select-none">Service History Filters</span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                  setServiceTypeFilter('All');
                }}
                className="text-primary hover:text-blue-400 font-bold flex items-center gap-1.5 transition-colors text-[9px] uppercase tracking-wide cursor-pointer"
              >
                <RefreshCw size={10} />
                Clean Filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* SEARCH BOX */}
              <div className="relative md:col-span-1">
                <input
                  type="text"
                  placeholder="Search vehicle / tech..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl pl-8 pr-3 py-2 placeholder-slate-600 focus:border-primary outline-none transition-colors"
                />
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600" />
              </div>

              {/* STATUS FILTER */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-primary"
                >
                  <option value="All" className="bg-slate-900">All Statuses</option>
                  <option value="In Shop" className="bg-slate-900">In Shop</option>
                  <option value="Completed" className="bg-slate-900">Completed</option>
                  <option value="Scheduled" className="bg-slate-900">Scheduled</option>
                  <option value="Cancelled" className="bg-slate-900">Cancelled</option>
                </select>
              </div>

              {/* SERVICE TYPE FILTER */}
              <div>
                <select
                  value={serviceTypeFilter}
                  onChange={(e) => setServiceTypeFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-primary"
                >
                  <option value="All" className="bg-slate-900">All Services</option>
                  {SERVICE_TYPES.map(st => (
                    <option key={st} value={st} className="bg-slate-900">{st}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* SERVICE DIRECTORY COMPONENT LIST */}
          <div className="w-full">
            {filteredRecords.length > 0 ? (
              <>
                {/* TABLE VIEW */}
                <div className="hidden md:block w-full bg-slate-900/15 border border-slate-850 rounded-2xl overflow-hidden shadow-premium">
                  <table className="w-full text-xs text-left border-collapse select-none">
                    <thead>
                      <tr className="border-b border-slate-850/80 bg-slate-900/40 text-slate-500 uppercase tracking-widest text-[9px] font-extrabold font-mono">
                        <th className="px-4 py-3.5">Vehicle</th>
                        <th className="px-4 py-3.5">Service Type</th>
                        <th className="px-4 py-3.5">Cost</th>
                        <th className="px-4 py-3.5">Date</th>
                        <th className="px-4 py-3.5">Technician</th>
                        <th className="px-4 py-3.5">Status</th>
                        <th className="px-4 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850/40 divide-dashed">
                      {filteredRecords.map((r) => (
                        <motion.tr
                          layout
                          key={r.id}
                          className="hover:bg-slate-900/20 text-slate-350 font-medium transition-colors"
                        >
                          <td className="px-4 py-3.5 font-bold text-white font-mono text-[10px]">
                            {r.vehicle}
                          </td>
                          <td className="px-4 py-3.5 font-sans font-bold text-slate-200">
                            {r.serviceType}
                          </td>
                          <td className="px-4 py-3.5 font-mono text-slate-300">
                            ${r.cost}
                          </td>
                          <td className="px-4 py-3.5 font-mono text-[10px] text-slate-500">
                            {r.date}
                          </td>
                          <td className="px-4 py-3.5 text-slate-400 font-sans">
                            {r.technician}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide select-none ${getStatusBadge(r.status)}`}>
                              {r.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right w-[110px]">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => triggerView(r)}
                                title="View details"
                                className="w-7 h-7 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-850 transition-colors"
                              >
                                <Eye size={12} />
                              </button>
                              <button
                                onClick={() => triggerEdit(r)}
                                title="Edit log"
                                className="w-7 h-7 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-850 transition-colors"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                onClick={() => triggerDelete(r)}
                                title="Delete log"
                                className="w-7 h-7 bg-slate-900 border border-slate-855 rounded-lg flex items-center justify-center text-rose-450 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-900/30 transition-colors"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* MOBILE CARD VIEW */}
                <div className="md:hidden flex flex-col gap-4">
                  {filteredRecords.map((r) => (
                    <motion.div
                      layout
                      key={r.id}
                      className="bg-slate-900/35 border border-slate-850 p-4.5 rounded-2xl flex flex-col gap-3 shadow-sm text-xs font-sans text-left"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <span className="font-bold font-mono text-white text-xs">{r.vehicle}</span>
                          <span className="text-[10px] text-slate-500 font-bold mt-0.5">{r.serviceType}</span>
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide select-none ${getStatusBadge(r.status)}`}>
                          {r.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900 text-[10px] font-mono">
                        <div>
                          <span className="text-slate-500 text-[8px] uppercase block font-bold">Cost</span>
                          <span className="text-slate-350 mt-0.5 block">${r.cost}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[8px] uppercase block font-bold">Technician</span>
                          <span className="text-slate-350 mt-0.5 block">{r.technician}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-500 text-[8px] uppercase block font-bold">Date</span>
                          <span className="text-slate-400 mt-0.5 block">{r.date}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-t border-slate-850/45 pt-3">
                        <span className="text-[10px] text-slate-550 font-serif">ID: {r.id}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => triggerView(r)}
                            className="px-2.5 py-1.5 bg-slate-800 border border-slate-700/60 rounded-lg text-slate-300 text-[10px] font-bold"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => triggerEdit(r)}
                            className="px-2.5 py-1.5 bg-slate-800 border border-slate-700/60 rounded-lg text-slate-300 text-[10px] font-bold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => triggerDelete(r)}
                            className="px-2.5 py-1.5 bg-rose-950/20 border border-rose-900/30 rounded-lg text-rose-400 text-[10px] font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              /* EMPTY FILTER STATE RENDER */
              <div className="bg-slate-900/35 border border-slate-850 p-10 rounded-2xl flex flex-col justify-center items-center text-center shadow-premium bg-slate-900/10 select-none">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-3 border border-slate-750">
                  <ClipboardList size={22} />
                </div>
                <h3 className="text-xs font-bold text-white mb-1">No maintenance files found</h3>
                <p className="text-[10px] text-slate-500 max-w-xs leading-normal">
                  No registered active reports match your specific search criteria. Clean filters and try again.
                </p>
              </div>
            )}
          </div>

          {/* VISUAL CHART REPORT: COST RATIO SPEND FOR SERVICES */}
          {typeCosts.length > 0 && (
            <div className="bg-slate-900/35 border border-slate-850 p-5 rounded-2xl flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest select-none">Maintenance Cost Ratios</span>
                <span className="text-[9px] text-indigo-400 font-mono select-none">USD Ratio Analysis</span>
              </div>

              <div className="flex flex-col gap-3 font-mono">
                {typeCosts.map(costInfo => {
                  const percentageWidth = (costInfo.amount / maxCost) * 100;
                  return (
                    <div key={costInfo.name} className="flex flex-col gap-1">
                      <div className="flex justify-between text-[9px] text-slate-400">
                        <span className="font-bold">{costInfo.name}</span>
                        <span className="font-black text-slate-200">${costInfo.amount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
                        <div 
                          style={{ width: `${percentageWidth}%` }}
                          className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ================= MODALS SECTION ================= */}
      <AnimatePresence>
        
        {/* VIEW RECORD DETAILS MODAL */}
        {viewRecordModal && selectedRecord && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-premium-lg rel overflow-hidden"
            >
              <button 
                onClick={() => setViewRecordModal(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-1"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col gap-4 text-left font-sans">
                
                {/* Header Icon & Vehicle Badge */}
                <div className="flex items-center gap-3 border-b border-slate-850 pb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Wrench size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Logs Dossier</h3>
                    <span className="text-sm font-extrabold text-white font-mono mt-0.5 block">{selectedRecord.vehicle}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 text-[11px] bg-slate-950/45 p-4 rounded-xl border border-slate-855">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold">Service Category</span>
                    <span className="text-white font-bold">{selectedRecord.serviceType}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold">Invoice cost</span>
                    <span className="text-emerald-450 font-mono font-black">${selectedRecord.cost}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold">Workshop date</span>
                    <span className="text-slate-300 font-mono">{selectedRecord.date}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold">Assigned tech</span>
                    <span className="text-slate-300">{selectedRecord.technician}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold">Status descriptor</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${getStatusBadge(selectedRecord.status)}`}>
                      {selectedRecord.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Service description</label>
                  <p className="bg-slate-950 p-2.5 rounded-xl border border-slate-900 text-[10px] text-slate-350 leading-relaxed font-sans min-h-[50px]">
                    {selectedRecord.description}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider font-mono">Follow-up Notes</label>
                  <p className="bg-slate-950 p-2.5 rounded-xl border border-slate-900 text-[10px] text-slate-400 leading-relaxed font-sans placeholder-slate-700">
                    {selectedRecord.notes || 'No follow-up annotations recorded.'}
                  </p>
                </div>

                <button
                  onClick={() => setViewRecordModal(false)}
                  className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all border border-slate-705 mt-2"
                >
                  Close Record
                </button>

              </div>
            </motion.div>
          </div>
        )}

        {/* DELETE CONFIRM DIALOG MODAL */}
        {deleteRecordModal && selectedRecord && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-premium-lg rel overflow-hidden text-center"
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-900/20 flex items-center justify-center text-rose-505 mx-auto mb-4 mt-2">
                <Trash2 size={20} />
              </div>

              <h3 className="text-sm font-bold text-white mb-2">Delete Maintenance File</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Are you sure you want to remove the <strong className="text-white font-bold">{selectedRecord.serviceType}</strong> history report for vehicle <strong className="text-white font-bold font-mono">{selectedRecord.vehicle}</strong>?
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setDeleteRecordModal(false)}
                  className="px-4 py-2.5 border border-slate-800 hover:bg-slate-850 rounded-xl text-xs font-bold text-slate-450 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  Delete Report
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>

    </div>
  );
}
