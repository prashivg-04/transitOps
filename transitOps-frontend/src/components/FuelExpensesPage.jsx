import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Fuel, ReceiptText, ShieldAlert } from 'lucide-react';

// ─── Seed data matching template ──────────────────────────────────────────────
const SEED_FUEL_LOGS = [
  { id: 1, vehicle: 'VAN-05',   date: '05 Jul 2026', liters: 42,  fuelCost: 3150 },
  { id: 2, vehicle: 'TRUCK-11', date: '06 Jul 2026', liters: 110, fuelCost: 8400 },
  { id: 3, vehicle: 'MINI-09',  date: '06 Jul 2026', liters: 28,  fuelCost: 2050 },
];

const SEED_EXPENSES = [
  { id: 1, trip: 'TR000', vehicle: 'VAN-05',  toll: 120, other: 0,   maint: 0,      status: 'Available' },
  { id: 2, trip: 'TR000', vehicle: 'TRK-12',  toll: 340, other: 150, maint: 18000,  status: 'Completed' },
];

const VEHICLES = ['VAN-05', 'TRUCK-11', 'MINI-09', 'VAN-09', 'TRK-12'];
const PRICE_PER_LITRE = 75; // ₹ per litre (approx diesel)

const STATUS_STYLES = {
  Available: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  Completed: 'bg-blue-500/10    text-blue-400    border border-blue-500/20',
  On_Trip:   'bg-sky-500/10     text-sky-400     border border-sky-500/20',
  Cancelled: 'bg-rose-500/10    text-rose-400    border border-rose-500/20',
};

const fmt = (n) => new Intl.NumberFormat('en-IN').format(n);

// ─── Shared input style ───────────────────────────────────────────────────────
const inputCls =
  'w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-primary transition-colors focus:bg-slate-950';

const selectCls =
  'w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none cursor-pointer focus:border-primary transition-colors focus:bg-slate-950';

// ─── Reusable field wrapper ───────────────────────────────────────────────────
function Field({ label, children, className = '' }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Modal Shell ──────────────────────────────────────────────────────────────
function Modal({ title, icon: Icon, accentColor, onClose, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 py-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 12 }}
        animate={{ scale: 1,    opacity: 1, y: 0  }}
        exit={{   scale: 0.95, opacity: 0, y: 12  }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-premium-lg relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-850">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/20"
            >
              <Icon size={14} className="text-primary-light" />
            </div>
            <span className="text-sm font-black text-slate-200 uppercase tracking-widest">{title}</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-850"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

// ─── Log Fuel Modal ───────────────────────────────────────────────────────────
function LogFuelModal({ onClose, onAdd }) {
  const [vehicle, setVehicle] = useState('');
  const [date,    setDate]    = useState(new Date().toISOString().slice(0, 10));
  const [liters,  setLiters]  = useState('');
  const [priceL,  setPriceL]  = useState(String(PRICE_PER_LITRE));
  const [error,   setError]   = useState('');

  const fuelCost = liters && priceL ? Math.round(parseFloat(liters) * parseFloat(priceL)) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!vehicle) return setError('Please select a vehicle.');
    if (!liters || parseFloat(liters) <= 0) return setError('Enter a valid litre amount.');
    setError('');
    onAdd({
      id: Date.now(),
      vehicle,
      date: new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      liters: parseFloat(liters),
      fuelCost,
    });
    onClose();
  };

  return (
    <Modal title="Log Fuel" icon={Fuel} accentColor="#3b82f6" onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Vehicle" className="col-span-2">
            <select value={vehicle} onChange={(e) => setVehicle(e.target.value)} className={selectCls}>
              <option value="" className="bg-slate-950">Select vehicle…</option>
              {VEHICLES.map((v) => <option key={v} value={v} className="bg-slate-950">{v}</option>)}
            </select>
          </Field>
          <Field label="Date">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Litres">
            <input type="number" min={0} value={liters} onChange={(e) => setLiters(e.target.value)} placeholder="42" className={inputCls} />
          </Field>
          <Field label="Price / Litre (₹)">
            <input type="number" min={0} value={priceL} onChange={(e) => setPriceL(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Fuel Cost (Auto)">
            <div className="bg-slate-950/60 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs font-mono text-primary-light font-bold select-none">
              ₹ {fmt(fuelCost)}
            </div>
          </Field>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3.5 py-2.5">
              <AlertCircle size={13} />{error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-850 mt-1">
          <button type="button" onClick={onClose}
            className="px-4 py-2 border border-slate-800 hover:bg-slate-850 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button type="submit"
            className="px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95">
            Log Fuel
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Add Expense Modal ────────────────────────────────────────────────────────
function AddExpenseModal({ onClose, onAdd }) {
  const [trip,    setTrip]    = useState('');
  const [vehicle, setVehicle] = useState('');
  const [toll,    setToll]    = useState('');
  const [other,   setOther]   = useState('');
  const [maint,   setMaint]   = useState('');
  const [status,  setStatus]  = useState('Available');
  const [error,   setError]   = useState('');

  const total = (parseFloat(toll) || 0) + (parseFloat(other) || 0) + (parseFloat(maint) || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!trip.trim()) return setError('Trip ID is required.');
    if (!vehicle)     return setError('Please select a vehicle.');
    setError('');
    onAdd({
      id: Date.now(),
      trip: trip.trim().toUpperCase(),
      vehicle,
      toll:  parseFloat(toll)  || 0,
      other: parseFloat(other) || 0,
      maint: parseFloat(maint) || 0,
      status,
    });
    onClose();
  };

  return (
    <Modal title="Add Expense" icon={ReceiptText} accentColor="#3b82f6" onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Trip ID">
            <input value={trip} onChange={(e) => setTrip(e.target.value)} placeholder="TR009" className={inputCls} />
          </Field>
          <Field label="Vehicle">
            <select value={vehicle} onChange={(e) => setVehicle(e.target.value)} className={selectCls}>
              <option value="" className="bg-slate-950">Select…</option>
              {VEHICLES.map((v) => <option key={v} value={v} className="bg-slate-950">{v}</option>)}
            </select>
          </Field>
          <Field label="Toll (₹)">
            <input type="number" min={0} value={toll} onChange={(e) => setToll(e.target.value)} placeholder="0" className={inputCls} />
          </Field>
          <Field label="Other (₹)">
            <input type="number" min={0} value={other} onChange={(e) => setOther(e.target.value)} placeholder="0" className={inputCls} />
          </Field>
          <Field label="Maint. Linked (₹)">
            <input type="number" min={0} value={maint} onChange={(e) => setMaint(e.target.value)} placeholder="0" className={inputCls} />
          </Field>
          <Field label="Status">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls}>
              {['Available', 'Completed', 'On Trip', 'Cancelled'].map((s) => (
                <option key={s} value={s} className="bg-slate-950">{s === 'On Trip' ? 'On Trip' : s}</option>
              ))}
            </select>
          </Field>
          <Field label="Total (Auto)" className="col-span-2">
            <div className="bg-slate-950/60 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs font-mono text-primary-light font-bold select-none">
              ₹ {fmt(total)}
            </div>
          </Field>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3.5 py-2.5">
              <AlertCircle size={13} />{error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-850 mt-1">
          <button type="button" onClick={onClose}
            className="px-4 py-2 border border-slate-800 hover:bg-slate-850 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button type="submit"
            className="px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95">
            Add Expense
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Main Fuel & Expenses Page ────────────────────────────────────────────────
export default function FuelExpensesPage() {
  const [fuelLogs,  setFuelLogs]  = useState(SEED_FUEL_LOGS);
  const [expenses,  setExpenses]  = useState(SEED_EXPENSES);
  const [showFuel,  setShowFuel]  = useState(false);
  const [showExp,   setShowExp]   = useState(false);
  const { accessLevel } = useOutletContext();

  // Auto-calculated total operational cost
  const totalOp = useMemo(() => {
    const fuelTotal  = fuelLogs.reduce((s, r) => s + r.fuelCost, 0);
    const maintTotal = expenses.reduce((s, r) => s + r.maint, 0);
    return fuelTotal + maintTotal;
  }, [fuelLogs, expenses]);

  return (
    <>
      <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 min-h-screen text-left bg-slate-950 font-sans relative">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
              <Fuel size={20} className="text-primary-light" />
              Fuel & Fleet Expenses
            </h1>
            <p className="text-xs text-slate-500 max-w-xl mt-1">
              Track fuel consumption logs and allocate logistics costs against active trip dispatches.
            </p>
          </div>
          
          {accessLevel !== 'view' && (
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFuel(true)}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                + Log Fuel
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowExp(true)}
                className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                + Add Expense
              </motion.button>
            </div>
          )}
        </div>

        {/* ── FUEL LOGS SECTION ── */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
            Fuel Logs Directory
          </span>

          {/* Fuel table */}
          <div className="w-full bg-slate-900/15 border border-slate-850 rounded-2xl overflow-hidden shadow-premium">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse text-left select-none">
                <thead>
                  <tr className="border-b border-slate-850/80 bg-slate-900/40 text-slate-500 uppercase tracking-widest text-[9px] font-extrabold font-mono">
                    {['Vehicle ID', 'Intake Date', 'Litres Logged', 'Refueling Expense'].map((h) => (
                      <th key={h} className="px-5 py-4 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/40 divide-dashed">
                  <AnimatePresence mode="popLayout">
                    {fuelLogs.map((row, i) => (
                      <motion.tr
                        key={row.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="hover:bg-slate-900/20 transition-colors text-slate-300 font-medium"
                      >
                        <td className="px-5 py-4 font-bold text-white font-mono">{row.vehicle}</td>
                        <td className="px-5 py-4 text-slate-400 font-mono">{row.date}</td>
                        <td className="px-5 py-4 text-slate-400 font-mono">{row.liters} L</td>
                        <td className="px-5 py-4 text-slate-403 font-mono font-bold">₹{fmt(row.fuelCost)}</td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {fuelLogs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-slate-500 text-xs bg-slate-950/20">
                        No refueling events recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── OTHER EXPENSES SECTION ── */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
            Other Expenses (Tolls, Maintenance & Misc)
          </span>

          <div className="w-full bg-slate-900/15 border border-slate-850 rounded-2xl overflow-hidden shadow-premium">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse text-left select-none">
                <thead>
                  <tr className="border-b border-slate-850/80 bg-slate-900/40 text-slate-500 uppercase tracking-widest text-[9px] font-extrabold font-mono">
                    {['Trip ID', 'Vehicle ID', 'Toll Cost', 'Other/Misc', 'Maint. Linked', 'Status Status'].map((h) => (
                      <th key={h} className="px-5 py-4 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/40 divide-dashed">
                  <AnimatePresence mode="popLayout">
                    {expenses.map((row, i) => {
                      const rowTotal = row.toll + row.other + row.maint;
                      return (
                        <motion.tr
                          key={row.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="hover:bg-slate-900/20 transition-colors text-slate-300 font-medium"
                        >
                          <td className="px-5 py-4 font-bold text-white font-mono">{row.trip}</td>
                          <td className="px-5 py-4 text-slate-400 font-mono">{row.vehicle}</td>
                          <td className="px-5 py-4 text-slate-400 font-mono">₹{fmt(row.toll)}</td>
                          <td className="px-5 py-4 text-slate-400 font-mono">₹{fmt(row.other)}</td>
                          <td className="px-5 py-4 text-slate-400 font-mono">{row.maint ? `₹${fmt(row.maint)}` : '₹0'}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-lg ${STATUS_STYLES[row.status] ?? 'bg-slate-700/40 text-slate-300 border border-slate-600'}`}>
                              {row.status}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                  {expenses.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-500 text-xs bg-slate-950/20">
                        No expense logs initialized.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Total operational cost footer ── */}
        <div className="flex items-center justify-between bg-slate-900/20 border border-slate-850/80 p-5 rounded-2xl shadow-premium mt-2">
          <div className="flex items-center gap-2">
            <ShieldAlert size={14} className="text-primary-light flex-shrink-0" />
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono select-none">
              Total Cost Allocation (Auto calculated) = Refueling cost + maintenance logs
            </span>
          </div>
          <motion.span
            key={totalOp}
            initial={{ scale: 1.05, color: '#3B82F6' }}
            animate={{ scale: 1,    color: '#2563EB' }}
            transition={{ duration: 0.3 }}
            className="text-lg font-black font-mono text-primary-light"
          >
            ₹{fmt(totalOp)}
          </motion.span>
        </div>

      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showFuel && (
          <LogFuelModal
            onClose={() => setShowFuel(false)}
            onAdd={(row) => setFuelLogs((p) => [row, ...p])}
          />
        )}
        {showExp && (
          <AddExpenseModal
            onClose={() => setShowExp(false)}
            onAdd={(row) => setExpenses((p) => [row, ...p])}
          />
        )}
      </AnimatePresence>
    </>
  );
}
