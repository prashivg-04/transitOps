import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Save, Sliders, AlertCircle } from 'lucide-react';

// ─── RBAC data matching the template ─────────────────────────────────────────
// Access values: 'full' | 'view' | 'none'
const RBAC_ROLES = [
  {
    role: 'Fleet Manager',
    access: { fleet: 'full', drivers: 'full', trips: 'none', fuelExp: 'none', analytics: 'full' },
  },
  {
    role: 'Dispatcher',
    access: { fleet: 'view', drivers: 'none', trips: 'full', fuelExp: 'none', analytics: 'none' },
  },
  {
    role: 'Safety Officer',
    access: { fleet: 'none', drivers: 'full', trips: 'view', fuelExp: 'none', analytics: 'none' },
  },
  {
    role: 'Financial Analyst',
    access: { fleet: 'view', drivers: 'none', trips: 'none', fuelExp: 'full', analytics: 'full' },
  },
];

const RBAC_COLS = [
  { key: 'fleet',     label: 'Fleet'     },
  { key: 'drivers',   label: 'Drivers'   },
  { key: 'trips',     label: 'Trips'     },
  { key: 'fuelExp',   label: 'Fuel/Exp.' },
  { key: 'analytics', label: 'Analytics' },
];

// ─── Access cell renderer ─────────────────────────────────────────────────────
function AccessCell({ value }) {
  if (value === 'full') {
    return (
      <span className="text-emerald-400 font-extrabold text-sm select-none">✓</span>
    );
  }
  if (value === 'view') {
    return (
      <span className="text-blue-400 text-[10px] font-extrabold uppercase tracking-wide select-none">View</span>
    );
  }
  return (
    <span className="text-slate-700 text-sm font-extrabold font-mono select-none">—</span>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-primary transition-colors focus:bg-slate-950 font-sans';

const selectCls =
  'w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none cursor-pointer focus:border-primary transition-colors focus:bg-slate-950';

// ─── Settings Page ────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [depot,    setDepot]    = useState('Gandhinagar Depot GJ4');
  const [currency, setCurrency] = useState('INR (Rs)');
  const [distUnit, setDistUnit] = useState('Kilometers');
  const [saved,    setSaved]    = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 min-h-screen text-left bg-slate-950 font-sans relative">

      {/* Page Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <Sliders size={20} className="text-primary-light" />
          System Configuration
        </h1>
        <p className="text-xs text-slate-500 max-w-xl mt-1">
          Manage operational hubs, metrics options, default currency preferences, and verify dashboard authorization roles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ══════════════ LEFT: GENERAL SETTINGS ══════════════ */}
        <div className="lg:col-span-4 bg-slate-900/35 border border-slate-850 p-6 rounded-2xl shadow-premium backdrop-blur-sm flex flex-col gap-5">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
            General Parameters
          </span>

          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <Field label="Depot Name">
              <input
                value={depot}
                onChange={(e) => setDepot(e.target.value)}
                placeholder="Gandhinagar Depot GJ4"
                className={inputCls}
              />
            </Field>

            <Field label="Currency Select">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={selectCls}
              >
                <option value="INR (Rs)" className="bg-slate-955">INR (Rs)</option>
                <option value="USD ($)" className="bg-slate-955">USD ($)</option>
                <option value="EUR (€)" className="bg-slate-955">EUR (€)</option>
                <option value="GBP (£)" className="bg-slate-955">GBP (£)</option>
              </select>
            </Field>

            <Field label="Distance Unit">
              <select
                value={distUnit}
                onChange={(e) => setDistUnit(e.target.value)}
                className={selectCls}
              >
                <option value="Kilometers" className="bg-slate-955">Kilometers</option>
                <option value="Miles" className="bg-slate-955">Miles</option>
              </select>
            </Field>

            {/* Save Changes button */}
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all shadow-lg active:scale-95 mt-2 cursor-pointer"
            >
              <AnimatePresence mode="wait">
                {saved ? (
                  <motion.span
                    key="saved"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-1.5"
                  >
                    <Check size={13} />
                    Saved Settings
                  </motion.span>
                ) : (
                  <motion.span
                    key="save"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-1.5"
                  >
                    <Save size={13} />
                    Save Changes
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>
        </div>

        {/* ══════════════ RIGHT: RBAC TABLE ══════════════ */}
        <div className="lg:col-span-8 bg-slate-900/35 border border-slate-850 p-6 rounded-2xl shadow-premium backdrop-blur-sm flex flex-col gap-5">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
            Role-Based Access Control (RBAC) System
          </span>

          <div className="w-full bg-slate-900/15 border border-slate-850 rounded-2xl overflow-hidden shadow-premium">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse text-left select-none">
                <thead>
                  <tr className="border-b border-slate-850/80 bg-slate-900/40 text-slate-500 uppercase tracking-widest text-[9px] font-extrabold font-mono">
                    <th className="px-5 py-4 w-40 whitespace-nowrap">
                      User role
                    </th>
                    {RBAC_COLS.map((col) => (
                      <th key={col.key} className="text-center px-4 py-4 whitespace-nowrap">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/40 divide-dashed">
                  {RBAC_ROLES.map((row, i) => (
                    <motion.tr
                      key={row.role}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="hover:bg-slate-900/20 text-slate-300 font-medium transition-colors"
                    >
                      <td className="px-5 py-4 font-bold text-white text-[11px] whitespace-nowrap">
                        {row.role}
                      </td>
                      {RBAC_COLS.map((col) => (
                        <td key={col.key} className="px-4 py-4 text-center">
                          <AccessCell value={row.access[col.key]} />
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legend container */}
          <div className="flex flex-wrap items-center gap-5 mt-1 bg-slate-950/40 p-4 rounded-xl border border-slate-900">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-extrabold text-sm leading-none">✓</span>
              <span className="text-[10px] text-slate-500 font-medium">Full permission control</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-405 text-[10px] font-extrabold uppercase tracking-wide">View</span>
              <span className="text-[10px] text-slate-500 font-medium">Read-Only directory visibility</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-700 font-extrabold leading-none">—</span>
              <span className="text-[10px] text-slate-500 font-medium font-sans">No route access allowed</span>
            </div>
          </div>
        </div>

      </div>

      {/* Info bottom compliance bar */}
      <div className="flex items-center gap-2 bg-slate-900/20 border border-slate-855/50 p-4 rounded-xl">
        <AlertCircle size={14} className="text-slate-550 flex-shrink-0" />
        <p className="text-[10px] text-slate-500 leading-normal font-sans font-medium">
          System Note: Scope rules can only be updated by the superadministrator account under corporate network security validations.
        </p>
      </div>

    </div>
  );
}
