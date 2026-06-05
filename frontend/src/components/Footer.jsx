import { Globe } from 'lucide-react';

const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const TwitterIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const FacebookIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-softGray pt-12 pb-8 border-t border-borderGray mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-borderGray pb-8">
          <span className="font-black italic text-3xl text-darkCharcoal tracking-tight font-sans">
            zomato
          </span>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 rounded border border-borderGray px-3 py-1.5 text-sm font-medium bg-white hover:bg-softGray transition-colors">
              <Globe className="h-4 w-4" /> India <ChevronDown />
            </button>
            <button className="flex items-center gap-2 rounded border border-borderGray px-3 py-1.5 text-sm font-medium bg-white hover:bg-softGray transition-colors">
              English <ChevronDown />
            </button>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-10">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-darkCharcoal mb-4">About Zomato</h4>
            <ul className="space-y-2 text-sm text-mutedGray">
              <li><a href="#" className="hover:text-darkCharcoal transition-colors">Who We Are</a></li>
              <li><a href="#" className="hover:text-darkCharcoal transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-darkCharcoal transition-colors">Work With Us</a></li>
              <li><a href="#" className="hover:text-darkCharcoal transition-colors">Investor Relations</a></li>
              <li><a href="#" className="hover:text-darkCharcoal transition-colors">Report Fraud</a></li>
              <li><a href="#" className="hover:text-darkCharcoal transition-colors">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-darkCharcoal mb-4">Zomaverse</h4>
            <ul className="space-y-2 text-sm text-mutedGray">
              <li><a href="#" className="hover:text-darkCharcoal transition-colors">Zomato</a></li>
              <li><a href="#" className="hover:text-darkCharcoal transition-colors">Blinkit</a></li>
              <li><a href="#" className="hover:text-darkCharcoal transition-colors">Feeding India</a></li>
              <li><a href="#" className="hover:text-darkCharcoal transition-colors">Hyperpure</a></li>
              <li><a href="#" className="hover:text-darkCharcoal transition-colors">Zomaland</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-darkCharcoal mb-4">For Restaurants</h4>
            <ul className="space-y-2 text-sm text-mutedGray">
              <li><a href="#" className="hover:text-darkCharcoal transition-colors">Partner With Us</a></li>
              <li><a href="#" className="hover:text-darkCharcoal transition-colors">Apps For You</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-darkCharcoal mb-4">Learn More</h4>
            <ul className="space-y-2 text-sm text-mutedGray">
              <li><a href="#" className="hover:text-darkCharcoal transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-darkCharcoal transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-darkCharcoal transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-darkCharcoal transition-colors">Sitemap</a></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-darkCharcoal mb-4">Social Links</h4>
            <div className="flex gap-3 text-darkCharcoal">
              <a href="#" className="rounded-full bg-darkCharcoal hover:bg-zomato-500 text-white p-2 transition-all"><InstagramIcon className="h-4 w-4" /></a>
              <a href="#" className="rounded-full bg-darkCharcoal hover:bg-zomato-500 text-white p-2 transition-all"><TwitterIcon className="h-4 w-4" /></a>
              <a href="#" className="rounded-full bg-darkCharcoal hover:bg-zomato-500 text-white p-2 transition-all"><FacebookIcon className="h-4 w-4" /></a>
            </div>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="border-t border-borderGray pt-6 text-xs text-mutedGray leading-relaxed">
          By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy and Content Policies. All trademarks are properties of their respective owners. 2026-2030 © Zomato™ Ltd. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

// Helper for Chevron inside footer
const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
);

export default Footer;
