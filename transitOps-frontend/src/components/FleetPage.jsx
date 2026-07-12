import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ChevronDown, Search, Truck, AlertCircle } from 'lucide-react';

// ─── Static seed data matching the template ───────────────────────────────────
const INITIAL_VEHICLES = [
  { id: 1, regNo: 'GJ01AB452',  name: 'VAN-05',   type: 'Van',   capacity: '500 kg', odometer: 74000,  avgCost: 620000,  status: 'Available' },
  { id: 2, regNo: 'GJ01AB998',  name: 'TRUCK-11', type: 'Truck', capacity: '5 Ton',  odometer: 182000, avgCost: 2450000, status: 'On Trip'   },
  { id: 3, regNo: 'GJ01AB120',  name: 'MINI-03',  type: 'Mini',  capacity: '1 Ton',  odometer: 66000,  avgCost: 410000,  status: 'In Shop'   },
  { id: 4, regNo: 'GJ01AB008',  name: 'VAN-09',   type: 'Van',   capacity: '750 kg', odometer: 241900, avgCost: 590000,  status: 'Retired'   },
];

const VEHICLE_TYPES = ['All', 'Van', 'Truck', 'Mini'];
const STATUSES      = ['All', 'Available', 'On Trip', 'In Shop', 'Retired'];

// ─── Status badge style map ───────────────────────────────────────────────────
const STATUS_STYLES = {
  'Available': 'bg-emerald-500   text-white',
  'On Trip':   'bg-sky-500       text-white',
  'In Shop':   'bg-amber-500     text-white',
  'Retired':   'bg-rose-400      text-white',
};

// ─── Indian number formatter ──────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat('en-IN').format(n);

// ─── Thin chevron Select ──────────────────────────────────────────────────────
function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-[#1a1a1a] border border-[#2a2a2a] text-white text-xs font-medium pl-3 pr-8 py-2 rounded-md outline-none focus:border-slate-600 transition-colors cursor-pointer"
      >
        {options.map((o) => (
          <option key={o} value={o}>{label}: {o}</option>
        ))}
      </select>
      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
}

// ─── Add Vehicle Modal ────────────────────────────────────────────────────────
function AddVehicleModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    regNo: '', name: '', type: 'Van', capacity: '', odometer: '', avgCost: '', status: 'Available',
  });
  const [error, setError] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.regNo.trim())  return setError('Registration No. is required.');
    if (!form.name.trim())   return setError('Vehicle name / model is required.');
    if (!form.capacity.trim()) return setError('Capacity is required.');
    setError('');
    onAdd({
      ...form,
      id: Date.now(),
      odometer: Number(form.odometer) || 0,
      avgCost:  Number(form.avgCost)  || 0,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 12 }}
        animate={{ scale: 1,    opacity: 1, y: 0  }}
        exit={{   scale: 0.95, opacity: 0, y: 12  }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#111] border border-[#222] rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e1e]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
              <Truck size={14} className="text-orange-400" />
            </div>
            <span className="text-sm font-bold text-white">Add Vehicle</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
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
              <select value={form.type} onChange={(e) => set('type', e.target.value)} className={inputCls}>
                {['Van', 'Truck', 'Mini'].map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Capacity" required>
              <input
                value={form.capacity}
                onChange={(e) => set('capacity', e.target.value)}
                placeholder="500 kg"
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
                value={form.avgCost}
                onChange={(e) => set('avgCost', e.target.value)}
                placeholder="0"
                className={inputCls}
              />
            </Field>
            <Field label="Status" className="col-span-2">
              <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputCls}>
                {['Available', 'On Trip', 'In Shop', 'Retired'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2"
              >
                <AlertCircle size={13} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button" onClick={onClose}
              className="text-xs font-bold text-slate-400 hover:text-white px-4 py-2 rounded-xl border border-[#2a2a2a] hover:bg-slate-800/60 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-xs font-bold text-black bg-orange-500 hover:bg-orange-400 active:scale-95 transition-all px-5 py-2 rounded-xl shadow-md shadow-orange-500/20"
            >
              Add Vehicle
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Reusable form field wrapper
function Field({ label, required, children, className = '' }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-xs rounded-lg px-3 py-2 outline-none focus:border-slate-600 transition-colors placeholder-slate-600';

// ─── Main Fleet Page ──────────────────────────────────────────────────────────
export default function FleetPage() {
  const [vehicles, setVehicles]       = useState(INITIAL_VEHICLES);
  const [typeFilter, setTypeFilter]   = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [regSearch, setRegSearch]     = useState('');
  const [showModal, setShowModal]     = useState(false);

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      const matchType   = typeFilter   === 'All' || v.type   === typeFilter;
      const matchStatus = statusFilter === 'All' || v.status === statusFilter;
      const matchReg    = v.regNo.toLowerCase().includes(regSearch.toLowerCase());
      return matchType && matchStatus && matchReg;
    });
  }, [vehicles, typeFilter, statusFilter, regSearch]);

  const addVehicle = (vehicle) => {
    setVehicles((prev) => [...prev, vehicle]);
  };

  return (
    <>
      <div className="flex-1 p-6 flex flex-col gap-5 min-h-0">

        {/* ── Top Filter Bar ── */}
        <div className="flex items-center gap-3 flex-wrap">
          <FilterSelect
            label="Type"
            value={typeFilter}
            options={VEHICLE_TYPES}
            onChange={setTypeFilter}
          />
          <FilterSelect
            label="Status"
            value={statusFilter}
            options={STATUSES}
            onChange={setStatusFilter}
          />

          {/* Reg. No search */}
          <div className="relative">
            <input
              value={regSearch}
              onChange={(e) => setRegSearch(e.target.value)}
              placeholder="Search reg. no..."
              className="bg-[#1a1a1a] border border-[#2a2a2a] text-white text-xs pl-8 pr-3 py-2 rounded-md outline-none focus:border-slate-600 transition-colors placeholder-slate-600 w-44"
            />
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Add Vehicle CTA */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-black text-xs font-bold px-4 py-2 rounded-md shadow-md shadow-orange-500/20 transition-colors"
          >
            <Plus size={14} strokeWidth={3} />
            Add Vehicle
          </motion.button>
        </div>

        {/* ── Table ── */}
        <div className="flex-1 overflow-auto rounded-lg border border-[#1e1e1e] bg-[#0d0d0d]">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1e1e1e]">
                {['Reg. No. Unique', 'Name/Model', 'Type', 'Capacity', 'Odometer', 'Avg. Cost', 'Status'].map((h) => (
                  <th key={h} className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 py-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-slate-600 text-xs">
                      No vehicles match the current filters.
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
                      className="border-b border-[#161616] hover:bg-[#141414] transition-colors group"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-slate-200 tracking-wide">
                        {v.regNo}
                      </td>
                      <td className="px-4 py-3 font-bold text-white">
                        {v.name}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {v.type}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {v.capacity}
                      </td>
                      <td className="px-4 py-3 text-slate-300 font-mono">
                        {fmt(v.odometer)}
                      </td>
                      <td className="px-4 py-3 text-slate-300 font-mono">
                        {fmt(v.avgCost)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block text-[11px] font-bold px-3 py-1 rounded ${STATUS_STYLES[v.status] ?? 'bg-slate-700 text-white'}`}>
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

        {/* ── Footer Rule Note ── */}
        <p className="text-[11px] text-orange-400/80">
          Rule: Registration No. must be unique · Retired/In Shop vehicles are hidden from Trip Dispatcher
        </p>

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
