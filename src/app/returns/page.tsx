import React from 'react';
import Link from 'next/link';
import { RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ReturnsPolicyPage() {
  return (
    <div className="bg-[#FAF9FF] min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#4F24E8]">
            Customer Assurance
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-[#171936]">
            Return & Refund Policy
          </h1>
          <p className="text-gray-500 text-xs">Last updated: January 2026</p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm space-y-6 text-xs text-gray-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-bold text-sm text-[#171936] uppercase tracking-wider">
              1. 7-Day Exchange & Return Eligibility
            </h2>
            <p>
              We want you to feel entirely confident in every DELIED garment. If you are unsatisfied with sizing, fit, or color, you may request an exchange or return within 7 calendar days of delivery.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Item must be unworn, unwashed, and in its original pristine condition.</li>
              <li>All original DELIED brand tags, barcodes, and packaging must remain intact.</li>
              <li>Proof of purchase (Order Number or SMS invoice confirmation) must be provided.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-sm text-[#171936] uppercase tracking-wider">
              2. Reverse Courier Pickup Service
            </h2>
            <p>
              We provide reverse pickup via Steadfast and Pathao across all 64 districts in Bangladesh. Once your return ticket is approved by our moderator, a courier agent will arrive to collect the item.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-sm text-[#171936] uppercase tracking-wider">
              3. Refund Disbursement
            </h2>
            <p>
              Refunds for eligible returned orders are processed within 3 to 5 business days after warehouse quality inspection. Refunds are disbursed via bKash, Nagad, or original bank card.
            </p>
          </section>

          <div className="pt-4 border-t border-gray-100 text-center">
            <Link
              href="/dashboard/customer"
              className="inline-block px-6 py-2.5 rounded-full bg-[#4F24E8] text-white font-bold hover:bg-[#431ec9]"
            >
              Open Exchange Ticket
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
