import React from 'react';
import Link from 'next/link';
import { Truck, MapPin, Clock } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[#FAF9FF] min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#4F24E8]">
            Nationwide Logistics
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-[#171936]">
            Shipping & Delivery Policy
          </h1>
          <p className="text-gray-500 text-xs">Delivering across all 64 districts in Bangladesh</p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm space-y-6 text-xs text-gray-700 leading-relaxed">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 space-y-1">
              <span className="font-bold text-[#4F24E8] text-sm">Inside Dhaka Metro</span>
              <p className="text-gray-600">Delivery Fee: <strong>৳60</strong> (FREE on orders over ৳2,000)</p>
              <p className="text-gray-500">Estimated Arrival: 24 to 48 Hours</p>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-1">
              <span className="font-bold text-blue-800 text-sm">Outside Dhaka (All 64 Districts)</span>
              <p className="text-gray-600">Delivery Fee: <strong>৳120</strong> standard courier charge</p>
              <p className="text-gray-500">Estimated Arrival: 48 to 72 Hours</p>
            </div>
          </div>

          <section className="space-y-2 pt-2">
            <h2 className="font-bold text-sm text-[#171936] uppercase tracking-wider">
              Logistics Courier Partners
            </h2>
            <p>
              DELIED partners with top-tier courier networks including Steadfast Courier, Pathao Parcel, and RedX to ensure secure handling, real-time OTP verification, and doorstep delivery.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-sm text-[#171936] uppercase tracking-wider">
              Wholesale Bulk Freight
            </h2>
            <p>
              For wholesale bulk shipments exceeding 100 pieces, DELIED coordinates direct factory dispatch via dedicated pallet transport or Sundarban Courier hub cargo.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
