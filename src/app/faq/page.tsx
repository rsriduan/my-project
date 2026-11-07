'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'What are the delivery charges and timelines across Bangladesh?',
    a: 'Inside Dhaka city, delivery is ৳60 (FREE on orders over ৳2,000) with a 24-48 hour delivery timeline. Outside Dhaka (all 64 districts including Chittagong, Sylhet, Rajshahi, Khulna), delivery charge is ৳120 via Steadfast and Pathao express courier taking 48-72 hours.'
  },
  {
    q: 'Can I exchange my garment if the size does not fit?',
    a: 'Yes! We offer a 7-day hassle-free size exchange policy. Keep the product tags and original packaging intact, and submit an exchange request through your Customer Dashboard or Live Support. Our courier will deliver the replacement and collect the original parcel.'
  },
  {
    q: 'What payment options are available on DELIED?',
    a: 'We accept Cash on Delivery (COD) nationwide, instant bKash and Nagad direct payments, and online Visa, MasterCard, and internet banking via our SSLCommerz payment gateway.'
  },
  {
    q: 'How does the DELIED Reseller program work?',
    a: 'Approved resellers can purchase products at discounted Base Reseller Prices, set their own permitted retail selling price, and dispatch directly to their customers with automated cash-on-delivery collection. When the parcel is delivered, net profit is instantly credited to your Reseller Wallet and withdrawable via bKash or Bank.'
  },
  {
    q: 'What are the wholesale bulk order requirements?',
    a: 'Our wholesale portal offers factory-tier bulk discounts of 25% to 35% with Minimum Order Quantities (MOQ) typically starting at 20 to 40 pieces per style with assorted size ratios. Verified corporate partners can also apply for credit limits and custom manufacturing runs.'
  }
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="bg-[#FAF9FF] min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#4F24E8]">
            Frequently Asked Questions
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#171936]">
            Everything You Need to Know
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            Answers regarding our products, delivery, reseller program, and wholesale ordering.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm divide-y divide-gray-100 space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="pt-4 first:pt-0">
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full text-left flex justify-between items-center py-2 text-sm font-bold text-[#171936] hover:text-[#4F24E8] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openIdx === idx ? 'rotate-180 text-[#4F24E8]' : 'text-gray-400'}`} />
              </button>
              {openIdx === idx && (
                <p className="text-xs text-gray-600 leading-relaxed pt-2 pb-1 animate-in fade-in duration-200">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
