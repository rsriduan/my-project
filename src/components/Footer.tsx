'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Footer() {
  const { t, language } = useApp();
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribedEmail) {
      setSubscribed(true);
      setSubscribedEmail('');
    }
  };

  return (
    <footer className="bg-[#171936] text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          {/* Col 1: Brand Info & Address */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl font-extrabold tracking-wider text-white">
                DELIED
              </span>
              <span className="block text-[10px] tracking-widest text-[#4F24E8] font-bold uppercase">
                HAUTE COUTURE & ERP PLATFORM
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              {language === 'bn'
                ? 'ডেলিয়েড বাংলাদেশের শীর্ষস্থানীয় আধুনিক ফ্যাশন ব্র্যান্ড এবং সমন্বিত বিজনেস ম্যানেজমেন্ট ইকোসিস্টেম। ঐতিহ্য, কোয়ালিটি এবং প্রযুক্তির নিখুঁত সমন্বয়।'
                : 'DELIED is a premier Bangladeshi luxury apparel brand and unified multi-role business management ecosystem connecting retail, resellers, wholesale, and enterprise ERP.'}
            </p>
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#4F24E8]" />
                <span>Level 7, DELIED Tower, Road 11, Banani, Dhaka-1213, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#4F24E8]" />
                <span>Hotline: +880 9612 345678 (Toll Free 24/7)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#4F24E8]" />
                <span>Email: concierge@delied.com</span>
              </div>
            </div>
          </div>

          {/* Col 2: Customer Care */}
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-white uppercase tracking-wider text-xs border-b border-gray-800 pb-2">
              {language === 'bn' ? 'গ্রাহক সেবা' : 'Customer Care'}
            </h4>
            <ul className="space-y-2 text-gray-400 text-xs">
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  {t.orderTracking}
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-colors">
                  Return & Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  Shipping & Delivery Charges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Customer Concierge
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Business Portals & ERP */}
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-white uppercase tracking-wider text-xs border-b border-gray-800 pb-2">
              {language === 'bn' ? 'ব্যবসায়িক পোর্টাল' : 'Business Portals'}
            </h4>
            <ul className="space-y-2 text-gray-400 text-xs">
              <li>
                <Link href="/dashboard/reseller" className="hover:text-white transition-colors">
                  Reseller Portal & Wallet
                </Link>
              </li>
              <li>
                <Link href="/dashboard/wholesale" className="hover:text-white transition-colors">
                  Wholesale Bulk Purchasing
                </Link>
              </li>
              <li>
                <Link href="/dashboard/shareholder" className="hover:text-white transition-colors">
                  Shareholder Relations & Dividends
                </Link>
              </li>
              <li>
                <Link href="/dashboard/staff" className="hover:text-white transition-colors">
                  Company ERP & Costing System
                </Link>
              </li>
              <li>
                <Link href="/dashboard/marketer" className="hover:text-white transition-colors">
                  Affiliate & Marketing Hub
                </Link>
              </li>
              <li>
                <Link href="/dashboard/admin" className="text-delied-primary hover:text-white font-semibold transition-colors">
                  Super Admin Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-white uppercase tracking-wider text-xs border-b border-gray-800 pb-2">
              {language === 'bn' ? 'নিউজলেটার সাবস্ক্রিপশন' : 'Newsletter'}
            </h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              {language === 'bn'
                ? 'আমাদের নতুন কালেকশন এবং বিশেষ ঈদ অফার সংক্রান্ত আপডেট পেতে যুক্ত থাকুন।'
                : 'Subscribe to receive seasonal collection previews and private member sale invitations.'}
            </p>
            {subscribed ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-950/40 p-2 rounded border border-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={subscribedEmail}
                    onChange={(e) => setSubscribedEmail(e.target.value)}
                    className="w-full bg-[#111329] border border-gray-700 rounded-lg py-2 pl-3 pr-9 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#4F24E8]"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 text-[#4F24E8] hover:text-white transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Payment Methods & Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-gray-300">Accepted Payments in Bangladesh:</span>
            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-bold border border-rose-800">
              bKash
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-800">
              Nagad
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-bold border border-blue-800">
              SSLCommerz
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
              Cash on Delivery (COD)
            </span>
            <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-medium">
              Visa / MasterCard
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <span>© {new Date().getFullYear()} DELIED Ltd. All Rights Reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
