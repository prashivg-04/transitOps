import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, ChevronRight, Zap } from 'lucide-react';

// ─── Shared data ──────────────────────────────────────────────────────────────
// Available vehicles only (excluding On Trip / In Shop / Retired)
const AVAILABLE_VEHICLES = [
  { id: 1, name: 'VAN-05',    capacityKg: 500,  label: 'VAN-05 – 500 kg capacity'  },
  { id: 5, name: 'TRUCK-04',  capacityKg: 5000, label: 'TRUCK-04 – 5 Ton capacity' },
  { id: 6, name: 'MINI-07',   capacityKg: 1000, label: 'MINI-07 – 1 Ton capacity'  },
];

const AVAILABLE_DRIVERS = ['Alex', 'Suresh', 'Priya', 'Ramesh'];

// ─── Seed trips matching the template live board ──────────────────────────────
const SEED_TRIPS = [
  {
    id: 'TR009',
    source: 'Gandhinagar Depot',
    destination: 'Ahmedabad Hub',
    vehicle: 'VAN-05',
    driver: 'ALEX',
    status: 'Dispatched',
    eta: '45 min',
    note: '',
  },
  {
    id: 'TR004',
    source: 'Vatva Industrial Area',
    destination: 'Sanand Warehouse',
    vehicle: 'TRUCK-04',
    driver: 'SURESH',
    status: 'Draft',
    eta: '',
    note: 'Awaiting driver',
  },
  {
    id: 'TR006',
    source: 'Mansa',
    destination: 'Kalol Depot',
    vehicle: '',
    driver: '',
    status: 'Cancelled',
    eta: '',
    note: 'Vehicle went to shop',
  },
];

// ─── Lifecycle steps ──────────────────────────────────────────────────────────
const LIFECYCLE_STEPS = ['Draft', 'Dispatched', 'Completed', 'Cancelled'];

const STEP_COLORS = {
  Draft:      'text-slate-400  border-slate-600',
  Dispatched: 'text-sky-400    border-sky-500',
  Completed:  'text-emerald-400 border-emerald-500',
  Cancelled:  'text-rose-400   border-rose-500',
};

const STEP_BG = {
  Draft:      'bg-slate-700',
  Dispatched: 'bg-sky-500',
  Completed:  'bg-emerald-500',
  Cancelled:  'bg-rose-400',
};

// ─── Status badge ─────────────────────────────────────────────────────────────
const BADGE_STYLES = {
  Dispatched: 'bg-sky-500    text-white',
  Draft:      'bg-slate-600  text-slate-200',
  Completed:  'bg-emerald-600 text-white',
  Cancelled:  'bg-rose-400   text-white',
};

// ─── ID generator ─────────────────────────────────────────────────────────────
let tripCounter = 10;
const nextId = () => `TR0${tripCounter++}`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const parseCap = (kg) => kg; // already numeric in AVAILABLE_VEHICLES

// ─── Lifecycle Stepper ───────────────────────────────────────────────────────
function LifecycleStepper({ currentStep }) {
  const activeIdx = LIFECYCLE_STEPS.indexOf(currentStep);
  return (
    <div className="flex items-center gap-0 w-full">
      {LIFECYCLE_STEPS.map((step, i) => {
        const isActive  = i === activeIdx;
        const isPast    = i < activeIdx;
        const isLast    = i === LIFECYCLE_STEPS.length - 1;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div
                className={`w-3 h-3 rounded-full border-2 transition-all ${
                  isActive
                    ? `${STEP_BG[step]} border-transparent shadow-lg`
                    : isPast
                    ? 'bg-slate-500 border-transparent'
                    : 'bg-transparent border-slate-600'
                }`}
              />
              <span
                className={`text-[9px] font-bold uppercase tracking-wide transition-colors ${
                  isActive ? STEP_COLORS[step].split(' ')[0] : 'text-slate-600'
                }`}
              >
                {step}
              </span>
            </div>
            {!isLast && (
              <div className={`flex-1 h-px mb-3 mx-1 transition-colors ${isPast ? 'bg-slate-500' : 'bg-slate-700'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Live Board Card ──────────────────────────────────────────────────────────
function TripCard({ trip, onSelect, isSelected }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      onClick={() => onSelect(trip)}
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'border-sky-500/40 bg-sky-500/5'
          : 'border-[#1e1e1e] bg-[#0d0d0d] hover:border-[#2a2a2a] hover:bg-[#111]'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: trip info */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase font-mono">
            {trip.id}
          </span>
          <p className="text-sm font-bold text-white leading-snug">
            {trip.source}
            <span className="text-slate-500 mx-1.5 font-normal">→</span>
            {trip.destination}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded ${BADGE_STYLES[trip.status] ?? 'bg-slate-700 text-white'}`}>
              {trip.status}
            </span>
          </div>
        </div>

        {/* Right: vehicle / driver / eta */}
        <div className="text-right flex flex-col gap-1 flex-shrink-0">
          {(trip.vehicle || trip.driver) ? (
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              {[trip.vehicle, trip.driver].filter(Boolean).join(' / ')}
            </span>
          ) : (
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wide">Unassigned</span>
          )}
          {trip.eta && (
            <span className="text-[10px] text-slate-500">{trip.eta}</span>
          )}
          {trip.note && (
            <span className="text-[10px] text-slate-600 italic">{trip.note}</span>
          )}
        </div>
      </div>
    </motion.div>
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

// ─── Trips Page ───────────────────────────────────────────────────────────────
export default function TripsPage() {
  const [trips, setTrips] = useState(SEED_TRIPS);
  const [selectedTrip, setSelectedTrip] = useState(null);

  // Form state
  const [source, setSource]           = useState('');
  const [destination, setDestination] = useState('');
  const [vehicleId, setVehicleId]     = useState('');
  const [driver, setDriver]           = useState('');
  const [cargoKg, setCargoKg]         = useState('');
  const [distKm, setDistKm]           = useState('');

  // ── Derived capacity validation ───────────────────────────────────────────
  const selectedVehicle = AVAILABLE_VEHICLES.find((v) => String(v.id) === vehicleId);
  const cargo           = parseFloat(cargoKg) || 0;
  const capKg           = selectedVehicle?.capacityKg ?? 0;
  const overload        = cargo > 0 && capKg > 0 && cargo > capKg;
  const overBy          = overload ? cargo - capKg : 0;

  // ── Current lifecycle step for the stepper ────────────────────────────────
  const [lifecycleStep, setLifecycleStep] = useState('Draft');

  // ── Dispatch handler ──────────────────────────────────────────────────────
  const canDispatch =
    source.trim() &&
    destination.trim() &&
    vehicleId &&
    driver &&
    cargoKg &&
    distKm &&
    !overload;

  const handleDispatch = () => {
    if (!canDispatch) return;
    const newTrip = {
      id: nextId(),
      source: source.trim(),
      destination: destination.trim(),
      vehicle: selectedVehicle?.name ?? '',
      driver: driver.toUpperCase(),
      status: 'Dispatched',
      eta: `${distKm} km`,
      note: '',
    };
    setTrips((prev) => [newTrip, ...prev]);
    setLifecycleStep('Dispatched');
    // Reset form
    setSource(''); setDestination(''); setVehicleId('');
    setDriver(''); setCargoKg(''); setDistKm('');
    setTimeout(() => setLifecycleStep('Draft'), 1500);
  };

  const handleCancel = () => {
    setSource(''); setDestination(''); setVehicleId('');
    setDriver(''); setCargoKg(''); setDistKm('');
    setLifecycleStep('Draft');
  };

  return (
    <div className="flex-1 flex gap-0 min-h-0 h-full">

      {/* ══════════════ LEFT: TRIP CREATOR ══════════════ */}
      <div className="w-[420px] flex-shrink-0 border-r border-[#1a1a1a] p-6 flex flex-col gap-5 overflow-y-auto">

        {/* Lifecycle stepper */}
        <div className="flex flex-col gap-3">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            Trip Lifecycle
          </span>
          <LifecycleStepper currentStep={lifecycleStep} />
        </div>

        <div className="h-px bg-[#1a1a1a]" />

        {/* Create Trip form */}
        <div className="flex flex-col gap-4">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            Create Trip
          </span>

          <Field label="Source">
            <input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Gandhinagar Depot"
              className={inputCls}
            />
          </Field>

          <Field label="Destination">
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Ahmedabad Hub"
              className={inputCls}
            />
          </Field>

          <Field label="Vehicle (Available Only)">
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className={`${inputCls} cursor-pointer`}
            >
              <option value="">Select vehicle…</option>
              {AVAILABLE_VEHICLES.map((v) => (
                <option key={v.id} value={v.id}>{v.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Driver (Available Only)">
            <select
              value={driver}
              onChange={(e) => setDriver(e.target.value)}
              className={`${inputCls} cursor-pointer`}
            >
              <option value="">Select driver…</option>
              {AVAILABLE_DRIVERS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </Field>

          <Field label="Cargo Weight (kg)">
            <input
              type="number" min={0}
              value={cargoKg}
              onChange={(e) => setCargoKg(e.target.value)}
              placeholder="700"
              className={inputCls}
            />
          </Field>

          <Field label="Planned Distance (km)">
            <input
              type="number" min={0}
              value={distKm}
              onChange={(e) => setDistKm(e.target.value)}
              placeholder="35"
              className={inputCls}
            />
          </Field>

          {/* ── Capacity validation block ── */}
          <AnimatePresence>
            {overload && selectedVehicle && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="border border-rose-500/40 bg-rose-500/5 rounded px-4 py-3 flex flex-col gap-1"
              >
                <span className="text-[11px] text-rose-300/80">
                  Vehicle Capacity: {capKg >= 1000 ? `${capKg / 1000} Ton` : `${capKg} kg`}
                </span>
                <span className="text-[11px] text-rose-300/80">
                  Cargo Weight: {cargo} kg
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <X size={11} className="text-rose-400 flex-shrink-0" />
                  <span className="text-[11px] text-rose-400 font-bold">
                    Capacity exceeded by {overBy} kg — dispatch blocked
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Action buttons ── */}
          <div className="flex items-center gap-2 pt-1">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleDispatch}
              disabled={!canDispatch}
              className={`flex-1 flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded transition-all ${
                canDispatch
                  ? 'bg-sky-500 hover:bg-sky-400 text-white shadow-md shadow-sky-500/20 cursor-pointer'
                  : 'bg-[#1a1a1a] text-slate-600 cursor-not-allowed border border-[#2a2a2a]'
              }`}
            >
              {canDispatch ? <Zap size={13} /> : null}
              {canDispatch ? 'Dispatch' : 'Dispatch (disabled)'}
            </motion.button>
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-white border border-[#2a2a2a] hover:border-[#3a3a3a] rounded transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════ RIGHT: LIVE BOARD ══════════════ */}
      <div className="flex-1 flex flex-col min-h-0 p-6 gap-5 overflow-y-auto">

        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            Live Board
          </span>
          <span className="text-[10px] text-slate-600 font-mono">
            {trips.length} trip{trips.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Trip cards */}
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                isSelected={selectedTrip?.id === trip.id}
                onSelect={(t) => setSelectedTrip((prev) => prev?.id === t.id ? null : t)}
              />
            ))}
          </AnimatePresence>

          {trips.length === 0 && (
            <div className="text-center text-slate-700 text-xs py-12">
              No trips yet. Dispatch your first trip →
            </div>
          )}
        </div>

        {/* Footer info note */}
        <p className="text-[11px] text-slate-600 mt-auto pt-2">
          On Complete: odometer → Fuel log → expenses → Vehicle &amp; Driver Available
        </p>
      </div>

    </div>
  );
}
