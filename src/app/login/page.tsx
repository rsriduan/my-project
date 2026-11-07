'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Mail,
  ShieldCheck,
  User,
  Users,
  Briefcase,
  Layers,
  Sparkles,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Headset,
  PieChart,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

const DEMO_ROLES = [
  { role: 'ADMIN', title: 'Super Admin', email: 'admin@delied.com', icon: ShieldCheck, color: 'bg-red-50 text-red-700 border-red-200' },
  { role: 'CUSTOMER', title: 'Retail Customer', email: 'customer@delied.com', icon: User, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { role: 'RESELLER', title: 'Fashion Reseller', email: 'reseller@delied.com', icon: Users, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { role: 'WHOLESALE', title: 'Wholesale Buyer', email: 'wholesale@delied.com', icon: Briefcase, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { role: 'STAFF', title: 'Company Staff (ERP)', email: 'staff@delied.com', icon: Layers, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { role: 'SHAREHOLDER', title: 'Shareholder', email: 'shareholder@delied.com', icon: PieChart, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { role: 'MODERATOR', title: 'Support Moderator', email: 'moderator@delied.com', icon: Headset, color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { role: 'MARKETER', title: 'Growth Marketer', email: 'marketer@delied.com', icon: TrendingUp, color: 'bg-rose-50 text-rose-700 border-rose-200' },
];

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const executeLogin = async (payload: { email?: string; password?: string; demoRole?: string }) => {
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate');
      }

      setUser(data.user);

      // Route to role's dashboard
      switch (data.user.role) {
        case 'ADMIN':
          router.push('/dashboard/admin');
          break;
        case 'RESELLER':
          router.push('/dashboard/reseller');
          break;
        case 'WHOLESALE':
          router.push('/dashboard/wholesale');
          break;
        case 'STAFF':
          router.push('/dashboard/staff');
          break;
        case 'SHAREHOLDER':
          router.push('/dashboard/shareholder');
          break;
        case 'MODERATOR':
          router.push('/dashboard/moderator');
          break;
        case 'MARKETER':
          router.push('/dashboard/marketer');
          break;
        case 'CUSTOMER':
        default:
          router.push('/dashboard/customer');
          break;
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLogin({ email, password });
  };

  const handleDemoClick = (role: string) => {
    executeLogin({ demoRole: role });
  };

  return (
    <div className="bg-[#FAF9FF] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#4F24E8]">
            DELIED Unified Access
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#171936]">
            Sign In to Your Account
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            Access your personalized role dashboard with enterprise RBAC security
          </p>
        </div>

        {errorMsg && (
          <div className="max-w-md mx-auto p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Standard Credentials Login (Col 1-5) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-[#171936] uppercase tracking-wider border-b border-gray-100 pb-3">
              Standard Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. admin@delied.com"
                    className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg py-2.5 pl-9 pr-3 focus:outline-none focus:border-[#4F24E8]"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg py-2.5 pl-9 pr-3 focus:outline-none focus:border-[#4F24E8]"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-[#171936] hover:bg-[#4F24E8] text-white font-bold text-xs shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-gray-500">
              <span>New to DELIED? </span>
              <Link href="/register" className="text-[#4F24E8] font-bold hover:underline">
                Register as Customer or Partner
              </Link>
            </div>
          </div>

          {/* Right: Instant One-Click Demo Role Selector (Col 6-12) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#171936] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Instant Demo Login (All 8 Roles)
                </h2>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Click any role card below to test its exact dashboard & permission scope:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {DEMO_ROLES.map((r) => {
                const IconComponent = r.icon;
                return (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => handleDemoClick(r.role)}
                    disabled={loading}
                    className={`p-3.5 rounded-xl border text-left transition-all hover:scale-[1.02] flex items-center gap-3 ${r.color}`}
                  >
                    <div className="p-2 rounded-lg bg-white shadow-sm flex-shrink-0">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold leading-tight">{r.title}</h4>
                      <p className="text-[10px] opacity-75 truncate">{r.email}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 text-[11px] text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100">
              💡 <strong>Evaluation Note:</strong> All demo accounts have password pre-set to <code className="bg-white px-1.5 py-0.5 rounded border">delied123</code>. You can also sign in manually using the left form.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
