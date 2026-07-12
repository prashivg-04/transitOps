import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import { motion } from 'framer-motion';
import { Truck, Navigation, TrendingUp, Cpu } from 'lucide-react';

function MetricCard({ kpi, idx }) {
  const count = useAnimatedCounter(kpi.value, 1.8, idx * 0.1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      className="bg-white border border-slate-200/50 p-7 rounded-2xl shadow-premium hover:shadow-premium-lg transition-shadow relative overflow-hidden group text-left"
    >
      {/* Visual side decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />
      
      {/* Main Icon */}
      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:bg-primary/5 transition-colors">
        {kpi.icon}
      </div>

      {/* Animated value text */}
      <div className="flex items-baseline mb-2">
        <span className="text-4xl font-extrabold text-secondary tracking-tight">
          {count.toLocaleString()}{kpi.suffix}
        </span>
      </div>

      {/* Labels and description */}
      <h4 className="text-secondary font-bold text-[16px] mb-2">{kpi.label}</h4>
      <p className="text-slate-500 text-[13px] leading-relaxed">{kpi.description}</p>
    </motion.div>
  );
}

export default function Metrics() {
  const kpis = [
    {
      icon: <Truck className="text-primary" size={24} />,
      value: 500,
      suffix: '+',
      label: 'Vehicles Managed',
      description: 'Connected trucks, vans, and assets tracking real-time details.',
    },
    {
      icon: <Navigation className="text-accent" size={24} />,
      value: 20000,
      suffix: '+',
      label: 'Trips Completed',
      description: 'Seamless dispatch schedules fulfilled using automated routes.',
    },
    {
      icon: <Cpu className="text-blue-500" size={24} />,
      value: 98,
      suffix: '%',
      label: 'Fleet Utilization',
      description: 'Maximum load efficiency and reduced empty backhaul operations.',
    },
    {
      icon: <TrendingUp className="text-emerald-500" size={24} />,
      value: 40,
      suffix: '%',
      label: 'Operational Savings',
      description: 'Decrease in fuel waste, preventive wear, and administrative hours.',
    },
  ];

  return (
    <section className="bg-slate-50 py-20 border-y border-slate-100 relative overflow-hidden" id="metrics">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Title / Heading info */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-secondary text-sm font-bold uppercase tracking-wider mb-2">Metrics That Matter</h2>
          <p className="text-slate-500 text-lg">
            Empowering modern transport divisions and operators with scale, predictability, and efficiency.
          </p>
        </div>

        {/* Grid of cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {kpis.map((kpi, idx) => (
            <MetricCard key={kpi.label} kpi={kpi} idx={idx} />
          ))}
        </div>

      </div>
    </section>
  );
}
