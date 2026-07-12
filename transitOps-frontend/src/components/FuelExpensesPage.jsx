import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Fuel, ReceiptText } from 'lucide-react';

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
  Available: 'bg-emerald-500 text-white',
  Completed: 'bg-emerald-700 text-white',
  On_Trip:   'bg-sky-500     text-white',
  Cancelled: 'bg-rose-400    text-white',
};

const fmt = (n) => new Intl.NumberFormat('en-IN').format(n);

// ─── Shared input style ───────────────────────────────────────────────────────
const inputCls =
  'w-full bg-transparent border border-[#2a2a2a] text-white text-xs rounded px-3 py-2.5 outline-none focus:border-slate-500 transition-colors placeholder-slate-700 font-mono';

// ─── Reusable field wrapper ───────────────────────────────────────────────────
function Field({ label, children, className = '' }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 12 }}
        animate={{ scale: 1,    opacity: 1, y: 0  }}
        exit={{   scale: 0.95, opacity: 0, y: 12  }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#111] border border-[#222] rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e1e]">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}40` }}
            >
              <Icon size={14} style={{ color: accentColor }} />
            </div>
            <span className="text-sm font-bold text-white">{title}</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
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
    <Modal title="Log Fuel" icon={Fuel} accentColor="#f97316" onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Vehicle" className="col-span-2">
            <select value={vehicle} onChange={(e) => setVehicle(e.target.value)} className={inputCls}>
              <option value="">Select vehicle…</option>
              {VEHICLES.map((v) => <option key={v}>{v}</option>)}
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
            <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded px-3 py-2.5 text-xs font-mono text-orange-400 font-bold">
              ₹ {fmt(fuelCost)}
            </div>
          </Field>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
              <AlertCircle size={13} />{error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-end gap-2 pt-1">
          <button type="button" onClick={onClose}
            className="text-xs font-bold text-slate-400 hover:text-white px-4 py-2 rounded-xl border border-[#2a2a2a] hover:bg-slate-800/60 transition-all">
            Cancel
          </button>
          <button type="submit"
            className="text-xs font-bold text-black bg-orange-500 hover:bg-orange-400 active:scale-95 transition-all px-5 py-2 rounded-xl shadow-md shadow-orange-500/20">
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
    <Modal title="Add Expense" icon={ReceiptText} accentColor="#f97316" onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Trip ID">
            <input value={trip} onChange={(e) => setTrip(e.target.value)} placeholder="TR009" className={inputCls} />
          </Field>
          <Field label="Vehicle">
            <select value={vehicle} onChange={(e) => setVehicle(e.target.value)} className={inputCls}>
              <option value="">Select…</option>
              {VEHICLES.map((v) => <option key={v}>{v}</option>)}
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
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
              {['Available', 'Completed', 'On Trip', 'Cancelled'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Total (Auto)" className="col-span-2">
            <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded px-3 py-2.5 text-xs font-mono text-orange-400 font-bold">
              ₹ {fmt(total)}
            </div>
          </Field>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
              <AlertCircle size={13} />{error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-end gap-2 pt-1">
          <button type="button" onClick={onClose}
            className="text-xs font-bold text-slate-400 hover:text-white px-4 py-2 rounded-xl border border-[#2a2a2a] hover:bg-slate-800/60 transition-all">
            Cancel
          </button>
          <button type="submit"
            className="text-xs font-bold text-black bg-orange-500 hover:bg-orange-400 active:scale-95 transition-all px-5 py-2 rounded-xl shadow-md shadow-orange-500/20">
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

  // Auto-calculated total operational cost
  const totalOp = useMemo(() => {
    const fuelTotal  = fuelLogs.reduce((s, r) => s + r.fuelCost, 0);
    const maintTotal = expenses.reduce((s, r) => s + r.maint, 0);
    return fuelTotal + maintTotal;
  }, [fuelLogs, expenses]);

  return (
    <>
      <div className="flex-1 p-6 flex flex-col gap-6 min-h-0 overflow-y-auto">

        {/* ── FUEL LOGS ── */}
        <div className="flex flex-col gap-3">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              Fuel Logs
            </span>
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowFuel(true)}
                className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-400 text-black text-xs font-bold px-3.5 py-2 rounded-md shadow-md shadow-orange-500/20 transition-colors"
              >
                + Log Fuel
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowExp(true)}
                className="flex items-center gap-1.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold px-3.5 py-2 rounded-md transition-colors"
              >
                + Add Expense
              </motion.button>
            </div>
          </div>

          {/* Fuel table */}
          <div className="rounded-lg border border-[#1e1e1e] bg-[#0d0d0d] overflow-hidden">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1e1e1e]">
                  {['Vehicle', 'Date', 'Litres', 'Fuel Cost'].map((h) => (
                    <th key={h} className="text-left text-[9px] font-bold text-slate-500 uppercase tracking-widest px-4 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {fuelLogs.map((row, i) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-[#161616] hover:bg-[#141414] transition-colors"
                    >
                      <td className="px-4 py-3 font-bold text-white font-mono">{row.vehicle}</td>
                      <td className="px-4 py-3 text-slate-400 font-mono">{row.date}</td>
                      <td className="px-4 py-3 text-slate-300 font-mono">{row.liters} L</td>
                      <td className="px-4 py-3 text-slate-300 font-mono">{fmt(row.fuelCost)}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {fuelLogs.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-8 text-slate-700 text-xs">No fuel logs yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── OTHER EXPENSES ── */}
        <div className="flex flex-col gap-3">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            Other Expenses (Toll / Misc)
          </span>

          <div className="rounded-lg border border-[#1e1e1e] bg-[#0d0d0d] overflow-hidden">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1e1e1e]">
                  {['Trip', 'Vehicle', 'Toll', 'Other', 'Maint. (Linked)', 'Total'].map((h) => (
                    <th key={h} className="text-left text-[9px] font-bold text-slate-500 uppercase tracking-widest px-4 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
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
                        className="border-b border-[#161616] hover:bg-[#141414] transition-colors"
                      >
                        <td className="px-4 py-3 font-bold text-white font-mono">{row.trip}</td>
                        <td className="px-4 py-3 text-slate-300 font-mono">{row.vehicle}</td>
                        <td className="px-4 py-3 text-slate-400 font-mono">{fmt(row.toll)}</td>
                        <td className="px-4 py-3 text-slate-400 font-mono">{fmt(row.other)}</td>
                        <td className="px-4 py-3 text-slate-400 font-mono">{row.maint ? fmt(row.maint) : '0'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block text-[10px] font-bold px-3 py-1 rounded ${STATUS_STYLES[row.status] ?? 'bg-slate-700 text-white'}`}>
                            {row.status}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
                {expenses.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-8 text-slate-700 text-xs">No expense records yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Total operational cost footer ── */}
        <div className="flex items-center justify-between border-t border-[#1e1e1e] pt-4">
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest font-mono">
            Total Operational Cost (Auto) = Fuel + Maint
          </span>
          <motion.span
            key={totalOp}
            initial={{ scale: 1.05, color: '#fb923c' }}
            animate={{ scale: 1,    color: '#f97316' }}
            transition={{ duration: 0.3 }}
            className="text-lg font-extrabold font-mono"
            style={{ color: '#f97316' }}
          >
            {fmt(totalOp)}
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
