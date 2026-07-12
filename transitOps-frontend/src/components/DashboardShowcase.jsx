import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Compass, Fuel, ShieldCheck, MapPin, Search, ChevronRight, Play, CheckCircle } from 'lucide-react';

export default function DashboardShowcase() {
  const [activeTab, setActiveTab] = useState('dispatch');

  const tabs = [
    { id: 'dispatch', label: 'Dispatch & Ops', icon: <Compass size={16} /> },
    { id: 'fuel', label: 'Fuel & Finance', icon: <Fuel size={16} /> },
    { id: 'rbac', label: 'Roles & Security', icon: <ShieldCheck size={16} /> },
  ];

  return (
    <section className="bg-slate-50 py-24 border-y border-slate-100 relative overflow-hidden" id="dashboard">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 gap-4">
          <div className="px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-semibold tracking-wide w-fit">
            System Live Preview
          </div>
          <h2 className="text-secondary text-3xl md:text-4xl font-extrabold tracking-tight">
            See the command center in action
          </h2>
          <p className="text-slate-500 text-lg">
            Interact with our live preview dashboard. Gain real-time views into route dispatches, fuel expenses, and role permissions.
          </p>

          {/* Custom Tabs */}
          <div className="flex bg-slate-200/50 p-1.5 rounded-xl gap-1 mt-6 border border-slate-200/60 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-slate-600 hover:text-secondary'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Outer Dashboard Mockup Shell */}
        <div className="bg-secondary p-2 rounded-2xl shadow-premium-lg border border-slate-800 relative z-20 max-w-5xl mx-auto">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-700" />
              <span className="w-3 h-3 rounded-full bg-slate-700" />
              <span className="w-3 h-3 rounded-full bg-slate-700" />
              <span className="text-[11px] text-slate-500 font-mono ml-4 select-none">app.transitops.io/fleet-preview</span>
            </div>
            <div className="h-5 w-24 rounded bg-slate-800/80" />
          </div>

          <div className="bg-slate-950 p-4 md:p-6 min-h-[500px] text-left text-slate-300 font-sans relative overflow-hidden">
            {/* Interactive Showcase Body */}
            <AnimatePresence mode="wait">
              {activeTab === 'dispatch' && (
                <motion.div
                  key="dispatch-ops"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                >
                  {/* Left Column: KPI cards & Live Table */}
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Active Trips', value: '142', change: '+12%', status: 'up' },
                        { label: 'On Time Rate', value: '98.4%', change: 'optimal', status: 'optimal' },
                        { label: 'Drivers Live', value: '89', change: '84% duty', status: 'neutral' },
                        { label: 'Route Alerts', value: '2', change: '-4', status: 'down' }
                      ].map((card, i) => (
                        <div key={i} className="bg-slate-900 border border-slate-800/60 p-4 rounded-xl flex flex-col justify-between">
                          <span className="text-[11px] text-slate-500 font-semibold">{card.label}</span>
                          <div className="flex justify-between items-baseline mt-2">
                            <span className="text-xl font-bold text-white tracking-tight">{card.value}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              card.status === 'up' || card.status === 'optimal'
                                ? 'bg-emerald-500/10 text-accent'
                                : card.status === 'down'
                                ? 'bg-red-500/10 text-red-400'
                                : 'bg-slate-800 text-slate-400'
                            }`}>{card.change}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Live fleet table */}
                    <div className="bg-slate-900 border border-slate-800/60 rounded-xl overflow-hidden">
                      <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Dispatches</h4>
                        <div className="relative">
                          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            type="text"
                            placeholder="Filter vehicle ID..."
                            readOnly
                            className="bg-slate-950 border border-slate-800 rounded-md py-1 pl-7 pr-3 text-[10px] text-slate-400 outline-none w-36 select-none cursor-default"
                          />
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-[11px] text-left text-slate-400">
                          <thead className="bg-slate-950 text-slate-500 font-bold border-b border-slate-800/50">
                            <tr>
                              <th className="py-2.5 px-4">VEHICLE ID</th>
                              <th className="py-2.5 px-4">DRIVER</th>
                              <th className="py-2.5 px-4">ROUTE</th>
                              <th className="py-2.5 px-4">ETA STATUS</th>
                              <th className="py-2.5 px-4 text-right">LOAD CODE</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { id: 'TRK-208', name: 'Marcus Vance', route: 'Chicago Logistics Hub', status: 'On Schedule', badge: 'bg-emerald-500/10 text-accent', code: 'LD-928A' },
                              { id: 'VAN-114', name: 'Sara Jenkins', route: 'Manhattan Distribution', status: 'Delayed (+12m)', badge: 'bg-yellow-500/10 text-yellow-400', code: 'LD-302B' },
                              { id: 'TRK-405', name: 'Alex Rivera', route: 'Houston Sea Port Terminal', status: 'On Schedule', badge: 'bg-emerald-500/10 text-accent', code: 'LD-441K' }
                            ].map((row, i) => (
                              <tr key={i} className="border-b border-slate-800/40 hover:bg-slate-900/50 transition-colors">
                                <td className="py-3 px-4 font-bold text-white">{row.id}</td>
                                <td className="py-3 px-4">{row.name}</td>
                                <td className="py-3 px-4">{row.route}</td>
                                <td className="py-3 px-4">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${row.badge}`}>{row.status}</span>
                                </td>
                                <td className="py-3 px-4 text-right font-mono text-slate-500">{row.code}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live Map Mock & Dispatch History */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* SVG Map mockup */}
                    <div className="bg-slate-900 border border-slate-800/60 p-4 rounded-xl flex-grow flex flex-col">
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-3">Live Map Coordinates</span>
                      <div className="bg-slate-950 rounded-lg relative overflow-hidden flex-grow border border-slate-800/80 min-h-[160px] flex items-center justify-center">
                        {/* Map Grid Gridlines */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_14px]" />
                        
                        {/* Draw connection routes */}
                        <svg className="w-full h-full max-h-[160px] absolute z-0" viewBox="0 0 200 120">
                          {/* Route 1 */}
                          <path d="M40 70 Q 70 30 110 50 T 170 30" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="3,3" />
                          <circle cx="40" cy="70" r="3" fill="#2563EB" />
                          <circle cx="170" cy="30" r="3" fill="#22C55E" />
                          
                          {/* Route 2 */}
                          <path d="M20 30 Q 70 80 120 70 T 160 90" fill="none" stroke="#64748B" strokeWidth="1" />
                          <circle cx="20" cy="30" r="2" fill="#64748B" />
                          <circle cx="160" cy="90" r="2.5" fill="#EAB308" />

                          {/* Pulsing indicator */}
                          <circle cx="110" cy="50" r="3.5" fill="#22C55E" className="animate-ping" style={{ transformOrigin: '110px 50px' }} />
                          <circle cx="110" cy="50" r="2.5" fill="#22C55E" />
                        </svg>

                        <div className="absolute bottom-2.5 left-2.5 bg-slate-900/90 border border-slate-800 px-2 py-1 rounded text-[8px] text-slate-400 flex items-center gap-1.5 backdrop-blur-sm select-none">
                          <MapPin size={8} className="text-secondary" /> Boston Hub → Newark Dispatch
                        </div>
                      </div>
                    </div>

                    {/* Timeline logs */}
                    <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex flex-col justify-start">
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-4">Operations Timeline</span>
                      <div className="flex flex-col gap-4 text-[10px]">
                        {[
                          { time: '14:24', event: 'Truck TRK-405 departed Houston Port Gateway', active: true },
                          { time: '14:15', event: 'Driver Sara Jenkins submitted fuel log card', active: false },
                          { time: '13:58', event: 'Routine service completed for Trailer T-20', active: false }
                        ].map((evt, i) => (
                          <div key={i} className="flex gap-3">
                            <span className="font-mono text-slate-500 font-semibold">{evt.time}</span>
                            <div className="flex flex-col items-center">
                              <span className={`w-2 h-2 rounded-full border ${evt.active ? 'bg-primary border-primary animate-pulse' : 'bg-slate-800 border-slate-700'}`} />
                              {i < 2 && <span className="w-[1px] h-6 bg-slate-800 my-1" />}
                            </div>
                            <span className={evt.active ? 'text-slate-200' : 'text-slate-500'}>{evt.event}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'fuel' && (
                <motion.div
                  key="fuel-roi"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                >
                  {/* Left Column: KPI cards & Line Chart Mockups */}
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Fuel Spend', value: '$12,492', change: '-8.5%', status: 'up' },
                        { label: 'Avg Fleet MPG', value: '7.9 MPG', change: '+4.2%', status: 'up' },
                        { label: 'IFTA Disbursed', value: '$840.00', change: 'processed', status: 'neutral' },
                        { label: 'ROI Savings', value: '$3,842/mo', change: 'active', status: 'neutral' }
                      ].map((card, i) => (
                        <div key={i} className="bg-slate-900 border border-slate-800/60 p-4 rounded-xl flex flex-col justify-between">
                          <span className="text-[11px] text-slate-500 font-semibold">{card.label}</span>
                          <div className="flex justify-between items-baseline mt-2">
                            <span className="text-xl font-bold text-white tracking-tight">{card.value}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              card.label === 'Fuel Spend'
                                ? 'bg-emerald-500/10 text-accent' // Spend reduction is good!
                                : card.status === 'up'
                                ? 'bg-emerald-500/10 text-accent'
                                : 'bg-slate-800 text-slate-400'
                            }`}>{card.change}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chart Body */}
                    <div className="bg-slate-900 border border-slate-800/60 p-5 rounded-xl">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Weekly Fleet Analytics</h4>
                          <p className="text-[10px] text-slate-500">Comparing fuel efficiency (MPG) trends against mileage limits.</p>
                        </div>
                        <div className="flex gap-4 text-[9px] font-bold text-slate-500">
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-primary rounded-full" /> Fleet Average</span>
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-accent rounded-full" /> Target Benchmark</span>
                        </div>
                      </div>
                      
                      {/* SVG line chart */}
                      <div className="h-44 w-full relative">
                        <svg className="w-full h-full" viewBox="0 0 500 150">
                          {/* Grid Lines */}
                          {[0, 30, 60, 90, 120].map((y, i) => (
                            <line key={i} x1="30" y1={y} x2="480" y2={y} stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2" />
                          ))}
                          
                          {/* X-axis labels */}
                          {['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6'].map((lbl, i) => (
                            <text key={i} x={30 + i * 85} y="145" fill="#475569" fontSize="9" textAnchor="middle">{lbl}</text>
                          ))}

                          {/* Line Chart path for Fleet Avg */}
                          <path
                            d="M 30 110 L 115 100 L 200 85 L 285 92 L 370 70 L 455 60"
                            fill="none"
                            stroke="#2563EB"
                            strokeWidth="2.5"
                          />
                          {/* Anchor Dots */}
                          {[
                            {x: 30, y: 110}, {x: 115, y: 100}, {x: 200, y: 85}, {x: 285, y: 92}, {x: 370, y: 70}, {x: 455, y: 60}
                          ].map((pt, i) => (
                            <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill="#2563EB" stroke="#020617" strokeWidth="1" />
                          ))}

                          {/* Line Chart path for Target Benchmark */}
                          <path
                            d="M 30 90 L 115 90 L 200 90 L 285 90 L 370 90 L 455 90"
                            fill="none"
                            stroke="#22C55E"
                            strokeWidth="1.5"
                            strokeOpacity="0.4"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Custom Fuel logs */}
                  <div className="lg:col-span-4 bg-slate-900 border border-slate-800/60 p-4 rounded-xl flex flex-col justify-start">
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-4">MPG Vehicle Rankings</span>
                    <div className="flex flex-col gap-4 text-[11px]">
                      {[
                        { trk: 'TRK-302', driver: 'Ed Peterson', v: '8.4 MPG', status: 'above', color: 'text-accent' },
                        { trk: 'TRK-208', driver: 'Marcus Vance', v: '8.1 MPG', status: 'above', color: 'text-accent' },
                        { trk: 'TRK-105', driver: 'Dan Higgins', v: '7.8 MPG', status: 'benchmark', color: 'text-slate-400' },
                        { trk: 'VAN-114', driver: 'Sara Jenkins', v: '6.4 MPG', status: 'below', color: 'text-red-400' }
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                          <div>
                            <span className="font-bold text-white">{item.trk}</span>
                            <span className="text-[9px] text-slate-500 ml-2">({item.driver})</span>
                          </div>
                          <span className={`font-semibold font-mono ${item.color}`}>{item.v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 text-[10px] text-slate-500 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-850">
                      <strong>Auto-alert:</strong> Vehicle VAN-114 registers a low MPG. Recommend checking oxygen sensor or scheduling filter cleaning.
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'rbac' && (
                <motion.div
                  key="rbac-panel"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                >
                  {/* Left Column: Security overview */}
                  <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="bg-slate-900 border border-slate-800/60 p-5 rounded-xl flex flex-col justify-start">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-accent">
                          <ShieldCheck size={20} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Access Audits & Logging</h4>
                          <p className="text-[10px] text-slate-500">SOC2 compliant role based access security. Customize accessibility states.</p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        {[
                          { role: 'Safety Director', scope: 'Read/Write compliance scorecards, audit histories, HOS logs.', status: 'Active scope' },
                          { role: 'Financial Analyst', scope: 'Read fuel invoices, ledger sheets, export accounts integrations.', status: 'Active scope' },
                          { role: 'Field Dispatcher', scope: 'Read/Write load structures, driver rosters, calendar times.', status: 'Active scope' },
                          { role: 'Truck Driver', scope: 'Read assigned dispatches. Write trip manifests, mileage, card logs.', status: 'Active scope' }
                        ].map((role, idx) => (
                          <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex flex-col md:flex-row justify-between md:items-center gap-2">
                            <div>
                              <span className="text-xs font-bold text-slate-200">{role.role}</span>
                              <p className="text-[10px] text-slate-500 mt-1 max-w-sm">{role.scope}</p>
                            </div>
                            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-accent font-semibold border border-accent/20 w-fit">{role.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Roles access list */}
                  <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="bg-slate-900 border border-slate-800/60 p-5 rounded-xl flex-grow">
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-4 block">Security Auditing Trail</span>
                      <div className="flex flex-col gap-4 text-[10px]">
                        {[
                          { action: 'Role authorization updated for Analyst', operator: 'SysAdmin (Ed)', time: '8m ago' },
                          { action: 'Driver log signed with secure auth token', operator: 'Alex Rivera', time: '14m ago' },
                          { action: 'API integration webhook secret rotated', operator: 'AuthService', time: '2h ago' }
                        ].map((item, idx) => (
                          <div key={idx} className="flex gap-2 items-start py-2 border-b border-slate-850 pb-2.5">
                            <CheckCircle size={12} className="text-accent mt-0.5 flex-shrink-0" />
                            <div className="flex-grow">
                              <span className="text-slate-300 font-semibold">{item.action}</span>
                              <div className="flex justify-between items-center text-[9px] text-slate-500 mt-1">
                                <span>Operator: {item.operator}</span>
                                <span>{item.time}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
