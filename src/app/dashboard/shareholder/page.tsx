'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PieChart,
  FileText,
  DollarSign,
  TrendingUp,
  Download,
  ShieldCheck,
  Award,
  Bell,
  Calendar,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function ShareholderPage() {
  const { user, formatPriceAmount } = useApp();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/shareholder/reports')
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const profile = data?.profile || {
    totalShares: 75000,
    sharePercentage: 15.0,
    shareCertificateNo: 'SH-DEL-2024-003',
    nomineeName: 'Nasrin Sultana Huda',
    bankDetails: 'Eastern Bank PLC, Gulshan Branch',
    dividends: [
      {
        id: '1',
        fiscalYear: 'FY 2024-2025',
        amount: 150000,
        status: 'PAID',
        reference: 'DIV-2025-Q4-01',
        paymentDate: '2025-10-15',
      },
    ],
  };

  return (
    <div className="bg-[#FAF9FF] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Shareholder Header */}
        <div className="bg-[#171936] text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Registered Equity Shareholder
                </span>
                <span className="text-xs text-emerald-400 font-semibold">● Certificate: {profile.shareCertificateNo}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Syed Shamsul Huda — Investor Relations
              </h1>
              <p className="text-xs text-gray-400">
                Nominee: {profile.nomineeName} | Payout Bank: {profile.bankDetails}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-gray-400 font-medium">Allocated Equity Shares</span>
              <h3 className="text-2xl font-black text-amber-300 font-mono">
                {profile.totalShares.toLocaleString()}
              </h3>
              <p className="text-[10px] text-gray-400">Fully paid voting ordinary shares</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-gray-400 font-medium">Ownership Percentage</span>
              <h3 className="text-2xl font-black text-purple-300 font-mono">
                {profile.sharePercentage}%
              </h3>
              <p className="text-[10px] text-gray-400">Of 500,000 total company equity shares</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-gray-400 font-medium">Cumulative Dividends Received</span>
              <h3 className="text-2xl font-black text-emerald-400 font-mono">
                ৳1,50,000
              </h3>
              <p className="text-[10px] text-gray-400">Approved by AGM Board of Directors</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-gray-400 font-medium">Current Dividend Yield</span>
              <h3 className="text-2xl font-black text-blue-300 font-mono">
                14.2%
              </h3>
              <p className="text-[10px] text-gray-400">Annualized return on invested capital</p>
            </div>
          </div>
        </div>

        {/* Financial Statements & Documents */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Approved Financial Reports (Col 1-7) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-[#171936] uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#4F24E8]" />
              <span>Approved Audited Statements & Documents</span>
            </h2>

            <div className="space-y-3">
              {data?.documents?.map((doc: any) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#4F24E8]">
                      {doc.category}
                    </span>
                    <h4 className="font-bold text-[#171936] text-sm">{doc.title}</h4>
                    <p className="text-gray-500 text-[11px]">{doc.description}</p>
                    <span className="text-[10px] text-gray-400">
                      Published: {new Date(doc.publishedAt).toLocaleDateString('en-GB')}
                    </span>
                  </div>

                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Downloading official document: ${doc.title}`);
                    }}
                    className="p-2.5 rounded-xl bg-white border border-gray-200 text-[#171936] hover:bg-[#4F24E8] hover:text-white transition-colors flex-shrink-0"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Dividends & Announcements (Col 8-12) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Dividends */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-[#171936] uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Dividend History</span>
              </h2>

              <div className="space-y-3 text-xs">
                {profile.dividends?.map((div: any) => (
                  <div key={div.id} className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-[#171936]">{div.fiscalYear} Final Dividend</h4>
                      <span className="text-[10px] text-gray-500">Ref: {div.reference}</span>
                      <p className="text-[10px] text-gray-400">Disbursed on {div.paymentDate}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-base text-emerald-700 font-mono">
                        ৳{div.amount.toLocaleString()}
                      </span>
                      <span className="block text-[10px] font-bold text-emerald-600 uppercase">
                        {div.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Board Announcements */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-[#171936] uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Corporate Announcements</span>
              </h2>

              <div className="space-y-3 text-xs">
                {data?.announcements?.map((a: any) => (
                  <div key={a.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                    <h4 className="font-bold text-[#171936]">{a.title}</h4>
                    <p className="text-gray-600 text-[11px] leading-relaxed">{a.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
