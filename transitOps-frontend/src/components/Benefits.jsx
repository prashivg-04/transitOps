import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Zap, AlertTriangle, RefreshCw, BarChart } from 'lucide-react';

export default function Benefits() {
  const benefitsList = [
    {
      title: 'Increase Fleet Efficiency',
      description: 'Optimize load matches and minimize empty backhaul miles. Realize maximum tonnage per trip cycle.',
      icon: <Zap className="text-primary" size={16} />
    },
    {
      title: 'Reduce Operational Cost',
      description: 'Audit idle times, verify fuel card usage alerts, and preventive maintenance alerts to ward off asset breakdowns.',
      icon: <BarChart className="text-accent" size={16} />
    },
    {
      title: 'Automate Dispatch',
      description: 'Generate automatic dispatcher-driver matchups. Routes and compliance clearances sync instantly.',
      icon: <RefreshCw className="text-blue-500" size={16} />
    },
    {
      title: 'Prevent Scheduling Conflicts',
      description: 'Live hour-of-service track alerts automatically flag driver fatigue or expired certifications before dispatches.',
      icon: <AlertTriangle className="text-rose-500" size={16} />
    },
    {
      title: 'Real-Time Insights',
      description: 'Immediate tracking dashboard reports on driver speed rates, vehicle fuel economies, and schedule updates.',
      icon: <Zap className="text-yellow-500" size={16} />
    },
    {
      title: 'Compliance Monitoring',
      description: 'Preconfigured audits for IFTA tax forms, license registries, and safety guidelines are updated automatically.',
      icon: <ShieldCheck className="text-violet-500" size={16} />
    }
  ];

  return (
    <section className="bg-white py-24 border-b border-slate-100 relative overflow-hidden" id="benefits">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column: Context & Benefits List */}
        <div className="lg:col-span-7 text-left flex flex-col gap-6">
          <div className="px-3 py-1 rounded-full bg-accent/5 border border-accent/20 text-accent text-xs font-semibold tracking-wide w-fit">
            System Advantages
          </div>
          <h2 className="text-secondary text-3xl md:text-4xl font-extrabold tracking-tight">
            Designed for scaling logistics fleets
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">
            TransitOps helps logistics operations replace chaos with automation, ensuring complete visibility and audit preparedness across all segments.
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {benefitsList.map((benefit, idx) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="flex gap-4 items-start border border-slate-100 hover:border-slate-200/80 p-4 rounded-xl transition-colors hover:bg-slate-50/50"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {benefit.icon}
                </div>
                <div>
                  <h4 className="text-secondary font-bold text-sm mb-1">{benefit.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Warnings/Resolution Box Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-premium relative flex flex-col gap-6"
        >
          {/* Conflict Averted Badge Floating */}
          <div className="bg-white border border-slate-150 p-4 rounded-xl shadow-premium flex gap-3 items-center border-l-4 border-l-accent flex-row">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-accent flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={16} />
            </div>
            <div className="text-left">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Automated Dispatcher Safety</div>
              <div className="text-xs font-bold text-secondary">Conflict Resolved: TRK-302 Match Averted</div>
              <div className="text-[9px] text-slate-500 mt-0.5">Driver hours boundary would exceed HOS in 45m. Automatically reassigned.</div>
            </div>
          </div>

          {/* Real-time Insights Floating */}
          <div className="bg-white border border-slate-150 p-4 rounded-xl shadow-premium flex gap-3 items-center border-l-4 border-l-primary flex-row">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center flex-shrink-0">
              <Zap size={16} />
            </div>
            <div className="text-left">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dynamic Routing Update</div>
              <div className="text-xs font-bold text-secondary">Rerouting: Live Toll Saved $124.00</div>
              <div className="text-[9px] text-slate-500 mt-0.5">Reconfigured route Chicago Gateway &rarr; Newark bypassed rush hour tolls.</div>
            </div>
          </div>

          {/* Compliance Check Card */}
          <div className="bg-secondary text-slate-400 p-4 rounded-xl shadow-premium flex flex-col gap-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">IFTA Tax Exemption Audit</span>
              <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-accent rounded font-semibold border border-accent/20">Cleared</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-[10px]">
              <div>
                <span className="block text-slate-500 font-semibold mb-0.5">Audit Quarter</span>
                <span className="font-bold text-white">Q3 (FY 2026)</span>
              </div>
              <div>
                <span className="block text-slate-500 font-semibold mb-0.5">Auto Logs Filed</span>
                <span className="font-bold text-white">100% compliant</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
