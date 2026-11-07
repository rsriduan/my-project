import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, HeartHandshake, Award, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-[#FAF9FF] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-[#4F24E8]">
            The DELIED Story
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-[#171936]">
            Crafting Luxury Fashion & Empowering Bangladeshi Enterprise
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Founded in Dhaka, DELIED bridges centuries-old handloom artisan heritage with world-class production management and ethical B2B enterprise technology.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm space-y-8 text-sm text-gray-700 leading-relaxed">
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#171936]">Our Heritage & Vision</h2>
            <p>
              Bangladesh possesses one of the world&apos;s greatest textile legacies — from ancient Muslin and intricate Dhakai Jamdani to contemporary high-density jacquard weaving. At DELIED, our master artisans craft garments with unmatched attention to detail, utilizing Egyptian combed cotton, organic dyes, and genuine mother-of-pearl buttons.
            </p>
            <p>
              Simultaneously, we recognize that fashion entrepreneurship in Bangladesh faces major challenges: lack of transparent costing, arbitrary wholesale minimums, and disconnected reseller management. DELIED was created as a unified platform where retail shoppers, independent boutique resellers, wholesale buyers, and factory supervisors operate through one single centralized database.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-100 text-center">
            <div className="space-y-2 p-4 rounded-2xl bg-[#F5F3FF]">
              <Sparkles className="w-8 h-8 text-[#4F24E8] mx-auto" />
              <h3 className="font-bold text-[#171936]">Artisan First</h3>
              <p className="text-xs text-gray-500">Fair compensation for our weavers and tailors in Narayanganj and Tangail.</p>
            </div>
            <div className="space-y-2 p-4 rounded-2xl bg-[#F5F3FF]">
              <HeartHandshake className="w-8 h-8 text-purple-600 mx-auto" />
              <h3 className="font-bold text-[#171936]">Reseller Empowerment</h3>
              <p className="text-xs text-gray-500">Zero-capital fashion entrepreneurship with transparent bKash profit disbursement.</p>
            </div>
            <div className="space-y-2 p-4 rounded-2xl bg-[#F5F3FF]">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-[#171936]">Enterprise Rigor</h3>
              <p className="text-xs text-gray-500">Real-time production costing ERP and audited shareholder transparency.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
