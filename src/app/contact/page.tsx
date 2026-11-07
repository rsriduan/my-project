'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAF9FF] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#4F24E8]">
            Customer Concierge & Corporate Office
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#171936]">
            Get In Touch With DELIED
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            Whether for retail support, wholesale bulk pre-orders, or reseller partnerships, our team is at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 bg-[#171936] text-white p-8 rounded-3xl space-y-6">
            <h3 className="font-serif text-xl font-bold">Headquarters & Showroom</h3>
            <div className="space-y-4 text-xs text-gray-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#4F24E8] flex-shrink-0" />
                <span>Level 7, DELIED Tower, Road 11, Banani, Dhaka-1213, Bangladesh</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#4F24E8] flex-shrink-0" />
                <span>Hotline: +880 9612 345678 (24/7 Toll-Free)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#4F24E8] flex-shrink-0" />
                <span>concierge@delied.com</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800 text-xs text-gray-400">
              <p className="font-bold text-white mb-1">Operating Hours:</p>
              <p>Retail Concierge: 24 Hours / 7 Days</p>
              <p>Corporate Office: Sunday – Thursday, 9:00 AM – 6:00 PM BST</p>
            </div>
          </div>

          <div className="md:col-span-7 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-[#171936] uppercase tracking-wider border-b border-gray-100 pb-3">
              Send a Message
            </h3>

            {submitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>Thank you! Your message has been routed to our customer support lead.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-[#4F24E8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Email or Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. 01711223344 or email@domain.com"
                    className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-[#4F24E8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Inquiry / Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist you with our products or partner portal?"
                    className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-[#4F24E8]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-[#4F24E8] text-white font-bold hover:bg-[#431ec9] transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
