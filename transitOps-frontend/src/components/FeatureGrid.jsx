import { motion } from 'framer-motion';
import { Truck, Users, ArrowUpRight, Wrench, Fuel, CreditCard, FileText, BarChart3, ShieldCheck } from 'lucide-react';

export default function FeatureGrid() {
  const features = [
    {
      icon: <Truck className="text-blue-500" size={22} />,
      title: 'Vehicle Registry',
      description: 'Centralized registry database for fleet lifecycle, compliance records, license tracking, and diagnostics.',
      color: 'from-blue-500/10 to-teal-500/5',
      borderColor: 'group-hover:border-blue-500/30'
    },
    {
      icon: <Users className="text-indigo-500" size={22} />,
      title: 'Driver Management',
      description: 'Manage profiles, driving shifts, hours of service (HOS), license compliance, safety courses, and scorecards.',
      color: 'from-indigo-500/10 to-violet-500/5',
      borderColor: 'group-hover:border-indigo-500/30'
    },
    {
      icon: <ArrowUpRight className="text-sky-500 font-bold" size={22} />,
      title: 'Trip Dispatch',
      description: 'Intelligent multi-stop dispatch, digital manifests, automatic driver assignments, and live ETA tracking.',
      color: 'from-sky-500/10 to-blue-500/5',
      borderColor: 'group-hover:border-sky-500/30'
    },
    {
      icon: <Wrench className="text-amber-500" size={22} />,
      title: 'Maintenance Logs',
      description: 'Automated PM schedules, engine error fault code logging, work order tracking, and technician assignments.',
      color: 'from-amber-500/10 to-orange-500/5',
      borderColor: 'group-hover:border-amber-500/30'
    },
    {
      icon: <Fuel className="text-emerald-500" size={22} />,
      title: 'Fuel Tracking',
      description: 'Fuel card integration, IFTA tax tracking, driver receipt validation, and vehicle MPG efficiency scoring.',
      color: 'from-emerald-500/10 to-teal-500/5',
      borderColor: 'group-hover:border-emerald-500/30'
    },
    {
      icon: <CreditCard className="text-rose-500" size={22} />,
      title: 'Expense Tracker',
      description: 'Monitor tolls, overnight layovers, maintenance costs, and capital expenditures with automated audits.',
      color: 'from-rose-500/10 to-pink-500/5',
      borderColor: 'group-hover:border-rose-500/30'
    },
    {
      icon: <FileText className="text-violet-500" size={22} />,
      title: 'Operational Reports',
      description: 'Generate compliance summaries, tax disclosures, asset lifecycle reviews, and billing invoices in seconds.',
      color: 'from-violet-500/10 to-purple-500/5',
      borderColor: 'group-hover:border-violet-500/30'
    },
    {
      icon: <BarChart3 className="text-cyan-500" size={22} />,
      title: 'Real-time Analytics',
      description: 'Custom insights into assets utilization, idle time breakdowns, CO2 output, and trip margins.',
      color: 'from-cyan-500/10 to-sky-500/5',
      borderColor: 'group-hover:border-cyan-500/30'
    },
    {
      icon: <ShieldCheck className="text-emerald-600" size={22} />,
      title: 'Role-Based Safety',
      description: 'Secure accessibility permissions and logging audits tailored for Drivers, Safety Managers, or Analysts.',
      color: 'from-emerald-500/10 to-green-500/5',
      borderColor: 'group-hover:border-emerald-500/40'
    }
  ];

  return (
    <section className="bg-white py-24" id="features">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20 gap-4">
          <div className="px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-semibold tracking-wide w-fit">
            Feature Registry
          </div>
          <h2 className="text-secondary text-3xl md:text-4xl font-extrabold tracking-tight">
            Single Hub. Total operational control.
          </h2>
          <p className="text-slate-500 text-lg">
            Replace siloed email chains and disconnected spreadsheets. Manage vehicles, driver shifts, asset maintenance, compliance logs, and profitability reporting from one intelligent cloud dashboard.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className={`group text-left p-8 rounded-2xl border border-slate-200/50 bg-gradient-to-br ${feature.color} shadow-premium hover:shadow-premium-lg transition-all duration-300 relative overflow-hidden`}
            >
              {/* Corner accent glow */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full pointer-events-none" />

              {/* Icon Frame */}
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-105 transition-transform duration-300">
                {feature.icon}
              </div>

              {/* Title & Desc */}
              <h3 className="text-secondary font-bold text-lg mb-3 flex items-center gap-1.5">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                {feature.description}
              </p>
              
              {/* Inline action link */}
              <div className="text-[13px] text-primary group-hover:text-primary-dark font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2">
                Learn capabilities
                <ArrowUpRight size={13} />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
