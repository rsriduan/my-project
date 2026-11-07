'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Tag,
  Share2,
  DollarSign,
  Copy,
  Plus,
  CheckCircle2,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function MarketerPage() {
  const { user, formatPriceAmount } = useApp();

  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New campaign modal
  const [showModal, setShowModal] = useState(false);
  const [campName, setCampName] = useState('');
  const [campCode, setCampCode] = useState('');
  const [campChannel, setCampChannel] = useState('FACEBOOK');
  const [campBudget, setCampBudget] = useState('20000');
  const [campRate, setCampRate] = useState('6.5');
  const [createSuccess, setCreateSuccess] = useState('');

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/marketer/campaigns');
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCopyLink = (code: string) => {
    const link = `${window.location.origin}/shop?campaign=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName || !campCode) return;

    try {
      const res = await fetch('/api/marketer/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: campName,
          code: campCode,
          channel: campChannel,
          budget: parseFloat(campBudget),
          commissionRate: parseFloat(campRate),
        }),
      });

      if (res.ok) {
        setCreateSuccess('Campaign activated and tracking URL generated!');
        setTimeout(() => setCreateSuccess(''), 3000);
        setShowModal(false);
        setCampName('');
        setCampCode('');
        fetchCampaigns();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-[#FAF9FF] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Marketer Header */}
        <div className="bg-[#171936] text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Growth & Affiliate Partner
                </span>
                <span className="text-xs text-emerald-400 font-semibold">● Active Tracking</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {user?.name || 'Arif Hossain'} — Marketing Portal
              </h1>
              <p className="text-xs text-gray-400">
                Primary Affiliate Code: <strong className="text-white font-mono">ARIF_DELIED</strong> | Baseline Commission: 6.5%
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 rounded-full bg-[#4F24E8] hover:bg-[#431ec9] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Create Campaign Link</span>
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-gray-400 font-medium">Attributed Sales Revenue</span>
              <h3 className="text-2xl font-black text-emerald-400 font-mono">৳5,37,500</h3>
              <p className="text-[10px] text-gray-400">Tracked via affiliate UTM links</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-gray-400 font-medium">Total Earned Commission</span>
              <h3 className="text-2xl font-black text-purple-300 font-mono">৳34,937</h3>
              <p className="text-[10px] text-gray-400">At 6.5% standard commission rate</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-gray-400 font-medium">Unique Ad Clicks</span>
              <h3 className="text-2xl font-black text-blue-300 font-mono">4,820</h3>
              <p className="text-[10px] text-gray-400">Across social channels</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-gray-400 font-medium">Converted Orders</span>
              <h3 className="text-2xl font-black text-amber-300 font-mono">215 Orders</h3>
              <p className="text-[10px] text-gray-400">4.46% conversion rate</p>
            </div>
          </div>
        </div>

        {createSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{createSuccess}</span>
          </div>
        )}

        {/* Create Campaign Modal */}
        {showModal && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#4F24E8] shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-[#171936]">Create New Tracking Campaign</h3>
              <button onClick={() => setShowModal(false)} className="text-xs font-bold text-gray-400 hover:text-gray-700">
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  placeholder="e.g. Eid Mega Collection Launch"
                  className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Campaign Referral Code *</label>
                <input
                  type="text"
                  required
                  value={campCode}
                  onChange={(e) => setCampCode(e.target.value.toUpperCase().replace(/\s+/g, '_'))}
                  placeholder="e.g. EID2026_FASHION"
                  className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 font-mono uppercase focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Marketing Channel</label>
                <select
                  value={campChannel}
                  onChange={(e) => setCampChannel(e.target.value)}
                  className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 font-bold focus:outline-none"
                >
                  <option value="FACEBOOK">Facebook Ads / Reels</option>
                  <option value="INSTAGRAM">Instagram Influencer</option>
                  <option value="TIKTOK">TikTok Creator</option>
                  <option value="GOOGLE">Google Search / Display</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Commission Rate (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={campRate}
                  onChange={(e) => setCampRate(e.target.value)}
                  className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 font-bold focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 pt-2 flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#4F24E8] text-white font-bold hover:bg-[#431ec9]"
                >
                  Save and Generate Link
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Campaigns Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-[#171936] uppercase tracking-wider border-b border-gray-100 pb-3">
            Active Campaigns & Attribution Performance
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#171936] text-white font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Campaign & Code</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4 text-center">Clicks</th>
                  <th className="py-3 px-4 text-center">Conversions</th>
                  <th className="py-3 px-4 text-right">Attributed Revenue</th>
                  <th className="py-3 px-4 text-right">Commission (6.5%)</th>
                  <th className="py-3 px-4 text-center">Tracking Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4">
                      <p className="font-bold text-[#171936]">{c.name}</p>
                      <span className="text-[10px] font-mono text-[#4F24E8] font-bold">{c.code}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-700">{c.channel}</td>
                    <td className="py-3 px-4 text-center font-mono">{c.clicks || 4820}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-emerald-700">
                      {c.conversions || 215}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#171936]">
                      ৳{(c.revenue || 537500).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-purple-700">
                      ৳{Math.round(((c.revenue || 537500) * c.commissionRate) / 100).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleCopyLink(c.code)}
                        className="px-3 py-1 rounded-full bg-[#F5F3FF] text-[#4F24E8] font-bold text-[10px] hover:bg-[#4F24E8] hover:text-white transition-colors"
                      >
                        {copiedCode === c.code ? 'Copied!' : 'Copy UTM Link'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
