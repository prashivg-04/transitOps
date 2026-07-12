import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, Shield, CheckCircle, Navigation, Clock, Users, BarChart3, 
  MapPin, Check, ChevronDown, ListFilter, AlertTriangle 
} from 'lucide-react';

// Detailed Mock Trips Data
const ALL_TRIPS = [
  { id: 'TR001', vehicle: 'VAN-05', type: 'Van', driver: 'Alex Patel', status: 'On Trip', eta: '45 min', region: 'North' },
  { id: 'TR002', vehicle: 'TRK-12', type: 'Truck', driver: 'John Doe', status: 'Completed', eta: '--', region: 'South' },
  { id: 'TR003', vehicle: 'MINI-08', type: 'Mini', driver: 'Priya Sharma', status: 'Dispatched', eta: '1h 10m', region: 'East' },
  { id: 'TR004', vehicle: '--', type: 'Truck', driver: '--', status: 'Draft', eta: 'Awaiting vehicle', region: 'West' },
  { id: 'TR005', vehicle: 'VAN-11', type: 'Van', driver: 'Liam Vance', status: 'On Trip', eta: '12 min', region: 'North' },
  { id: 'TR006', vehicle: 'TRK-09', type: 'Truck', driver: 'Sarah Connor', status: 'Completed', eta: '--', region: 'West' },
  { id: 'TR007', vehicle: 'MINI-02', type: 'Mini', driver: 'Ken Block', status: 'In Shop', eta: '--', region: 'South' },
  { id: 'TR008', vehicle: 'TRK-18', type: 'Truck', driver: 'Emma Watson', status: 'Dispatched', eta: '35 min', region: 'East' },
  { id: 'TR009', vehicle: 'VAN-03', type: 'Van', driver: 'Bob Ross', status: 'Draft', eta: 'Awaiting assignment', region: 'North' }
];

// Helper to determine status style classes
const getStatusClasses = (status) => {
  switch (status) {
    case 'On Trip':
      return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    case 'Completed':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'Dispatched':
      return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
    case 'In Shop':
      return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
    case 'Draft':
    default:
      return 'bg-slate-800 text-slate-400 border border-slate-700/50';
  }
};

export default function DashboardPage() {
  const { searchQuery } = useOutletContext();
  
  // Custom dropdown open states
  const [activeMenu, setActiveMenu] = useState(null); // 'type' | 'status' | 'region' | null
  
  // Filter States
  const [vehicleType, setVehicleType] = useState('All'); // 'All' | 'Truck' | 'Van' | 'Mini'
  const [statusVal, setStatusVal] = useState('All'); // 'All' | 'On Trip' | 'Completed' | 'Dispatched' | 'Draft' | 'In Shop'
  const [regionVal, setRegionVal] = useState('All'); // 'All' | 'North' | 'South' | 'East' | 'West'

  const filterOptions = {
    type: ['All', 'Truck', 'Van', 'Mini'],
    status: ['All', 'On Trip', 'Completed', 'Dispatched', 'Draft', 'In Shop'],
    region: ['All', 'North', 'South', 'East', 'West']
  };

  const handleFilterSelect = (menu, option) => {
    if (menu === 'type') setVehicleType(option);
    if (menu === 'status') setStatusVal(option);
    if (menu === 'region') setRegionVal(option);
    setActiveMenu(null);
  };

  // Filter dynamic helper
  const filteredTrips = ALL_TRIPS.filter(t => {
    const matchesSearch = searchQuery 
      ? t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.driver.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    const matchesType = vehicleType === 'All' ? true : t.type === vehicleType;
    const matchesStatus = statusVal === 'All' ? true : t.status === statusVal;
    const matchesRegion = regionVal === 'All' ? true : t.region === regionVal;
    
    return matchesSearch && matchesType && matchesStatus && matchesRegion;
  });

  // Calculate dynamic stats metrics based on filter selection to keep calculations authentic
  const baseStats = {
    all: { active: 53, available: 42, shop: 5, activeTrips: 18, pending: 9, drivers: 26, utilization: 81 },
    Truck: { active: 22, available: 15, shop: 2, activeTrips: 8, pending: 4, drivers: 12, utilization: 85 },
    Van: { active: 18, available: 16, shop: 2, activeTrips: 6, pending: 3, drivers: 9, utilization: 79 },
    Mini: { active: 13, available: 11, shop: 1, activeTrips: 4, pending: 2, drivers: 5, utilization: 76 }
  };

  // Extract relevant stats factors
  const stats = baseStats[vehicleType] || baseStats.all;

  // Let's configure status counts for the status chart dynamically as well
  const chartStats = {
    available: stats.available,
    onTrip: stats.active,
    inShop: stats.shop,
    retired: vehicleType === 'All' ? 3 : 1
  };
  const totalChartCount = chartStats.available + chartStats.onTrip + chartStats.inShop + chartStats.retired;
  const getPct = (val) => Math.round((val / totalChartCount) * 100);

  return (
    <div className="flex-1 flex flex-col gap-8 p-6 md:p-8 text-left bg-slate-950 min-h-screen">
      
      {/* FILTER PANEL ROW */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-40">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
          <ListFilter size={16} className="text-primary" />
          <span>Filters</span>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* VEHICLE TYPE SELECT */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'type' ? null : 'type')}
              className="bg-slate-900 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700/80 flex items-center gap-2 transition-colors min-w-[140px] justify-between shadow-inner"
            >
              <span>Type: <span className="text-primary font-extrabold">{vehicleType}</span></span>
              <ChevronDown size={14} className={`text-slate-500 transition-transform ${activeMenu === 'type' ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {activeMenu === 'type' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.1 }}
                  className="absolute left-0 top-[42px] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-premium-lg z-50 p-1.5 flex flex-col gap-0.5 min-w-[140px] backdrop-blur-md"
                >
                  {filterOptions.type.map((t) => (
                    <button
                      key={t}
                      onClick={() => handleFilterSelect('type', t)}
                      className={`text-left text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
                        vehicleType === t ? 'bg-primary text-white font-bold' : 'hover:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* STATUS SELECT */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'status' ? null : 'status')}
              className="bg-slate-900 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700/80 flex items-center gap-2 transition-colors min-w-[140px] justify-between shadow-inner"
            >
              <span>Status: <span className="text-primary font-extrabold">{statusVal}</span></span>
              <ChevronDown size={14} className={`text-slate-500 transition-transform ${activeMenu === 'status' ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {activeMenu === 'status' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.1 }}
                  className="absolute left-0 top-[42px] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-premium-lg z-50 p-1.5 flex flex-col gap-0.5 min-w-[140px] backdrop-blur-md"
                >
                  {filterOptions.status.map((st) => (
                    <button
                      key={st}
                      onClick={() => handleFilterSelect('status', st)}
                      className={`text-left text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
                        statusVal === st ? 'bg-primary text-white font-bold' : 'hover:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* REGION SELECT */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'region' ? null : 'region')}
              className="bg-slate-900 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700/80 flex items-center gap-2 transition-colors min-w-[140px] justify-between shadow-inner"
            >
              <span>Region: <span className="text-primary font-extrabold">{regionVal}</span></span>
              <ChevronDown size={14} className={`text-slate-500 transition-transform ${activeMenu === 'region' ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {activeMenu === 'region' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.1 }}
                  className="absolute left-0 top-[42px] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-premium-lg z-50 p-1.5 flex flex-col gap-0.5 min-w-[140px] backdrop-blur-md"
                >
                  {filterOptions.region.map((r) => (
                    <button
                      key={r}
                      onClick={() => handleFilterSelect('region', r)}
                      className={`text-left text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
                        regionVal === r ? 'bg-primary text-white font-bold' : 'hover:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* KPI METRICS CARDS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 z-10 w-full select-none">
        
        {/* Active Vehicles */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-slate-900/40 p-4 border border-slate-850 hover:border-slate-800 rounded-xl shadow-premium relative flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 to-indigo-500" />
          <span className="text-[9px] uppercase font-extrabold font-sans text-slate-500 tracking-wider mb-2">Active Vehicles</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{stats.active}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse mt-1" />
          </div>
        </motion.div>

        {/* Available Vehicles */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-slate-900/40 p-4 border border-slate-850 hover:border-slate-800 rounded-xl shadow-premium relative flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-500 to-teal-500" />
          <span className="text-[9px] uppercase font-extrabold font-sans text-slate-500 tracking-wider mb-2">Available Vehicles</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{stats.available}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mt-1" />
          </div>
        </motion.div>

        {/* Vehicles in Maintenance */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-slate-900/40 p-4 border border-slate-850 hover:border-slate-800 rounded-xl shadow-premium relative flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-orange-500 to-amber-500" />
          <span className="text-[9px] uppercase font-extrabold font-sans text-slate-500 tracking-wider mb-2">in Maintenance</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{stats.shop.toString().padStart(2, '0')}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse mt-1" />
          </div>
        </motion.div>

        {/* Active Trips */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-slate-900/40 p-4 border border-slate-850 hover:border-slate-800 rounded-xl shadow-premium relative flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-sky-500 to-sky-400" />
          <span className="text-[9px] uppercase font-extrabold font-sans text-slate-500 tracking-wider mb-2">Active Trips</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{stats.activeTrips}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse mt-1" />
          </div>
        </motion.div>

        {/* Pending Trips */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-slate-900/40 p-4 border border-slate-850 hover:border-slate-800 rounded-xl shadow-premium relative flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-slate-600 to-slate-500" />
          <span className="text-[9px] uppercase font-extrabold font-sans text-slate-500 tracking-wider mb-2">Pending Trips</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{stats.pending.toString().padStart(2, '0')}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse mt-1" />
          </div>
        </motion.div>

        {/* Drivers on Duty */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-slate-900/40 p-4 border border-slate-850 hover:border-slate-800 rounded-xl shadow-premium relative flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-violet-500 to-indigo-500" />
          <span className="text-[9px] uppercase font-extrabold font-sans text-slate-500 tracking-wider mb-2">Drivers on Duty</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{stats.drivers}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse mt-1" />
          </div>
        </motion.div>

        {/* Fleet Utilization */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-slate-900/40 p-4 border border-slate-850 hover:border-slate-850 rounded-xl shadow-premium relative flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-500 to-blue-500" />
          <span className="text-[9px] uppercase font-extrabold font-sans text-slate-500 tracking-wider mb-2">Fleet Utilization</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{stats.utilization}%</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mt-1" />
          </div>
        </motion.div>

      </div>

      {/* DUAL WIDGET SECTION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 z-10">
        
        {/* LEFT COLUMN: LIST TABLE (8/12 layout) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex justify-between items-center select-none">
            <h3 className="text-sm font-extrabold text-slate-200 tracking-wide uppercase">Recent Trips</h3>
            <span className="text-[10px] text-slate-500 font-mono uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {filteredTrips.length} matching operations
            </span>
          </div>

          <div className="w-full bg-slate-900/20 border border-slate-850 rounded-2xl overflow-hidden shadow-premium">
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-sans text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-850/80 bg-slate-900/50 text-slate-500 uppercase tracking-widest text-[9px] font-extrabold font-mono">
                    <th className="px-5 py-4">Trip</th>
                    <th className="px-5 py-4">Vehicle</th>
                    <th className="px-5 py-4">Driver</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">ETA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/40 divide-dashed">
                  <AnimatePresence mode="popLayout">
                    {filteredTrips.length > 0 ? (
                      filteredTrips.map((t) => (
                        <motion.tr
                          layout
                          key={t.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-slate-900/20 transition-all text-slate-300 font-medium"
                        >
                          <td className="px-5 py-4 font-bold text-white font-mono">{t.id}</td>
                          <td className="px-5 py-4">{t.vehicle}</td>
                          <td className="px-5 py-4 font-sans">{t.driver}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide ${getStatusClasses(t.status)}`}>
                              {t.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-slate-400 font-mono">{t.eta}</td>
                        </motion.tr>
                      ))
                    ) : (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan={5} className="px-5 py-12 text-center text-slate-500 text-xs">
                          <AlertTriangle size={24} className="mx-auto mb-2 text-slate-650" />
                          <span>No matches found. Check your search key or dropdown values.</span>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: VEHICLE STATUS PILL CHART (4/12 layout) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <h3 className="text-sm font-extrabold text-slate-200 tracking-wide uppercase select-none">Vehicle Status</h3>
          
          <div className="w-full bg-slate-900/20 border border-slate-850 p-6 rounded-2xl shadow-premium flex flex-col gap-5 backdrop-blur-sm">
            
            {/* Status list and animated progress pills */}
            <div className="flex flex-col gap-4">
              
              {/* Available Stats */}
              <div className="flex flex-col gap-1.5 select-none">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold block">Available</span>
                  <span className="font-bold text-white font-mono">{chartStats.available} <span className="text-[10px] text-slate-500 font-normal">({getPct(chartStats.available)}%)</span></span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-900">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getPct(chartStats.available)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg shadow-emerald-500/10"
                  />
                </div>
              </div>

              {/* On Trip Stats */}
              <div className="flex flex-col gap-1.5 select-none">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold block">On Trip</span>
                  <span className="font-bold text-white font-mono">{chartStats.onTrip} <span className="text-[10px] text-slate-500 font-normal">({getPct(chartStats.onTrip)}%)</span></span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-900">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getPct(chartStats.onTrip)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-lg shadow-blue-500/10"
                  />
                </div>
              </div>

              {/* In Shop Stats */}
              <div className="flex flex-col gap-1.5 select-none">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold block">In Shop (Maintenance)</span>
                  <span className="font-bold text-white font-mono">{chartStats.inShop} <span className="text-[10px] text-slate-500 font-normal">({getPct(chartStats.inShop)}%)</span></span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-900">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getPct(chartStats.inShop)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-lg shadow-orange-500/10"
                  />
                </div>
              </div>

              {/* Retired Stats */}
              <div className="flex flex-col gap-1.5 select-none">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold block">Retired</span>
                  <span className="font-bold text-white font-mono">{chartStats.retired} <span className="text-[10px] text-slate-500 font-normal">({getPct(chartStats.retired)}%)</span></span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-900">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getPct(chartStats.retired)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-lg shadow-rose-500/10"
                  />
                </div>
              </div>

            </div>

            {/* Bottom summary counter details info */}
            <div className="border-t border-slate-850 pt-4 mt-2 flex justify-between items-center select-none">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Registered Assets</span>
              <span className="text-sm font-black text-white font-mono">{totalChartCount}</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
