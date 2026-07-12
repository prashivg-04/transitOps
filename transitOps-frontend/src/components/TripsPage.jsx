import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, ChevronRight, Zap, RefreshCw } from 'lucide-react';

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
  Cancelled:  'text-rose-450   border-rose-500',
};

const STEP_BG = {
  Draft:      'bg-slate-700',
  Dispatched: 'bg-sky-500',
  Completed:  'bg-emerald-500',
  Cancelled:  'bg-rose-400',
};

// ─── Status badge ─────────────────────────────────────────────────────────────
const BADGE_STYLES = {
  Dispatched: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  Draft:      'bg-slate-800/40 text-slate-400 border border-slate-700/50',
  Completed:  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  Cancelled:  'bg-rose-500/10 text-rose-400 border border-rose-500/20',
};

// ─── ID generator ─────────────────────────────────────────────────────────────
let tripCounter = 10;
const nextId = () => `TR0${tripCounter++}`;

// ─── Lifecycle Stepper ───────────────────────────────────────────────────────
function LifecycleStepper({ currentStep }) {
  const activeIdx = LIFECYCLE_STEPS.indexOf(currentStep);
  return (
    <div className="flex items-center gap-0 w-full bg-slate-950/40 p-4 rounded-xl border border-slate-900">
      {LIFECYCLE_STEPS.map((step, i) => {
        const isActive  = i === activeIdx;
        const isPast    = i < activeIdx;
        const isLast    = i === LIFECYCLE_STEPS.length - 1;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div
                className={`w-3.5 h-3.5 rounded-full border-2 transition-all flex items-center justify-center ${
                  isActive
                    ? `${STEP_BG[step]} border-transparent ring-4 ring-sky-500/15 shadow-lg`
                    : isPast
                    ? 'bg-slate-500 border-transparent'
                    : 'bg-transparent border-slate-800'
                }`}
              />
              <span
                className={`text-[9px] font-black uppercase tracking-wider transition-colors mt-0.5 ${
                  isActive ? STEP_COLORS[step].split(' ')[0] : 'text-slate-655'
                }`}
              >
                {step}
              </span>
            </div>
            {!isLast && (
              <div className={`flex-1 h-0.5 mb-4 mx-1.5 transition-colors ${isPast ? 'bg-slate-500' : 'bg-slate-850/80'}`} />
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
      className={`p-4 border rounded-2xl cursor-pointer transition-all ${
        isSelected
          ? 'border-primary/40 bg-primary/[0.04] shadow-premium'
          : 'border-slate-850/80 bg-slate-900/15 hover:border-slate-800 hover:bg-slate-900/30'
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
            <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-lg ${BADGE_STYLES[trip.status] ?? 'bg-slate-700/40 text-slate-300 border border-slate-600'}`}>
              {trip.status}
            </span>
          </div>
        </div>

        {/* Right: vehicle / driver / eta */}
        <div className="text-right flex flex-col gap-1 flex-shrink-0">
          {(trip.vehicle || trip.driver) ? (
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">
              {[trip.vehicle, trip.driver].filter(Boolean).join(' / ')}
            </span>
          ) : (
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Unassigned</span>
          )}
          {trip.eta && (
            <span className="text-[10px] text-slate-400 font-mono mt-0.5">{trip.eta}</span>
          )}
          {trip.note && (
            <span className="text-[10px] text-slate-500 italic mt-0.5">{trip.note}</span>
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
      <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-primary transition-colors';

const selectCls =
  'w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none cursor-pointer focus:border-primary transition-colors focus:bg-slate-950';

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
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 min-h-screen text-left bg-slate-950 font-sans relative">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <Zap size={20} className="text-primary-light" />
          Dispatch & Smart Trips
        </h1>
        <p className="text-xs text-slate-500 max-w-xl mt-1">
          Coordinate live dispatches, track active transits, assign drivers, and validate cargo loads.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ══════════════ LEFT: TRIP CREATOR ══════════════ */}
        <div className="lg:col-span-5 bg-slate-900/35 border border-slate-850 p-6 rounded-2xl shadow-premium backdrop-blur-sm flex flex-col gap-5">
          {/* Lifecycle stepper */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
              Trip Lifecycle status
            </span>
            <LifecycleStepper currentStep={lifecycleStep} />
          </div>

          <div className="h-px bg-slate-850" />

          {/* Create Trip form */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] text-slate-450 font-extrabold uppercase tracking-wide">
              Create Smart Trip
            </span>

            <Field label="Source Place">
              <input
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Gandhinagar Depot"
                className={inputCls}
              />
            </Field>

            <Field label="Destination Place">
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
                className={selectCls}
              >
                <option value="" className="bg-slate-950">Select vehicle…</option>
                {AVAILABLE_VEHICLES.map((v) => (
                  <option key={v.id} value={v.id} className="bg-slate-950">{v.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Driver (Available Only)">
              <select
                value={driver}
                onChange={(e) => setDriver(e.target.value)}
                className={selectCls}
              >
                <option value="" className="bg-slate-950">Select driver…</option>
                {AVAILABLE_DRIVERS.map((d) => (
                  <option key={d} value={d} className="bg-slate-950">{d}</option>
                ))}
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            {/* ── Capacity validation block ── */}
            <AnimatePresence>
              {overload && selectedVehicle && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="border border-rose-500/20 bg-rose-500/10 rounded-xl px-4 py-3 flex flex-col gap-1 text-left"
                >
                  <span className="text-[11px] text-rose-300/80 font-medium">
                    Vehicle Capacity: {capKg >= 1000 ? `${capKg / 1000} Ton` : `${capKg} kg`}
                  </span>
                  <span className="text-[11px] text-rose-300/80 font-medium">
                    Cargo Weight: {cargo} kg
                  </span>
                  <div className="flex items-center gap-1.5 mt-1 border-t border-rose-500/10 pt-1">
                    <X size={11} className="text-rose-450 flex-shrink-0" />
                    <span className="text-[11px] text-rose-450 font-bold leading-none">
                      Capacity exceeded by {overBy} kg — dispatch locked
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Action buttons ── */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-850 mt-1">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleDispatch}
                disabled={!canDispatch}
                className={`flex-1 flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer ${
                  canDispatch
                    ? 'bg-primary hover:bg-primary-light text-white shadow-md shadow-primary/10'
                    : 'bg-slate-900/50 text-slate-650 cursor-not-allowed border border-slate-855'
                }`}
              >
                {canDispatch ? <Zap size={13} className="fill-white text-white" /> : null}
                {canDispatch ? 'Dispatch Trip' : 'Dispatch'}
              </motion.button>
              <button
                onClick={handleCancel}
                className="px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-850 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* ══════════════ RIGHT: LIVE BOARD ══════════════ */}
        <div className="lg:col-span-7 bg-slate-900/35 border border-slate-850 p-6 rounded-2xl shadow-premium backdrop-blur-sm flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
              Live Board Registry
            </span>
            <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider select-none bg-slate-950/50 border border-slate-900 px-2 py-0.5 rounded-md">
              {trips.length} active {trips.length !== 1 ? 'trips' : 'trip'}
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
              <div className="text-center text-slate-500 text-xs py-16 bg-slate-950/20 border border-dashed border-slate-850 rounded-2xl">
                No active smart trips recorded. Dispatch your first trip.
              </div>
            )}
          </div>

          {/* Footer info note */}
          <div className="flex items-center gap-2 bg-slate-900/20 border border-slate-850/50 p-4 rounded-xl mt-auto">
            <AlertCircle size={14} className="text-slate-550 flex-shrink-0" />
            <p className="text-[11px] text-slate-500 leading-normal font-sans">
              Rule Info: On dispatch completion, odometer reports automatically route to Fuel Logs and Expenses before returning the Vehicle & Driver to available states.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
