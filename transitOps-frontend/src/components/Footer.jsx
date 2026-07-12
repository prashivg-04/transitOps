import { motion } from 'framer-motion';
import { Activity, Mail, Send, Globe } from 'lucide-react';

export default function Footer() {
  const handleNavClick = (e, href) => {
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      const navbarHeight = 80;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="bg-secondary text-slate-400 pt-20 pb-10 border-t border-slate-800 relative overflow-hidden">
      {/* Background radial soft light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-slate-850">
          
          {/* Logo & Description */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <a href="#" onClick={(e) => handleNavClick(e, '#')} className="flex items-center gap-2.5 font-bold text-xl text-white group">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
                <Activity size={18} className="stroke-[2.5]" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 font-extrabold font-sans">
                Transit<span className="text-primary font-bold">Ops</span>
              </span>
            </a>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The AI-powered logistics operating system. Streamline vehicles, drivers, dispatch, maintenance, and expenses from one centralized digital dashboard.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-primary transition-colors flex items-center justify-center text-slate-300 hover:text-white">
                <Globe size={15} />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-primary transition-colors flex items-center justify-center text-slate-300 hover:text-white">
                <Globe size={15} />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-primary transition-colors flex items-center justify-center text-slate-300 hover:text-white">
                <Globe size={15} />
              </a>
            </div>
          </div>

          {/* Quick Links Blocks */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h4 className="text-white text-[14px] font-semibold uppercase tracking-wider">Platform</h4>
            <ul className="flex flex-col gap-2.5 text-[14px]">
              <li><a href="#features" onClick={(e) => handleNavClick(e, '#features')} className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#dashboard" onClick={(e) => handleNavClick(e, '#dashboard')} className="hover:text-primary transition-colors">Dashboard Preview</a></li>
              <li><a href="#pricing" onClick={(e) => handleNavClick(e, '#pricing')} className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-1">Developer API <span className="text-[10px] bg-slate-800 text-primary border border-primary/20 px-1.5 py-0.5 rounded-full font-mono">v2</span></a></li>
            </ul>
          </div>

          <div className="md:col-span-2 flex flex-col gap-4">
            <h4 className="text-white text-[14px] font-semibold uppercase tracking-wider">System</h4>
            <ul className="flex flex-col gap-2.5 text-[14px]">
              <li><a href="#how-it-works" onClick={(e) => handleNavClick(e, '#how-it-works')} className="hover:text-primary transition-colors">Workflow</a></li>
              <li><a href="#benefits" onClick={(e) => handleNavClick(e, '#benefits')} className="hover:text-primary transition-colors">Benefits</a></li>
              <li><a href="#faq" onClick={(e) => handleNavClick(e, '#faq')} className="hover:text-primary transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Platform Status</a></li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <h4 className="text-white text-[14px] font-semibold uppercase tracking-wider">Stay updated</h4>
            <p className="text-slate-400 text-sm">
              Subscribe to the TransitOps newsletter for updates on intelligent fleet logistics.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <div className="relative flex-grow">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  placeholder="Enter work email"
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                />
              </div>
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white rounded-lg px-4 py-2.5 text-sm transition-colors flex items-center justify-center shadow-lg shadow-primary/10"
              >
                <Send size={15} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div>
            &copy; {new Date().getFullYear()} TransitOps Inc. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Security Compliance</a>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            <span className="text-slate-400">All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
