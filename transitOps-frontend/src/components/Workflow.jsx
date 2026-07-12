import { motion } from 'framer-motion';
import { ClipboardList, UserPlus, Send, Eye, FileBarChart } from 'lucide-react';

export default function Workflow() {
  const steps = [
    {
      num: '01',
      title: 'Register Vehicles',
      description: 'Upload VIN registries, upload license plates, and configure maintenance frequency schedules. Easily import your entire asset roster from spreadsheets in one click.',
      icon: <ClipboardList size={22} className="text-primary" />
    },
    {
      num: '02',
      title: 'Add Drivers',
      description: 'Create driver cards, specify license verification checklists, and activate driver app accesses. Set compliance alerts for HOS (Hours of Service) thresholds.',
      icon: <UserPlus size={22} className="text-accent" />
    },
    {
      num: '03',
      title: 'Dispatch Trips',
      description: 'Match available trucks with loads. Set automated routing schedules, send freight manifests directly to the driver mobile terminal, and track dispatch status.',
      icon: <Send size={22} className="text-blue-500" />
    },
    {
      num: '04',
      title: 'Track Operations',
      description: 'Monitor vehicles real-time with automated updates. Cross-check driver MPG efficiency levels, alert logs, and operational expenses in one workspace.',
      icon: <Eye size={22} className="text-rose-500" />
    },
    {
      num: '05',
      title: 'Generate Reports',
      description: 'Output high-quality records. Print tax filings, driver service hours validation logs, operational costs reviews, and customer invoices in seconds.',
      icon: <FileBarChart size={22} className="text-violet-500" />
    }
  ];

  return (
    <section className="bg-white py-24 relative overflow-hidden" id="how-it-works">
      {/* Visual background lines */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-slate-100 hidden lg:block" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20 gap-4">
          <div className="px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-semibold tracking-wide w-fit">
            System Operations
          </div>
          <h2 className="text-secondary text-3xl md:text-4xl font-extrabold tracking-tight">
            How TransitOps Works
          </h2>
          <p className="text-slate-500 text-lg">
            A frictionless onboarding cycle that scales with your growth. Transition from paper boards to automatic workflow automation in minutes.
          </p>
        </div>

        {/* Timeline content */}
        <div className="flex flex-col gap-12 lg:gap-8 max-w-5xl mx-auto">
          {steps.map((step, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`flex flex-col lg:flex-row items-center gap-6 lg:gap-12 relative ${
                  isEven ? '' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Visual center node for large screens */}
                <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-4 border-white bg-slate-200 outline-none shadow-md hidden lg:flex items-center justify-center z-20 group-hover:scale-110 transition-transform">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                </div>

                {/* Left/Right Text Column */}
                <div className={`w-full lg:w-1/2 flex flex-col gap-3 ${
                  isEven ? 'lg:text-right lg:items-end' : 'lg:text-left lg:items-start'
                } text-left`}>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-400">STEP</span>
                    <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded text-xs font-extrabold tracking-wider">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="text-secondary font-extrabold text-xl">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-md">
                    {step.description}
                  </p>
                </div>

                {/* Left/Right Illustration/Icon Card Column */}
                <div className="w-full lg:w-1/2 flex justify-start lg:justify-center">
                  <div className="bg-slate-50 border border-slate-200/50 p-6 rounded-2xl shadow-premium w-full max-w-sm flex gap-4 items-start hover:border-primary/20 transition-all">
                    <div className="w-11 h-11 rounded-lg bg-white shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0">
                      {step.icon}
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">TransitOps Manifest</div>
                      <div className="text-sm font-bold text-secondary">{step.title} Module Active</div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 mt-3 relative overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: '100%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: idx * 0.15 }}
                          className="absolute inset-y-0 left-0 bg-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
