import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

export default function Pricing({ onNavigate = () => {} }) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'annual'

  const plans = [
    {
      name: 'Starter',
      description: 'Ideal configuration for local operators and small fleets looking to digitize.',
      price: billingCycle === 'monthly' ? 49 : 39,
      period: '/mo',
      limit: 'Up to 15 vehicles connected',
      features: [
        'Sleek Vehicle & Driver Registry Registry',
        'Basic multi-stop routing maps',
        'Driver logs & shifts record',
        'Standard hours-of-service alerts',
        'Email list documentation support'
      ],
      popular: false,
      cta: 'Start Starter Plan'
    },
    {
      name: 'Professional',
      description: 'Intelligent capabilities built for expanding carriers running multi-state operations.',
      price: billingCycle === 'monthly' ? 199 : 159,
      period: '/mo',
      limit: 'Up to 100 vehicles connected',
      features: [
        'Includes everything in Starter',
        'Intelligent dispatch & load matching',
        'Active fuel card integrations',
        'Preventative maintenance warnings',
        'IFTA tax automation templates',
        'Priority live operations timeline monitor'
      ],
      popular: true,
      cta: 'Begin Professional Trial'
    },
    {
      name: 'Enterprise',
      description: 'Custom setups tailored for large operators requiring complex rules and setups.',
      price: 'Custom',
      period: '',
      limit: 'No limit on vehicles',
      features: [
        'Includes all Professional features',
        'Custom SSO and authorization triggers',
        'Dedicated success team coordinator',
        '99.9% uptime SLA compliance contract',
        'Custom webhooks, API limits and schemas',
        'In-person onboarding & terminal training'
      ],
      popular: false,
      cta: 'Contact Enterprise Sales'
    }
  ];

  return (
    <section className="bg-white py-24" id="pricing">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 gap-4">
          <div className="px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-semibold tracking-wide w-fit">
            Transparent Pricing
          </div>
          <h2 className="text-secondary text-3xl md:text-4xl font-extrabold tracking-tight">
            Flexible plans built to grow with you
          </h2>
          <p className="text-slate-500 text-lg">
            No provisioning fees. Change or cancel tiers immediately based on vehicle numbers and seasonal needs.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-xl border border-slate-200/60 mt-6">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 font-semibold text-xs rounded-lg transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-secondary shadow-sm'
                  : 'text-slate-500 hover:text-secondary'
              }`}
            >
              Billing Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-white text-secondary shadow-sm'
                  : 'text-slate-500 hover:text-secondary'
              }`}
            >
              Billing Annually
              <span className="text-[9px] font-extrabold bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] px-1.5 py-0.5 rounded-full uppercase">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`relative flex flex-col justify-between p-8 rounded-2xl border transition-all ${
                plan.popular
                  ? 'border-primary bg-secondary text-white shadow-premium-lg scale-[1.02] lg:scale-[1.04] z-10'
                  : 'border-slate-200/60 bg-white text-secondary shadow-premium hover:shadow-premium-lg'
              }`}
            >
              {/* Popularity Badge floating */}
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-extrabold tracking-wide uppercase px-3.5 py-1.5 rounded-lg shadow-md">
                  Most Popular
                </span>
              )}

              <div>
                {/* Plan Header */}
                <div className="text-left mb-6">
                  <h3 className={`text-xl font-bold ${plan.popular ? 'text-white' : 'text-secondary'}`}>{plan.name}</h3>
                  <p className={`text-xs mt-2 leading-relaxed ${plan.popular ? 'text-slate-400' : 'text-slate-400'}`}>
                    {plan.description}
                  </p>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-1 my-6 text-left border-b pb-6 border-slate-100/10">
                  <span className={`text-4xl font-extrabold tracking-tight ${plan.popular ? 'text-white' : 'text-secondary'}`}>
                    {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                  </span>
                  <span className={`text-xs ${plan.popular ? 'text-slate-400' : 'text-slate-450'}`}>{plan.period}</span>
                </div>

                {/* Limits & Vehicle Details */}
                <div className={`text-xs font-semibold uppercase tracking-wider mb-6 text-left ${plan.popular ? 'text-accent' : 'text-primary'}`}>
                  {plan.limit}
                </div>

                {/* Features List */}
                <ul className="flex flex-col gap-4 text-left text-xs mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        plan.popular ? 'bg-primary/20 text-primary-light' : 'bg-slate-50 text-primary'
                      }`}>
                        <Check size={12} className="stroke-[3.5]" />
                      </div>
                      <span className={plan.popular ? 'text-slate-300' : 'text-slate-500'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Call To Action button */}
              <button
                onClick={() => onNavigate(plan.name === 'Enterprise' ? 'login' : 'signup')}
                className={`w-full py-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 group ${
                  plan.popular
                    ? 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20'
                    : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-secondary'
                }`}
              >
                {plan.cta}
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </button>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
