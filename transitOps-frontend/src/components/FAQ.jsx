import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: 'Do we need to purchase custom tracking hardware to start?',
      a: 'No. TransitOps works entirely via software. You can choose to integrate with existing ELD/telematics providers (like Samsara or Motive) or simply have drivers log activities through the TransitOps web app on their phone or tablet terminals.'
    },
    {
      q: 'How long does the initial fleet setup take?',
      a: 'Most carriers can set up in less than 10 minutes. You can import your entire roster of vehicles and drivers from Excel spreadsheets in one click, and they will immediately sync to the dashboard.'
    },
    {
      q: 'Can we configure custom security access permissions (RBAC)?',
      a: 'Yes. TransitOps supports full Role-Based Access Control. You can configure precise permissions for your Dispatchers, Fleet Safety leads, Financial Analysts, or Owner-Operators to ensure compliance and data privacy.'
    },
    {
      q: 'How does secondary fuel receipt verification function?',
      a: 'When drivers upload a picture or log details of a fuel purchase, TransitOps automatically cross-checks the fuel amount with the vehicle GPS telemetry at that timestamp, verifying transaction locations to avert fraud logs.'
    },
    {
      q: 'Is there a contract commitment or can we cancel early?',
      a: 'All Starter and Professional subscription plans are on a month-to-month basis by default. You can upgrade, downgrade, or cancel your tier at any time without early cancellation fees.'
    }
  ];

  const handleToggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="bg-slate-50 py-24 border-t border-slate-100" id="faq">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 gap-4">
          <div className="px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-semibold tracking-wide w-fit">
            System Knowledge Base
          </div>
          <h2 className="text-secondary text-3xl md:text-4xl font-extrabold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 text-lg">
            Answers to common questions about setting up and automating your logistics operations.
          </p>
        </div>

        {/* Accordions */}
        <div className="flex flex-col gap-4 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/50 rounded-xl overflow-hidden shadow-premium transition-all hover:border-slate-300"
              >
                <button
                  onClick={() => handleToggle(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between font-bold text-sm md:text-[15px] text-secondary outline-none text-left"
                >
                  <span>{faq.q}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100 flex-shrink-0"
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </button>

                {/* Collapsible Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-1 text-slate-500 text-sm leading-relaxed border-t border-slate-100/50">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
