import React from 'react';

export default function TermsPage() {
  return (
    <div className="bg-[#FAF9FF] min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#4F24E8]">
            Agreement & Governance
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-[#171936]">
            Terms & Conditions of Service
          </h1>
          <p className="text-gray-500 text-xs">Standard governing conditions for all DELIED platform users</p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm space-y-6 text-xs text-gray-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-bold text-sm text-[#171936] uppercase tracking-wider">
              1. Platform Scope
            </h2>
            <p>
              DELIED provides fashion e-commerce, boutique reseller facilitation, wholesale procurement, and enterprise management tools under the laws of the People&apos;s Republic of Bangladesh.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-sm text-[#171936] uppercase tracking-wider">
              2. Reseller Pricing Rules & Anti-Price Gouging
            </h2>
            <p>
              Resellers must abide by system pricing bounds. Selling prices below base reseller cost or above the permitted maximum retail ceiling (130% of suggested MSRP) are disallowed to maintain brand reputation and fair pricing.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-sm text-[#171936] uppercase tracking-wider">
              3. Wholesale Commitments & Order Confirmation
            </h2>
            <p>
              Wholesale bulk requisitions require administrative verification before factory manufacturing slots are scheduled. Credit terms are subject to formal trade agreement.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
