import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Mail, Lock, ShieldCheck, ChevronDown, Check, Loader2, AlertCircle, ArrowRight, User, Building } from 'lucide-react';
import { useLogin, useRegister } from '../hooks/useAuth';

export default function Auth({ initialView = 'login', onBack, onSuccess }) {
  const [view, setView] = useState(initialView); // 'login' | 'signup'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('Dispatcher'); // must match backend UserRole enum values
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Role values MUST match backend UserRole enum exactly
  const roles = [
    {
      id: 'Fleet Manager',
      title: 'Fleet Manager',
      scope: 'Fleet, Maintenance',
      description: 'Manage asset lifecycle, compliance registers, and service schedules.',
      color: 'border-l-accent text-accent bg-emerald-500/5'
    },
    {
      id: 'Dispatcher',
      title: 'Dispatcher',
      scope: 'Dashboard, Trips',
      description: 'Assign smart routes, track drivers, and coordinate live loads.',
      color: 'border-l-primary text-primary bg-primary/5'
    },
    {
      id: 'Safety Officer',
      title: 'Safety Officer',
      scope: 'Drivers, Compliance',
      description: 'Monitor hours of service (HOS) logs, safety scores, and behavior alerts.',
      color: 'border-l-rose-500 text-rose-500 bg-rose-500/5'
    },
    {
      id: 'Financial Analyst',
      title: 'Financial Analyst',
      scope: 'Fuel & Expenses, Analytics',
      description: 'Audit idle times, verify fuel card scans, and extract tax reports.',
      color: 'border-l-violet-500 text-violet-500 bg-violet-500/5'
    }
  ];

  const handleRoleSelect = (roleId) => {
    setRole(roleId);
    setDropdownOpen(false);
  };

  const currentRole = roles.find(r => r.id === role) || roles[1];
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Pre-validations
    if (!email) {
      setErrorMsg('Email address is required.');
      return;
    }
    if (view === 'signup' && !fullName.trim()) {
      setErrorMsg('Full name is required.');
      return;
    }
    if (!password || password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }
    if (view === 'signup' && !/[A-Z]/.test(password)) {
      setErrorMsg('Password must contain at least one uppercase letter.');
      return;
    }
    if (view === 'signup' && !/[0-9]/.test(password)) {
      setErrorMsg('Password must contain at least one digit.');
      return;
    }

    setIsLoading(true);

    if (view === 'login') {
      try {
        await loginMutation.mutateAsync({ email, password });
        setIsLoading(false);
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess({ email, role, company });
        }, 1500);
      } catch (error) {
        setIsLoading(false);
        const detail = error.response?.data?.detail
          || error.response?.data?.message
          || 'Invalid credentials. Please try again.';
        setErrorMsg(detail);
      }
    } else {
      // Signup — call register then auto-login
      try {
        await registerMutation.mutateAsync({
          full_name: fullName.trim(),
          email,
          password,
          role, // already in backend enum format e.g. "Fleet Manager"
        });
        // Auto-login after successful registration
        await loginMutation.mutateAsync({ email, password });
        setIsLoading(false);
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess({ email, role, company: fullName });
        }, 1500);
      } catch (error) {
        setIsLoading(false);
        const detail = error.response?.data?.detail
          || error.response?.data?.message
          || error.response?.data?.errors?.[0]?.msg
          || 'Registration failed. Please try again.';
        setErrorMsg(detail);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col md:flex-row relative overflow-hidden">
      
      {/* Background decoration blur blobs */}
      <div className="absolute top-[10%] left-[-100px] w-[500px] h-[500px] rounded-full bg-primary/5 filter blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-100px] w-[600px] h-[600px] rounded-full bg-accent/5 filter blur-[150px] pointer-events-none" />

      {/* LEFT PANEL: Branding & RBAC scopes (Large screen sidebar) */}
      <div className="w-full md:w-[42%] lg:w-[38%] bg-slate-900/60 backdrop-blur-md border-b md:border-b-0 md:border-r border-slate-800 p-8 md:p-12 flex flex-col justify-between relative z-10">
        
        {/* Top BRANDING */}
        <div className="flex flex-col gap-4 text-left">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onBack();
            }}
            className="flex items-center gap-2.5 font-bold text-xl text-white group w-fit"
          >
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
              <Activity size={18} className="stroke-[2.5]" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 font-extrabold font-sans">
              Transit<span className="text-primary font-bold">Ops</span>
            </span>
          </a>
          <div className="mt-3">
            <h1 className="text-lg font-bold text-slate-100">Smart Transport Operations Platform</h1>
            <p className="text-xs text-slate-400">Next-gen fleet management orchestrating schedules, safety, and dispatches.</p>
          </div>
        </div>

        {/* Center ROLES PANEL */}
        <div className="my-10 md:my-0 flex flex-col gap-5 text-left">
          <div>
            <h2 className="text-secondary-100 text-sm font-semibold tracking-wide text-slate-400 uppercase">One login, four roles:</h2>
            <p className="text-[11px] text-slate-500 mt-1">Automatic workspace configuration based on role assignments.</p>
          </div>

          <div className="flex flex-col gap-3">
            {roles.map((r) => {
              const isActive = r.id === role;
              return (
                <motion.div
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 ${
                    isActive
                      ? `border-slate-700 bg-slate-800/80 shadow-premium-lg translate-x-2`
                      : 'border-slate-800/50 bg-slate-900/30 hover:border-slate-800 hover:bg-slate-900/50 hover:translate-x-1'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {r.title}
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                      isActive ? 'bg-primary/20 text-primary border border-primary/25' : 'bg-slate-800/50 text-slate-400'
                    }`}>
                      {r.scope}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed leading-normal">{r.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer text */}
        <div className="flex items-center justify-between text-[9px] text-slate-500 mt-6 md:mt-0 uppercase tracking-widest font-mono">
          <span>TRANSITOPS &copy; 2026 &middot; RBAC SECURITY</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[8px]">Cleared</span>
          </div>
        </div>

      </div>

      {/* RIGHT PANEL: Auth Interactive Forms */}
      <div className="flex-1 p-6 md:p-12 lg:p-16 flex items-center justify-center relative z-10 bg-slate-950">
        
        {/* Success Splash */}
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              className="max-w-md w-full text-center flex flex-col items-center gap-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/5">
                <Check size={28} className="stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Access Granted</h2>
                <p className="text-sm text-slate-400">Loading custom workspace for <span className="text-primary font-bold">{currentRole.title}</span>...</p>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-850">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                  className="bg-primary h-full"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={view}
              initial={{ opacity: 0, x: view === 'login' ? -15 : 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: view === 'login' ? 15 : -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-md w-full bg-slate-900/30 border border-slate-800/80 p-8 rounded-2xl shadow-premium relative text-left"
            >
              
              {/* Floating Return Button */}
              <button
                onClick={onBack}
                className="absolute top-4 right-4 text-xs text-slate-500 hover:text-white transition-colors border border-slate-800 hover:border-slate-700 bg-slate-900/50 px-2.5 py-1 rounded-md"
              >
                Cancel
              </button>

              {/* Card headers */}
              <div className="mb-8 select-none">
                <h2 className="text-2xl font-bold text-white tracking-tight mb-1.5">
                  {view === 'login' ? 'Sign in to your account' : 'Register your company'}
                </h2>
                <p className="text-xs text-slate-550 leading-relaxed font-sans">
                  {view === 'login' ? 'Enter your credentials to continue' : 'Build a smart dashboard for your operations'}
                </p>
              </div>

              {/* Dashed Red Error State Container */}
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl border border-dashed border-rose-500 bg-rose-500/5 text-rose-400 text-xs flex gap-3 items-start select-none"
                >
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold block mb-0.5">Error state</span>
                    <span>{errorMsg}</span>
                  </div>
                </motion.div>
              )}

              {/* Form Input fields */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                
                {/* FULL NAME (Only in Signup view) */}
                {view === 'signup' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Jane Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800/60 text-sm text-white rounded-xl pl-10 pr-4 py-3 placeholder-slate-600 outline-none focus:border-primary transition-all duration-300 focus:shadow-md focus:shadow-primary/5 shadow-inner"
                      />
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    </div>
                  </div>
                )}

                {/* COMPANY NAME (Optional, Only in Signup view) */}
                {view === 'signup' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">Company Name <span className="text-slate-600 normal-case font-normal">(optional)</span></label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Logistics Corp"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800/60 text-sm text-white rounded-xl pl-10 pr-4 py-3 placeholder-slate-600 outline-none focus:border-primary transition-all duration-300 focus:shadow-md focus:shadow-primary/5 shadow-inner"
                      />
                      <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    </div>
                  </div>
                )}

                {/* EMAIL ADDRESS */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Ravenk@transitops.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800/60 text-sm text-white rounded-xl pl-10 pr-4 py-3 placeholder-slate-600 outline-none focus:border-primary transition-all duration-300 focus:shadow-md focus:shadow-primary/5 shadow-inner"
                    />
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                    <label className="text-slate-450">Password</label>
                    {view === 'login' && (
                      <a href="#" onClick={(e) => { e.preventDefault(); setErrorMsg('Password recovery is disabled in sandbox.'); }} className="text-primary hover:underline">
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800/60 text-sm text-white rounded-xl pl-10 pr-12 py-3 placeholder-slate-600 outline-none focus:border-primary transition-all duration-300 focus:shadow-md focus:shadow-primary/5 shadow-inner"
                    />
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 hover:text-white uppercase font-bold px-2 py-1 rounded"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {/* ROLE ROLE(RBAC) CUSTOM SELECT */}
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">Role (RBAC Access)</label>
                  
                  {/* Select button */}
                  <div
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full bg-slate-900 border border-slate-800/60 text-sm text-white rounded-xl px-4 py-3 cursor-pointer flex justify-between items-center hover:border-slate-700 transition-colors select-none"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100">{currentRole.title}</span>
                      <span className="text-[8px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded uppercase">
                        {currentRole.scope}
                      </span>
                    </div>
                    <ChevronDown size={15} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Dropdown Menu Option list */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-[68px] left-0 w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-premium-lg z-50 p-2 flex flex-col gap-1 backdrop-blur-lg"
                      >
                        {roles.map((r) => {
                          const isSelected = r.id === role;
                          return (
                            <div
                              key={r.id}
                              onClick={() => handleRoleSelect(r.id)}
                              className={`p-2.5 rounded-lg text-left text-xs cursor-pointer flex justify-between items-center transition-colors ${
                                isSelected ? 'bg-primary text-white font-bold' : 'hover:bg-slate-800/60 text-slate-300'
                              }`}
                            >
                              <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-1.5">
                                  <span>{r.title}</span>
                                  <span className={`text-[8px] px-1.5 rounded font-semibold tracking-wider font-mono ${
                                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                                  }`}>
                                    {r.scope}
                                  </span>
                                </div>
                              </div>
                              {isSelected && <Check size={14} className="text-white" />}
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* REMEMBER ME AND SIGN STATE TOGGLE */}
                <div className="flex justify-between items-center select-none py-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-450 hover:text-slate-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-800 bg-slate-900 text-primary w-4 h-4 outline-none focus:ring-0 focus:ring-offset-0 cursor-pointer accent-primary"
                    />
                    <span>Remember me</span>
                  </label>
                </div>

                {/* ACTION SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary-dark hover:to-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-75 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:left-[150%] transition-all duration-1000 ease-out" />
                  
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>{view === 'login' ? 'Sign In' : 'Sign Up'}</span>
                      <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

              </form>

              {/* View layout toggle switch */}
              <div className="mt-8 text-center text-xs text-slate-500 select-none pb-2 border-t border-slate-850 pt-5">
                <span>
                  {view === 'login' ? "Don't have a TransitOps corporate registry?" : 'Already registered company?'}
                </span>{' '}
                <button
                  onClick={() => {
                    setView(view === 'login' ? 'signup' : 'login');
                    setErrorMsg('');
                  }}
                  className="text-primary hover:underline font-bold"
                >
                  {view === 'login' ? 'Register Now' : 'Sign In'}
                </button>
              </div>

              {/* Dynamic scope descriptions below form */}
              <div className="mt-6 p-4 rounded-xl bg-slate-900/40 border border-slate-850 text-[10px] text-slate-500 leading-relaxed text-left opacity-80 select-none">
                <span className="font-bold text-slate-400 block mb-1">Access is scoped by role after login:</span>
                <ul className="flex flex-col gap-1">
                  <li>&bull; <strong className="text-slate-450">Fleet Manager</strong> &rarr; Real-time fleet, preventive maintenance logs.</li>
                  <li>&bull; <strong className="text-slate-450">Dispatcher</strong> &rarr; Live dashboard widgets, driver routing dispatches.</li>
                  <li>&bull; <strong className="text-slate-450">Safety Officer</strong> &rarr; Roster directories, automatic compliance audits.</li>
                  <li>&bull; <strong className="text-slate-450">Financial Analyst</strong> &rarr; Fuel economy rankings, tax and analytics logs.</li>
                </ul>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
