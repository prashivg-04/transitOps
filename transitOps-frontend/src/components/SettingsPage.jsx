import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Save } from 'lucide-react';

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
      <span className="text-emerald-400 font-bold text-sm">✓</span>
    );
  }
  if (value === 'view') {
    return (
      <span className="text-sky-400 text-[11px] font-bold uppercase tracking-wide">View</span>
    );
  }
  return (
    <span className="text-slate-700 text-sm font-bold">—</span>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full bg-transparent border border-[#2a2a2a] text-white text-xs rounded px-3 py-2.5 outline-none focus:border-slate-500 transition-colors placeholder-slate-700 font-mono';

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
    <div className="flex-1 p-6 flex gap-8 min-h-0 overflow-y-auto">

      {/* ══════════════ LEFT: GENERAL SETTINGS ══════════════ */}
      <div className="w-[300px] flex-shrink-0 flex flex-col gap-5">

        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
          General
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

          <Field label="Currency">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`${inputCls} cursor-pointer`}
            >
              <option value="INR (Rs)">INR (Rs)</option>
              <option value="USD ($)">USD ($)</option>
              <option value="EUR (€)">EUR (€)</option>
              <option value="GBP (£)">GBP (£)</option>
            </select>
          </Field>

          <Field label="Distance Unit">
            <select
              value={distUnit}
              onChange={(e) => setDistUnit(e.target.value)}
              className={`${inputCls} cursor-pointer`}
            >
              <option value="Kilometers">Kilometers</option>
              <option value="Miles">Miles</option>
            </select>
          </Field>

          {/* Save button */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold py-2.5 px-5 rounded transition-colors shadow-md shadow-sky-500/20 mt-1"
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
                  Saved!
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

      {/* Vertical divider */}
      <div className="w-px bg-[#1a1a1a] self-stretch flex-shrink-0" />

      {/* ══════════════ RIGHT: RBAC TABLE ══════════════ */}
      <div className="flex-1 flex flex-col gap-5 min-w-0">

        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
          Role-Based Access (RBAC)
        </span>

        <div className="rounded-lg border border-[#1e1e1e] bg-[#0d0d0d] overflow-hidden">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1e1e1e]">
                <th className="text-left text-[9px] font-bold text-slate-500 uppercase tracking-widest px-5 py-3 w-40">
                  Role
                </th>
                {RBAC_COLS.map((col) => (
                  <th key={col.key} className="text-center text-[9px] font-bold text-slate-500 uppercase tracking-widest px-4 py-3">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RBAC_ROLES.map((row, i) => (
                <motion.tr
                  key={row.role}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="border-b border-[#161616] hover:bg-[#141414] transition-colors"
                >
                  <td className="px-5 py-3.5 font-bold text-slate-200 text-[11px] whitespace-nowrap">
                    {row.role}
                  </td>
                  {RBAC_COLS.map((col) => (
                    <td key={col.key} className="px-4 py-3.5 text-center">
                      <AccessCell value={row.access[col.key]} />
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 mt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold text-sm leading-none">✓</span>
            <span className="text-[10px] text-slate-600">Full access</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sky-400 text-[10px] font-bold">View</span>
            <span className="text-[10px] text-slate-600">Read only</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-700 font-bold leading-none">—</span>
            <span className="text-[10px] text-slate-600">No access</span>
          </div>
        </div>
      </div>

    </div>
  );
}
