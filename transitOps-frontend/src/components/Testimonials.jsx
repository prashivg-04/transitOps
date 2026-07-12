import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      name: 'Sarah Kowalski',
      role: 'Director of Logistics Operations',
      company: 'Vanguard Transport',
      metric: 'Saved 28% in dispatch overhead',
      body: 'TransitOps completely eliminated the mess of our dispatch whiteboard systems. Automatically flagging potential scheduling conflicts and HOS violations prior to dispatch saves us daily headaches and avoids heavy compliance penalties.',
      imageLetter: 'S'
    },
    {
      name: 'James Vance',
      role: 'Enterprise Fleet Safety Lead',
      company: 'Apex Logistics',
      metric: '100% compliance audit success rate',
      body: 'With dynamic driver scorecards and centralized registry databases, we cleared our regional transportation safety audits with zero incidents. The dashboard offers immediate, real-time dispatch safety snapshots.',
      imageLetter: 'J'
    },
    {
      name: 'Marcus Lee',
      role: 'Chief Financial Officer',
      company: 'Global Freight Corp',
      metric: '$18,400 monthly fuel tax savings',
      body: 'The automated integration between fuel logs and GPS transit logs saves our finance team hours of work every week. Generating IFTA report disclosures takes seconds rather than weeks of audits.',
      imageLetter: 'M'
    }
  ];

  return (
    <section className="bg-slate-50 py-24 border-y border-slate-100" id="testimonials">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20 gap-4">
          <div className="px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-semibold tracking-wide w-fit">
            Client Success
          </div>
          <h2 className="text-secondary text-3xl md:text-4xl font-extrabold tracking-tight">
            Approved by leading transport teams
          </h2>
          <p className="text-slate-500 text-lg">
            See how fleet coordinators, controllers, and compliance teams automate actions and scale growth.
          </p>
        </div>

        {/* Dynamic Reviews Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white border border-slate-200/50 p-8 rounded-2xl shadow-premium hover:shadow-premium-lg transition-all relative flex flex-col justify-between group"
            >
              {/* Quote icon background decoration */}
              <Quote className="absolute top-6 right-6 text-slate-100 pointer-events-none w-10 h-10 group-hover:text-primary/5 transition-colors" />

              <div>
                {/* Visual Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} className="fill-amber-400 stroke-none" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-slate-600 text-sm leading-relaxed mb-6 block font-medium">
                  "{review.body}"
                </p>
              </div>

              {/* Reviewer Bio details */}
              <div className="flex items-center gap-4 border-t border-slate-100 pt-6 mt-4">
                <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200/60 flex items-center justify-center font-bold text-primary shadow-sm text-sm group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {review.imageLetter}
                </div>
                <div className="text-left">
                  <h4 className="text-secondary text-sm font-extrabold">{review.name}</h4>
                  <p className="text-slate-400 text-[11px] font-semibold">{review.role} &bull; <span className="text-slate-500">{review.company}</span></p>
                  <span className="inline-block mt-1 text-[11px] font-bold text-accent bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded">
                    {review.metric}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
