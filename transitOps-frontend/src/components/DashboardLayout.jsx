import React, { useState, useMemo } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Truck, Users, Route, Wrench, DollarSign, 
  BarChart3, Settings, ChevronLeft, ChevronRight, Search, 
  Bell, LogOut, Activity
} from 'lucide-react';
import { canAccess } from '../rbac';
import { getStoredUser } from '../hooks/useAuth';

export default function DashboardLayout({ onLogout }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Read logged-in user from localStorage (set by useLogin onSuccess)
  const currentUser = useMemo(() => getStoredUser(), []);
  const userRole = currentUser?.role ?? 'Dispatcher';
  const userFullName = currentUser?.full_name ?? 'User';
  // Build initials from full name
  const initials = userFullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  // All possible sidebar items
  const allNavItems = [
    { name: 'Dashboard',      path: '/dashboard',     icon: LayoutDashboard },
    { name: 'Fleet',          path: '/fleet',          icon: Truck },
    { name: 'Drivers',        path: '/drivers',        icon: Users },
    { name: 'Trips',          path: '/trips',          icon: Route },
    { name: 'Maintenance',    path: '/maintenance',    icon: Wrench },
    { name: 'Fuel & Expenses',path: '/fuel-expenses',  icon: DollarSign },
    { name: 'Analytics',      path: '/analytics',      icon: BarChart3 },
    { name: 'Settings',       path: '/settings',       icon: Settings },
  ];

  // Filter to only routes this role can access (full or view)
  const navItems = allNavItems.filter(item => canAccess(item.path, userRole));

  // Dynamic header page title resolution based on current path
  const getHeaderTitle = () => {
    const activeItem = navItems.find((n) => location.pathname.startsWith(n.path));
    return activeItem ? activeItem.name : 'Console';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex relative overflow-hidden">
      
      {/* Background radial blurs */}
      <div className="absolute top-[5%] left-[-150px] w-[500px] h-[500px] rounded-full bg-primary/5 filter blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[5%] right-[-150px] w-[600px] h-[600px] rounded-full bg-blue-500/5 filter blur-[150px] pointer-events-none" />

      {/* FIXED SIDEBAR */}
      <motion.aside
        animate={{ width: isCollapsed ? 76 : 256 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 h-screen bg-slate-900/60 backdrop-blur-md border-r border-slate-800/80 flex flex-col justify-between z-50 select-none"
      >
        
        {/* Top Logo and Title */}
        <div className="flex flex-col">
          <div className="h-16 border-b border-slate-850 flex items-center px-4 justify-between">
            <Link to="/dashboard" className="flex items-center gap-2.5 font-bold text-base text-white group truncate">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 flex-shrink-0 transition-transform group-hover:scale-105">
                <Activity size={16} className="stroke-[2.5]" />
              </div>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-200 font-extrabold"
                >
                  Transit<span className="text-primary font-bold">Ops</span>
                </motion.span>
              )}
            </Link>
          </div>

          {/* Navigation Links list */}
          <nav className="p-3 flex flex-col gap-1.5 mt-4">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                    isActive 
                      ? 'text-white' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                  }`}
                >
                  {/* Active highlight pill background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeSidebarPill"
                      className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeSidebarGlow"
                      className="absolute inset-y-2 left-0 w-0.5 bg-primary rounded"
                    />
                  )}

                  <Icon size={16} className={`stroke-[2.2] flex-shrink-0 transition-all ${
                    isActive ? 'text-primary scale-105 filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'group-hover:scale-105'
                  }`} />
                  
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.05 }}
                      className="truncate"
                    >
                      {item.name}
                    </motion.span>
                  )}

                  {/* Tooltip on Collapsed Hover */}
                  {isCollapsed && (
                    <div className="absolute left-[78px] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto bg-slate-900 border border-slate-800 text-[10px] font-bold text-white uppercase tracking-wider py-1.5 px-3 rounded-lg shadow-xl cursor-default transition-all duration-200 z-50 whitespace-nowrap">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom actions (Collapse and Exit) */}
        <div className="p-3 flex flex-col gap-1 border-t border-slate-850 bg-slate-900/20">
          
          {/* Collapse sidebar switch toggler */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900/40 transition-all select-none group w-full text-left"
          >
            {isCollapsed ? (
              <ChevronRight size={16} className="text-slate-500 group-hover:translate-x-0.5 transition-transform" />
            ) : (
              <>
                <ChevronLeft size={16} className="text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>

          {/* Exit/Log out button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/5 transition-all select-none group w-full text-left"
          >
            <LogOut size={16} className="text-rose-500/80 group-hover:-translate-x-0.5 transition-transform" />
            {!isCollapsed && <span>Exit Console</span>}
            {isCollapsed && (
              <div className="absolute left-[78px] bg-rose-950 border border-rose-900/40 text-[10px] font-bold text-rose-300 uppercase tracking-wider py-1.5 px-3 rounded-lg shadow-xl cursor-default transition-all duration-200 z-50 whitespace-nowrap">
                Exit Console
              </div>
            )}
          </button>
        </div>

      </motion.aside>

      {/* TOP HEADER & DYNAMIC CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-h-screen">
        
        {/* Dynamic Margin-left overlay spacer depending on collapsed state */}
        <motion.div
          animate={{ paddingLeft: isCollapsed ? 76 : 256 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex-1 flex flex-col"
        >
          
          {/* TOP NAVBAR HEADER */}
          <header className="h-16 bg-slate-950/60 backdrop-blur-md border-b border-slate-900/50 flex justify-between items-center px-6 sticky top-0 z-40 select-none">
            
            {/* Left Header Title mapping */}
            <h2 className="text-md font-bold text-slate-100 tracking-tight">
              {getHeaderTitle()}
            </h2>

            {/* Middle Search Input bar */}
            <div className="hidden md:flex relative max-w-sm w-full mx-8">
              <input
                type="text"
                placeholder="Search metrics, trips, or keys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-850/80 text-xs text-white rounded-xl pl-9 pr-4 py-2 placeholder-slate-500 outline-none focus:border-primary transition-all focus:bg-slate-900 shadow-inner"
              />
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>

            {/* Right Profile Controls */}
            <div className="flex items-center gap-4">
              
              {/* Notification icon */}
              <button className="text-slate-500 hover:text-white p-2 rounded-lg hover:bg-slate-900/40 transition-colors relative">
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
              </button>

              {/* Separation border divider */}
              <div className="w-[1px] h-6 bg-slate-850" />

              {/* Profile Avatar — navigates directly to /profile */}
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2.5 hover:opacity-85 transition-all outline-none focus:ring-1 focus:ring-primary/40 rounded-xl p-1 text-left"
                title="Go to Profile"
              >
                <div className="flex flex-col text-right hidden sm:flex">
                  <span className="text-xs font-bold text-slate-100 leading-tight">{userFullName}</span>
                  <span className="text-[9px] text-primary/80 font-bold bg-primary/10 border border-primary/20 rounded px-1.5 py-0.2 w-fit ml-auto uppercase font-mono tracking-wide">
                    {userRole}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-500 text-white font-extrabold text-[10px] flex items-center justify-center border border-primary/30 shadow-md shadow-primary/10 select-none">
                  {initials}
                </div>
              </button>

            </div>

          </header>

          {/* DYNAMIC CONTENT OUTLET WITH TRANSITION SLIDER */}
          <main className="flex-1 flex flex-col bg-slate-950">
            <Outlet context={{ searchQuery }} />
          </main>

        </motion.div>

      </div>

    </div>
  );
}
