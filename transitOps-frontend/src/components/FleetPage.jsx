import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search, Truck, AlertCircle, ShieldAlert, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { useVehicles, useCreateVehicle, useUpdateVehicle, useDeleteVehicle } from '../hooks/useVehicles';

const VEHICLE_TYPES = ['All', 'Truck', 'Van', 'Car', 'Motorcycle', 'Bus', 'Pickup', 'Trailer'];
const STATUSES      = ['All', 'Available', 'On Trip', 'In Shop', 'Retired'];

// Map API status to display status — backend already returns human-readable values
const mapStatus = (status) => status ?? 'Available';

// ─── Status badge style map ───────────────────────────────────────────────────
const STATUS_STYLES = {
  'Available': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  'On Trip':   'bg-blue-500/10   text-blue-400    border border-blue-500/20',
  'In Shop':   'bg-amber-500/10  text-amber-400   border border-amber-500/20',
  'Retired':   'bg-slate-800/40  text-slate-400   border border-slate-700/50',
};

// ─── Indian number formatter ──────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat('en-IN').format(n);

// ─── Add Vehicle Modal ────────────────────────────────────────────────────────
function AddVehicleModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    regNo: '', name: '', type: 'Van', capacity: '', odometer: '', acquisitionCost: '', status: 'Available',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.regNo.trim())  return setError('Registration No. is required.');
    if (!form.name.trim())   return setError('Vehicle name / model is required.');
    if (!form.capacity || isNaN(parseFloat(form.capacity)) || parseFloat(form.capacity) <= 0)
      return setError('Capacity must be a positive number (kg).');
    setError('');
    setIsLoading(true);
    try {
      await onAdd({
        registration_number: form.regNo.trim().toUpperCase(),
        vehicle_name:        form.name.trim().toUpperCase(),
        vehicle_type:        form.type,
        max_load_capacity:   parseFloat(form.capacity),
        odometer:            parseFloat(form.odometer) || 0,
        acquisition_cost:    parseFloat(form.acquisitionCost) || 0,
        status:              form.status,  // 'Available' | 'Retired' etc — exact enum value
      });
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.detail
        || err?.response?.data?.message
        || err?.response?.data?.errors?.[0]?.msg
        || 'Failed to add vehicle. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 py-6 select-none">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 12 }}
        animate={{ scale: 1,    opacity: 1, y: 0  }}
        exit={{   scale: 0.95, opacity: 0, y: 12  }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-premium-lg relative overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Truck size={14} className="text-primary-light" />
            </div>
            <span className="text-sm font-black text-slate-200 uppercase tracking-widest">Add Vehicle</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-850"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Reg. No. (Unique)" required>
              <input
                value={form.regNo}
                onChange={(e) => set('regNo', e.target.value.toUpperCase())}
                placeholder="GJ01AB000"
                className={inputCls}
              />
            </Field>
            <Field label="Name / Model" required>
              <input
                value={form.name}
                onChange={(e) => set('name', e.target.value.toUpperCase())}
                placeholder="VAN-10"
                className={inputCls}
              />
            </Field>
            <Field label="Type">
              <select value={form.type} onChange={(e) => set('type', e.target.value)} className={selectCls}>
                {['Truck', 'Van', 'Car', 'Motorcycle', 'Bus', 'Pickup', 'Trailer'].map((t) => <option key={t} value={t} className="bg-slate-950">{t}</option>)}
              </select>
            </Field>
            <Field label="Capacity (kg)" required>
              <input
                type="number" min={1}
                value={form.capacity}
                onChange={(e) => set('capacity', e.target.value)}
                placeholder="1000"
                className={inputCls}
              />
            </Field>
            <Field label="Odometer (km)">
              <input
                type="number" min={0}
                value={form.odometer}
                onChange={(e) => set('odometer', e.target.value)}
                placeholder="0"
                className={inputCls}
              />
            </Field>
            <Field label="Avg. Cost (₹)">
              <input
                type="number" min={0}
                value={form.acquisitionCost}
                onChange={(e) => set('acquisitionCost', e.target.value)}
                placeholder="0"
                className={inputCls}
              />
            </Field>
            <Field label="Status" className="col-span-2">
              <select value={form.status} onChange={(e) => set('status', e.target.value)} className={selectCls}>
                {['Available', 'On Trip', 'In Shop', 'Retired'].map((s) => (
                  <option key={s} value={s} className="bg-slate-950">{s}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3.5 py-2.5"
              >
                <AlertCircle size={13} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-850 mt-1">
            <button
              type="button" onClick={onClose}
              className="px-4 py-2 border border-slate-800 hover:bg-slate-850 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Adding…' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// Reusable form field wrapper
function Field({ label, required, children, className = '' }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
        {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-primary transition-colors';

const selectCls =
  'w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white outline-none cursor-pointer focus:border-primary transition-colors focus:bg-slate-950';

// ─── Main Fleet Page ──────────────────────────────────────────────────────────
export default function FleetPage() {
  const { data: vehiclesData, isLoading } = useVehicles(0, 100);
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const deleteVehicle = useDeleteVehicle();

  const [typeFilter, setTypeFilter]   = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [regSearch, setRegSearch]     = useState('');
  const [showModal, setShowModal]     = useState(false);

  // Unwrap backend response: { success, data: [...], page, total, ... }
  const apiVehicles = useMemo(() => {
    const items = vehiclesData?.data?.data ?? vehiclesData?.data ?? [];
    const list = Array.isArray(items) ? items : [];
    return list.map(v => ({
      id: v.id,
      regNo:    v.registration_number,
      name:     v.vehicle_name,
      type:     v.vehicle_type,
      capacity: v.max_load_capacity ? `${v.max_load_capacity} kg` : '',
      odometer: v.odometer || 0,
      avgCost:  v.acquisition_cost || 0,
      status:   mapStatus(v.status),
    }));
  }, [vehiclesData]);

  const filtered = useMemo(() => {
    return apiVehicles.filter((v) => {
      const matchType   = typeFilter   === 'All' || v.type   === typeFilter;
      const matchStatus = statusFilter === 'All' || v.status === statusFilter;
      const matchReg    = v.regNo?.toLowerCase().includes(regSearch.toLowerCase());
      return matchType && matchStatus && matchReg;
    });
  }, [apiVehicles, typeFilter, statusFilter, regSearch]);

  const addVehicle = async (vehiclePayload) => {
    // vehiclePayload is already in backend field format, built in AddVehicleModal.handleSubmit
    await createVehicle.mutateAsync(vehiclePayload);
  };

  const handleResetFilters = () => {
    setTypeFilter('All');
    setStatusFilter('All');
    setRegSearch('');
  };

  return (
    <>
      <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 min-h-0 text-left bg-slate-950 min-h-screen relative font-sans">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
              <Truck size={20} className="text-primary-light" />
              Fleet Registry
            </h1>
            <p className="text-xs text-slate-500 max-w-xl mt-1">
              Manage active fleet vehicles, specifications, metrics tracking, and fleet status updates.
            </p>
          </div>
          
          {/* Add Vehicle CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95 flex-shrink-0 cursor-pointer"
          >
            <Plus size={14} className="stroke-[3]" />
            Add Vehicle
          </motion.button>
        </div>

        {/* Filters Panel Row */}
        <div className="bg-slate-900/35 border border-slate-850 p-5 rounded-2xl flex flex-col gap-4">
          <div className="flex justify-between items-center select-none">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide flex items-center gap-1.5">
              <SlidersHorizontal size={10} />
              Filter parameters
            </span>
            <button 
              onClick={handleResetFilters}
              className="text-[10px] text-primary hover:text-blue-400 font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RefreshCw size={10} />
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Filter Type */}
            <div className="flex flex-col gap-1 bg-slate-950/40 p-3 rounded-xl border border-slate-900">
              <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Vehicle Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-300 font-bold outline-none cursor-pointer"
              >
                {VEHICLE_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-slate-900">{t === 'All' ? 'All Types' : t}</option>
                ))}
              </select>
            </div>

            {/* Filter Status */}
            <div className="flex flex-col gap-1 bg-slate-950/40 p-3 rounded-xl border border-slate-900">
              <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Status profile</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-300 font-bold outline-none cursor-pointer"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-slate-900">{s === 'All' ? 'All Statuses' : s}</option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search registration no..."
                value={regSearch}
                onChange={(e) => setRegSearch(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-850 text-xs text-slate-100 rounded-xl pl-9 pr-4 py-2.5 placeholder-slate-500 focus:border-primary outline-none transition-colors align-middle"
              />
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="w-full bg-slate-900/15 border border-slate-850 rounded-2xl overflow-hidden shadow-premium">
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse text-left select-none">
              <thead>
                <tr className="border-b border-slate-850/80 bg-slate-900/40 text-slate-500 uppercase tracking-widest text-[9px] font-extrabold font-mono">
                  {['Reg. No.', 'Name/Model', 'Type', 'Capacity', 'Odometer', 'Avg. Cost', 'Status'].map((h) => (
                    <th key={h} className="px-5 py-4 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/40 divide-dashed">
                <AnimatePresence mode="popLayout">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-slate-500 text-xs bg-slate-950/20">
                        Loading vehicles...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-slate-500 text-xs bg-slate-950/20">
                        No vehicles matching target filtering query.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((v, i) => (
                      <motion.tr
                        key={v.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ delay: i * 0.04 }}
                        className="hover:bg-slate-900/20 transition-colors text-slate-300 font-medium"
                      >
                        <td className="px-5 py-4 font-mono font-bold text-white tracking-wide">
                          {v.regNo}
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-205">
                          {v.name}
                        </td>
                        <td className="px-5 py-4 text-slate-400">
                          {v.type}
                        </td>
                        <td className="px-5 py-4 text-slate-400">
                          {v.capacity}
                        </td>
                        <td className="px-5 py-4 text-slate-400 font-mono">
                          {fmt(v.odometer)} km
                        </td>
                        <td className="px-5 py-4 text-slate-400 font-mono">
                          ₹{fmt(v.avgCost)}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-lg ${STATUS_STYLES[v.status] ?? 'bg-slate-700/40 text-slate-300 border border-slate-600'}`}>
                            {v.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Footer Rule Note ── */}
        <div className="flex items-center gap-2 bg-slate-900/20 border border-slate-850/50 p-4 rounded-xl">
          <ShieldAlert size={14} className="text-primary-light flex-shrink-0" />
          <p className="text-[11px] text-slate-400 text-left leading-normal font-medium">
            Rule Compliance: Registration No. must remain unique. Retired/In Shop vehicles are hidden from Trip Dispatcher registries by active business lock policies.
          </p>
        </div>

      </div>

      {/* ── Add Vehicle Modal ── */}
      <AnimatePresence>
        {showModal && (
          <AddVehicleModal
            onClose={() => setShowModal(false)}
            onAdd={addVehicle}
          />
        )}
      </AnimatePresence>
    </>
  );
}
