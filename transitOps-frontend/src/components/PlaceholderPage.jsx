import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock } from 'lucide-react';

export default function PlaceholderPage({ title, description, icon: Icon = Clock }) {
  return (
    <div className="flex-1 flex items-center justify-center p-6 md:p-12 min-h-[calc(100vh-80px)] select-none">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-slate-900/35 border border-slate-800/80 p-8 rounded-2xl shadow-premium text-center relative overflow-hidden backdrop-blur-md"
      >
        {/* Glow backdrop decorative */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-primary/5 filter blur-[60px] pointer-events-none" />

        {/* Floating large icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-primary shadow-lg shadow-primary/5 relative">
          <Icon size={28} className="stroke-[2] animate-pulse" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-slate-900 animate-ping" />
        </div>

        {/* Text descriptions */}
        <h2 className="text-xl font-bold text-white mb-2 tracking-tight">{title}</h2>
        <span className="inline-block text-[10px] text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-0.5 font-bold uppercase tracking-wide mb-4">
          Under Construction
        </span>
        <p className="text-xs text-slate-450 leading-relaxed max-w-sm mx-auto mb-8 font-sans">
          {description || 'This module is currently being configured and validated. Active registers, reports, and controls will be populated here during the next project sprint.'}
        </p>

        {/* Action Link button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-750 border border-slate-700/60 text-slate-200 hover:text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
