import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle2, TrendingUp, Navigation, Calendar } from 'lucide-react';

export default function Hero({ onNavigate = () => {} }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden bg-white">
      {/* Background blobs */}
      <div className="absolute top-[10%] left-[5%] w-[450px] h-[450px] bg-primary/10 rounded-full gradient-blob animate-blob" />
      <div className="absolute bottom-[10%] right-[5%] w-[550px] h-[550px] bg-accent/5 rounded-full gradient-blob animate-blob" style={{ animationDelay: '4s' }} />
      <div className="absolute top-[30%] right-[20%] w-[350px] h-[350px] bg-blue-200/20 rounded-full gradient-blob animate-blob" style={{ animationDelay: '8s' }} />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Text Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6 text-left max-w-xl"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-semibold tracking-wide w-fit animate-pulse"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Next Gen Fleet Intelligence Platform
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-[44px] md:text-[56px] font-extrabold text-secondary tracking-tight leading-[1.05]"
          >
            Drive Smarter.<br />
            Deliver Faster.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              Manage Everything.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-slate-600 text-lg leading-relaxed md:text-xl"
          >
            Manage vehicles, drivers, dispatch, maintenance, fuel costs and analytics from one intelligent platform.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <button
              onClick={() => onNavigate('signup')}
              className="bg-primary hover:bg-primary-dark text-white rounded-xl px-7 py-4 text-sm font-semibold shadow-lg shadow-primary/20 flex items-center gap-2 group transition-all hover:scale-[1.02]"
            >
              Get Started
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button className="bg-white hover:bg-slate-50 border border-slate-200 text-secondary rounded-xl px-6 py-4 text-sm font-semibold flex items-center gap-2 transition-all hover:scale-[1.02] shadow-premium">
              <Play size={14} className="fill-secondary stroke-[3px] text-secondary" />
              Watch Demo
            </button>
          </motion.div>

          {/* Core Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-6 border-t border-slate-100 text-xs text-slate-500 font-medium"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-accent" /> Setup in 10 minutes
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-accent" /> No hardware required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-accent" /> GDPR & SOC2 Compliant
            </span>
          </motion.div>
        </motion.div>

        {/* Graphics & Ilustrations Side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative w-full h-[400px] md:h-[500px]"
        >
          {/* Main Glass Dashboard Card preview */}
          <div className="absolute inset-0 bg-white/40 border border-slate-200/50 rounded-2xl shadow-premium-lg overflow-hidden glass p-4 select-none animate-float">
            <div className="h-6 w-full border-b border-slate-200/50 flex items-center gap-1.5 pb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <div className="ml-4 h-4 w-32 rounded bg-slate-100/80" />
            </div>
            
            <div className="grid grid-cols-12 gap-4 mt-4 h-[calc(100%-2rem)]">
              {/* Fake Sidebar */}
              <div className="col-span-3 flex flex-col gap-2.5">
                <div className="h-6 w-full rounded bg-primary/10 border-l-[3px] border-primary" />
                <div className="h-5 w-4/5 rounded bg-slate-100/50" />
                <div className="h-5 w-3/4 rounded bg-slate-100/50" />
                <div className="h-5 w-4/5 rounded bg-slate-100/50" />
                <div className="h-5 w-2/3 rounded bg-slate-100/50" />
              </div>
              
              {/* Fake Dashboard body */}
              <div className="col-span-9 flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-16 rounded bg-slate-50/70 border border-slate-200/20 p-2 flex flex-col justify-between">
                    <span className="text-[9px] text-slate-400">Total Trips</span>
                    <span className="text-sm font-bold text-slate-800">12,492</span>
                  </div>
                  <div className="h-16 rounded bg-slate-50/70 border border-slate-200/20 p-2 flex flex-col justify-between">
                    <span className="text-[9px] text-slate-400">Efficiency</span>
                    <span className="text-sm font-bold text-accent">98.4%</span>
                  </div>
                  <div className="h-16 rounded bg-slate-50/70 border border-slate-200/20 p-2 flex flex-col justify-between">
                    <span className="text-[9px] text-slate-400">Savings</span>
                    <span className="text-sm font-bold text-primary">$4,923/mo</span>
                  </div>
                </div>
                
                <div className="h-32 rounded bg-slate-50 border border-slate-100 p-2 flex flex-col gap-2">
                  <div className="h-3 w-20 rounded bg-slate-200" />
                  <div className="flex-grow flex items-end gap-1.5 pb-2">
                    {[40, 20, 55, 75, 45, 90, 60, 45, 80, 100, 70, 85].map((h, i) => (
                      <div
                        key={i}
                        className="bg-primary/20 hover:bg-primary transition-colors flex-grow rounded-sm"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="h-14 rounded bg-slate-50 border border-slate-100 p-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs">V</div>
                    <div>
                      <div className="text-[10px] font-bold">Vehicle #304</div>
                      <div className="text-[8px] text-slate-400">Active Dispatch - NYC Route</div>
                    </div>
                  </div>
                  <div className="text-[9px] px-2 py-0.5 rounded bg-accent/15 text-accent font-semibold">On Schedule</div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Card 1 - Fuel Efficiency */}
          <motion.div
            initial={{ x: -20, y: -20, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="absolute top-[8%] -left-[6%] bg-white border border-slate-200/60 shadow-premium p-3 rounded-xl flex items-center gap-3 w-48"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <TrendingUp size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Fuel Saved Value</p>
              <h5 className="font-extrabold text-[15px] text-slate-800">$1,280 / wk</h5>
            </div>
          </motion.div>

          {/* Floating Card 2 - Active Dispatch */}
          <motion.div
            initial={{ x: 20, y: 40, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute bottom-[22%] -right-[6%] bg-white border border-slate-200/60 shadow-premium p-3 rounded-xl flex items-center gap-3 w-52"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary animate-pulse">
              <Navigation size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Active Dispatch Logs</p>
              <h5 className="font-extrabold text-[15px] text-slate-800">142 Routes Live</h5>
            </div>
          </motion.div>

          {/* Floating Card 3 - Driver Utilization */}
          <motion.div
            initial={{ x: -30, y: 30, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="absolute bottom-[5%] left-[8%] bg-secondary text-white shadow-premium-lg p-3 rounded-xl flex items-center gap-3 w-48"
          >
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-accent">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Driver Matching</p>
              <h5 className="font-extrabold text-[15px] text-white">98% Match Rate</h5>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}
