import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export const Footer = ({ setActivePage }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-news-dark text-white border-t-4 border-primary mt-auto font-sans">
      {/* Top Newsletter & Banner Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-neutral-800">
        <div className="md:col-span-5">
          <h2 className="font-headline text-3xl font-black uppercase tracking-tight text-white">
            INDIAN <span className="text-primary">NEWS</span>
          </h2>
          <p className="font-body text-neutral-400 text-sm mt-2 max-w-md leading-relaxed">
            Delivering high-contrast, real-time broadcast and investigative journalism across India and global markets. Uncompromising accuracy, 24 hours a day.
          </p>
        </div>

        <div className="md:col-span-7">
          <h3 className="font-headline font-bold text-lg uppercase tracking-wider text-neutral-200">
            THE MORNING BRIEFING
          </h3>
          <p className="text-xs text-neutral-400 mt-1 mb-4 font-sans">
            Get curated editorial analysis and key economic updates delivered to your inbox every morning at 7:00 AM IST.
          </p>

          {subscribed ? (
            <div className="flex items-center gap-2 bg-neutral-900 border border-primary text-white px-4 py-2 text-sm font-semibold">
              <CheckCircle2 size={18} className="text-primary" />
              <span>Thank you for subscribing to The Morning Briefing!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-lg">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="bg-neutral-900 border border-neutral-700 text-white px-3.5 py-2 text-sm focus:outline-none focus:border-primary flex-1 font-sans"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-red-700 text-white font-headline font-bold uppercase text-xs px-5 py-2 flex items-center justify-center gap-2 transition-colors"
              >
                <span>SUBSCRIBE</span>
                <Send size={14} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Navigation Directory Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 text-xs font-sans border-b border-neutral-800">
        <div>
          <h4 className="font-headline font-bold text-neutral-200 uppercase text-sm mb-3">NATIONAL</h4>
          <ul className="space-y-2 text-neutral-400">
            <li><button onClick={() => setActivePage('search')} className="hover:text-white transition-colors">Politics & Parliament</button></li>
            <li><button onClick={() => setActivePage('search')} className="hover:text-white transition-colors">Supreme Court Reports</button></li>
            <li><button onClick={() => setActivePage('search')} className="hover:text-white transition-colors">States & Governance</button></li>
            <li><button onClick={() => setActivePage('search')} className="hover:text-white transition-colors">Election Watch 2026</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-headline font-bold text-neutral-200 uppercase text-sm mb-3">ECONOMY</h4>
          <ul className="space-y-2 text-neutral-400">
            <li><button onClick={() => setActivePage('search')} className="hover:text-white transition-colors">RBI Policy & Rates</button></li>
            <li><button onClick={() => setActivePage('search')} className="hover:text-white transition-colors">Markets & Sensex</button></li>
            <li><button onClick={() => setActivePage('search')} className="hover:text-white transition-colors">Corporate & Earnings</button></li>
            <li><button onClick={() => setActivePage('search')} className="hover:text-white transition-colors">Real Estate & Infra</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-headline font-bold text-neutral-200 uppercase text-sm mb-3">TECH & SCIENCE</h4>
          <ul className="space-y-2 text-neutral-400">
            <li><button onClick={() => setActivePage('search')} className="hover:text-white transition-colors">ISRO Space Missions</button></li>
            <li><button onClick={() => setActivePage('search')} className="hover:text-white transition-colors">Artificial Intelligence</button></li>
            <li><button onClick={() => setActivePage('search')} className="hover:text-white transition-colors">Clean Tech & Energy</button></li>
            <li><button onClick={() => setActivePage('search')} className="hover:text-white transition-colors">Cybersecurity</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-headline font-bold text-neutral-200 uppercase text-sm mb-3">WORLD</h4>
          <ul className="space-y-2 text-neutral-400">
            <li><button onClick={() => setActivePage('search')} className="hover:text-white transition-colors">Asia Pacific Desk</button></li>
            <li><button onClick={() => setActivePage('search')} className="hover:text-white transition-colors">Americas & Europe</button></li>
            <li><button onClick={() => setActivePage('search')} className="hover:text-white transition-colors">Global Economy</button></li>
            <li><button onClick={() => setActivePage('search')} className="hover:text-white transition-colors">Climate & Earth</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-headline font-bold text-neutral-200 uppercase text-sm mb-3">MULTIMEDIA</h4>
          <ul className="space-y-2 text-neutral-400">
            <li><button onClick={() => setActivePage('video')} className="hover:text-white transition-colors">24/7 Live Stream</button></li>
            <li><button onClick={() => setActivePage('video')} className="hover:text-white transition-colors">Prime Time Debates</button></li>
            <li><button onClick={() => setActivePage('video')} className="hover:text-white transition-colors">Documentaries</button></li>
            <li><button onClick={() => setActivePage('video')} className="hover:text-white transition-colors">Photo Essays</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-headline font-bold text-neutral-200 uppercase text-sm mb-3">ABOUT US</h4>
          <ul className="space-y-2 text-neutral-400">
            <li><a href="#" className="hover:text-white transition-colors">Editorial Code of Ethics</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Verification & Fact Check</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers & Internships</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-4">
        <p>© 2026 INDIAN NEWS NETWORK INC. ALL RIGHTS RESERVED.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};
