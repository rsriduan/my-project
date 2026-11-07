import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#FAF9FF] min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#4F24E8]">
            Legal & Security
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-[#171936]">
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-xs">Commitment to customer data confidentiality</p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm space-y-6 text-xs text-gray-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-bold text-sm text-[#171936] uppercase tracking-wider">
              1. Information Collection
            </h2>
            <p>
              DELIED collects personal customer details strictly necessary for order fulfillment, including recipient name, delivery address within Bangladesh, phone number, and transaction references.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-sm text-[#171936] uppercase tracking-wider">
              2. Data Protection & RBAC Access Control
            </h2>
            <p>
              In accordance with our strict Role-Based Access Control (RBAC), only authorized personnel can access customer orders. Passwords are cryptographically salted and hashed using bcrypt. Financial credentials are never stored on our plain servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-sm text-[#171936] uppercase tracking-wider">
              3. Reseller & Partner Confidentiality
            </h2>
            <p>
              Client lists maintained by resellers are sequestered within their own protected profiles and never exposed to other resellers or unauthorized third parties.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
