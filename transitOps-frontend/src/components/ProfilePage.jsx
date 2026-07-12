import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Shield, Sliders, Activity, AlertTriangle, Upload, 
  MapPin, Calendar, Mail, Phone, Key, Smartphone, Globe, 
  Clock, Lock, CheckCircle2, AlertCircle, LogOut, ArrowLeft
} from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const navigate = useNavigate();
  // We can fetch layout context if needed. Let's make sure it handles logout too.
  // Note: we can just trigger a mock state or use window.location reset on logout.

  // State configurations
  const [profileData, setProfileData] = useState({
    fullName: 'Raven K.',
    email: 'raven@transitops.in',
    phone: '+91 98765 43210',
    designation: 'Lead Dispatcher',
    department: 'Operations & Dispatch',
    location: 'Depot GJ-4, Gandhinagar',
    joiningDate: '2024-01-15',
    employeeId: 'EMP-2026-9908'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Security Toggles & inputs
  const [twoFactor, setTwoFactor] = useState(true);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passWords, setPassWords] = useState({ current: '', new: '', confirm: '' });
  const [passError, setPassError] = useState('');

  // Preference Toggles
  const [prefs, setPrefs] = useState({
    darkMode: true,
    language: 'English (US)',
    timezone: 'IST (UTC+5:30)',
    emailNotifications: true,
    pushNotifications: true
  });

  const handleProfileSave = (e) => {
    e.preventDefault();
    setSaveStatus('Saving changes...');
    setTimeout(() => {
      setSaveStatus('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }, 800);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!passWords.current || !passWords.new || !passWords.confirm) {
      setPassError('All password fields are required.');
      return;
    }
    if (passWords.new !== passWords.confirm) {
      setPassError('New passwords do not match.');
      return;
    }
    setPassError('');
    setSaveStatus('Updating password...');
    setTimeout(() => {
      setSaveStatus('Password updated successfully!');
      setIsChangingPass(false);
      setPassWords({ current: '', new: '', confirm: '' });
      setTimeout(() => setSaveStatus(null), 3000);
    }, 800);
  };

  const handleToggle = (field) => {
    setPrefs(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleLogout = () => {
    // Navigate to landing marketing page
    navigate('/');
  };

  return (
    <div className="bg-slate-950 min-h-screen text-left flex flex-col gap-6 p-6 md:p-8 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            User Settings & Profile
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            Profile Management
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Manage your dispatcher details, system preferences, active sessions, security credentials, and department configurations.
          </p>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white px-3.5 py-2 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 transition-all select-none self-start md:self-auto group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </button>
      </div>

      {/* Success/Status Alert Banner */}
      <AnimatePresence>
        {saveStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold ${
              saveStatus.includes('success') 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-primary/10 text-primary border border-primary/20'
            }`}
          >
            {saveStatus.includes('success') ? <CheckCircle2 size={16} /> : <Clock size={16} className="animate-spin" />}
            <span>{saveStatus}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Summary Card (Section 1) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850 p-6 rounded-2xl flex flex-col items-center text-center shadow-lg relative overflow-hidden">
            
            {/* Visual background gradient accent */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary via-blue-500 to-indigo-600" />
            
            {/* Large Avatar initials block */}
            <div className="relative mt-2">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-blue-500 text-white font-black text-2xl flex items-center justify-center border-4 border-slate-900 shadow-xl select-none">
                RK
              </div>
              <button 
                type="button" 
                className="absolute bottom-0 right-0 p-2 rounded-full bg-primary hover:bg-blue-600 text-white border-2 border-slate-900 transition-colors shadow-lg cursor-pointer"
                title="Upload Photo (UI only)"
              >
                <Upload size={14} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Profile Info */}
            <h3 className="text-base font-extrabold text-slate-100 mt-4">{profileData.fullName}</h3>
            <span className="text-[10px] text-primary/90 font-bold bg-primary/10 border border-primary/20 rounded-md px-2 py-0.5 mt-1.5 uppercase font-mono tracking-wide">
              {profileData.designation}
            </span>

            {/* General Specs */}
            <div className="w-full border-t border-slate-850 my-5 pt-4 flex flex-col gap-3 text-xs text-left">
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Employee ID:</span>
                <span className="text-slate-200 font-bold font-mono">{profileData.employeeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Department:</span>
                <span className="text-slate-200 font-bold">{profileData.department}</span>
              </div>
            </div>

            <p className="text-[10.5px] text-slate-400 bg-slate-950/40 border border-slate-850 p-2.5 rounded-xl text-left italic leading-normal">
              Note: Headshots and primary metadata changes require super-admin verification under regional depot regulations.
            </p>
          </div>
        </div>

        {/* Right Side: Tab details and preferences (Sections 2 to 6) */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Section 2: Personal Information */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850 p-6 rounded-2xl shadow-lg text-left">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-850">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <User size={14} className="text-primary" />
                Personal Information
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                  isEditing 
                    ? 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white' 
                    : 'bg-primary/10 text-primary border-primary/25 hover:bg-primary/20'
                }`}
              >
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>

            <form onSubmit={handleProfileSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  value={profileData.fullName}
                  disabled={!isEditing}
                  onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                  className="w-full bg-slate-950/60 border border-slate-850 text-xs text-white rounded-xl px-3 py-2 disabled:opacity-60 disabled:cursor-not-allowed outline-none focus:border-primary focus:bg-slate-900"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  value={profileData.email}
                  disabled={!isEditing}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full bg-slate-950/60 border border-slate-850 text-xs text-white rounded-xl px-3 py-2 disabled:opacity-60 disabled:cursor-not-allowed outline-none focus:border-primary focus:bg-slate-900"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Phone</label>
                <input 
                  type="text" 
                  value={profileData.phone}
                  disabled={!isEditing}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full bg-slate-950/60 border border-slate-850 text-xs text-white rounded-xl px-3 py-2 disabled:opacity-60 disabled:cursor-not-allowed outline-none focus:border-primary focus:bg-slate-900 font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Designation / Role</label>
                <input 
                  type="text" 
                  value={profileData.designation}
                  disabled={true} 
                  className="w-full bg-slate-950/60 border border-slate-800 text-xs text-slate-400 rounded-xl px-3 py-2 opacity-50 cursor-not-allowed outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Depot / Location</label>
                <input 
                  type="text" 
                  value={profileData.location}
                  disabled={!isEditing}
                  onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                  className="w-full bg-slate-950/60 border border-slate-850 text-xs text-white rounded-xl px-3 py-2 disabled:opacity-60 disabled:cursor-not-allowed outline-none focus:border-primary focus:bg-slate-900"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Joining Date</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={profileData.joiningDate}
                    disabled={true} 
                    className="w-full bg-slate-950/60 border border-slate-800 text-xs text-slate-400 rounded-xl px-3 py-2 opacity-50 cursor-not-allowed outline-none"
                  />
                  <Calendar size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600" />
                </div>
              </div>

              {isEditing && (
                <div className="md:col-span-2 mt-2 flex justify-end">
                  <button 
                    type="submit"
                    className="text-xs font-bold text-white bg-primary hover:bg-blue-600 px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Save Personal Information
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Section 3: Security */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850 p-6 rounded-2xl shadow-lg text-left">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5 pb-3 border-b border-slate-850 flex items-center gap-2">
              <Shield size={14} className="text-amber-500" />
              Security Options
            </h2>

            <div className="flex flex-col gap-5">
              
              {/* Password change status row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-950/40 border border-slate-850/80 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400">
                    <Lock size={15} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">Account Password</h4>
                    <p className="text-[10px] text-slate-400">Last changed: 3 months ago (Masked: ********)</p>
                  </div>
                </div>
                {!isChangingPass ? (
                  <button 
                    onClick={() => setIsChangingPass(true)}
                    className="text-xs font-bold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 transition-colors self-start sm:self-auto cursor-pointer"
                  >
                    Change Password
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsChangingPass(false)}
                    className="text-xs font-bold text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-800 transition-colors self-start sm:self-auto cursor-pointer"
                  >
                    Close Form
                  </button>
                )}
              </div>

              {/* Password Edit Fields */}
              <AnimatePresence>
                {isChangingPass && (
                  <motion.form 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    onSubmit={handlePasswordChange}
                    className="overflow-hidden border-t border-slate-850/60 pt-4 flex flex-col gap-3"
                  >
                    {passError && (
                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold">
                        <AlertCircle size={14} />
                        <span>{passError}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase font-bold text-slate-400 font-mono tracking-wide">Current Password</label>
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          value={passWords.current}
                          onChange={(e) => setPassWords({...passWords, current: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-850 text-xs text-white rounded-xl px-3 py-2 outline-none focus:border-primary focus:bg-slate-900"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase font-bold text-slate-400 font-mono tracking-wide">New Password</label>
                        <input 
                          type="password" 
                          placeholder="New Pass"
                          value={passWords.new}
                          onChange={(e) => setPassWords({...passWords, new: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-850 text-xs text-white rounded-xl px-3 py-2 outline-none focus:border-primary focus:bg-slate-900"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase font-bold text-slate-400 font-mono tracking-wide">Confirm Password</label>
                        <input 
                          type="password" 
                          placeholder="Confirm Pass"
                          value={passWords.confirm}
                          onChange={(e) => setPassWords({...passWords, confirm: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-850 text-xs text-white rounded-xl px-3 py-2 outline-none focus:border-primary focus:bg-slate-900"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-1">
                      <button 
                        type="button" 
                        onClick={() => setIsChangingPass(false)}
                        className="text-xs font-bold text-slate-400 hover:text-white px-3 py-2 rounded-xl border border-slate-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="text-xs font-bold text-white bg-primary hover:bg-blue-600 px-4 py-2 rounded-xl transition-all shadow-md cursor-pointer"
                      >
                        Update Password
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Two Factor Row */}
              <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-850/80 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400">
                    <Smartphone size={15} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      Two-Factor Authentication (2FA)
                      <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1 py-0.2 rounded font-bold">
                        RECOMMENDED
                      </span>
                    </h4>
                    <p className="text-[10px] text-slate-400">Secure authorization approvals via OTP application credentials.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out outline-none ${
                    twoFactor ? 'bg-primary' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out mt-0.5 ${
                      twoFactor ? 'translate-x-4.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Log Session Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-xl flex flex-col gap-1">
                  <span className="text-slate-400 font-semibold">Last Active Login:</span>
                  <span className="text-slate-200 font-bold font-mono">2026-07-12 12:48:58 (IST)</span>
                </div>
                <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-xl flex flex-col gap-1">
                  <span className="text-slate-400 font-semibold">Active Device Browser:</span>
                  <span className="text-slate-200 font-bold font-mono">Chrome 124.0 (macOS Desktop)</span>
                </div>
              </div>

            </div>
          </div>

          {/* Section 4: Preferences */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850 p-6 rounded-2xl shadow-lg text-left">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5 pb-3 border-b border-slate-850 flex items-center gap-2">
              <Sliders size={14} className="text-blue-400" />
              General Preferences
            </h2>

            <div className="flex flex-col gap-4">
              
              {/* Select Options rows */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wide flex items-center gap-1.5">
                    <Globe size={12} /> Language
                  </label>
                  <select 
                    value={prefs.language} 
                    onChange={(e) => setPrefs({...prefs, language: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-850 text-xs text-white rounded-xl px-3 py-2 outline-none focus:border-primary cursor-pointer select-none"
                  >
                    <option value="English (US)">English (US)</option>
                    <option value="Hindi">Hindi (हिंदी)</option>
                    <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                    <option value="Spanish">Spanish (Español)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wide flex items-center gap-1.5">
                    <Clock size={12} /> Timezone
                  </label>
                  <select 
                    value={prefs.timezone} 
                    onChange={(e) => setPrefs({...prefs, timezone: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-850 text-xs text-white rounded-xl px-3 py-2 outline-none focus:border-primary cursor-pointer select-none"
                  >
                    <option value="IST (UTC+5:30)">IST (UTC+5:30) - India</option>
                    <option value="UTC">UTC - Coordinated Universal Time</option>
                    <option value="EST (UTC-5)">EST (UTC-5) - Eastern Standard</option>
                  </select>
                </div>

              </div>

              {/* Toggles */}
              <div className="border-t border-slate-850/60 pt-4 flex flex-col gap-3.5">
                
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-100">Application Dark Mode</h4>
                    <p className="text-[10px] text-slate-400">Force application UI to leverage slate-dark background layers.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('darkMode')}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out outline-none bg-primary`}
                  >
                    <span className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out mt-0.5 translate-x-4.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-100">Email Notifications</h4>
                    <p className="text-[10px] text-slate-400">Receive dispatch reports, fuel log reviews, and maintenance rules alerts.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('emailNotifications')}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out outline-none ${
                      prefs.emailNotifications ? 'bg-primary' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out mt-0.5 ${
                        prefs.emailNotifications ? 'translate-x-4.5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-100">Desktop Push Alerts</h4>
                    <p className="text-[10px] text-slate-400">Prompt warnings when active trips exceed planned cargo payloads or timelines.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('pushNotifications')}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out outline-none ${
                      prefs.pushNotifications ? 'bg-primary' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out mt-0.5 ${
                        prefs.pushNotifications ? 'translate-x-4.5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

              </div>

            </div>
          </div>

          {/* Section 5: Activity Log */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850 p-6 rounded-2xl shadow-lg text-left">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5 pb-3 border-b border-slate-850 flex items-center gap-2">
              <Activity size={14} className="text-primary" />
              Recent System Activity
            </h2>

            <div className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-3 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-800">
                
                <div className="flex items-start gap-4 relative">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center text-primary z-10 shrink-0 font-bold">
                    LG
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-100">Account Session Login</span>
                      <span className="text-[9px] text-slate-400 font-mono">Today, 12:48 PM</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Successful authentication via Local Dispatch Depot terminal IP 127.0.0.1.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center text-blue-400 z-10 shrink-0 font-bold">
                    TR
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-100">Dispatched Trip TR009</span>
                      <span className="text-[9px] text-slate-400 font-mono">Yesterday, 02:40 PM</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Assigned driver Alex to Gandhi Depot hub with cargo payload of 750 KG.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center text-emerald-400 z-10 shrink-0 font-bold">
                    FL
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-100">Updated Fleet Vehicle Stats</span>
                      <span className="text-[9px] text-slate-400 font-mono">July 10, 11:15 AM</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Registered new carrier TRUCK-11 and updated mileage limits.</p>
                  </div>
                </div>

              </div>
              <div className="text-[9px] text-slate-500 border-t border-slate-850/60 pt-3 text-right">
                Profile last updated: <span className="font-mono text-slate-400 font-semibold">2026-07-12 12:53 PM</span>
              </div>
            </div>
          </div>

          {/* Section 6: Danger Zone */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-rose-950/30 p-6 rounded-2xl shadow-lg text-left relative overflow-hidden bg-gradient-to-br from-slate-900/40 to-rose-950/5">
            <h2 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-5 pb-3 border-b border-rose-950/20 flex items-center gap-2">
              <AlertTriangle size={14} className="text-rose-500 animate-pulse" />
              Danger Zone
            </h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-rose-950/10 border border-rose-900/25 rounded-xl">
                <div>
                  <h4 className="text-xs font-bold text-rose-300">Exit and Sign out</h4>
                  <p className="text-[10px] text-slate-400">Terminate the current secure browser session and return to Landing View.</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-white bg-rose-900/80 hover:bg-rose-800 border border-rose-900/30 px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                >
                  <LogOut size={13} />
                  Sign Out
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-rose-950/10 border border-rose-900/25 rounded-xl">
                <div>
                  <h4 className="text-xs font-bold text-rose-300">Deactivate Dispatcher Account</h4>
                  <p className="text-[10px] text-slate-400">Permanently disable access to all regional operational grids. Requires admin authorization.</p>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Account deactivation requires multi-factor organizational authorization approvals.')}
                  className="text-xs font-bold text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 px-3.5 py-2 rounded-xl transition-all self-start sm:self-auto cursor-pointer"
                >
                  Deactivate Account
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
