'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Users, Briefcase, AlertCircle, ArrowRight, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { BANGLADESH_DISTRICTS } from '@/lib/bangladesh';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useApp();

  const [role, setRole] = useState<'CUSTOMER' | 'RESELLER' | 'WHOLESALE'>('CUSTOMER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [tradeLicense, setTradeLicense] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [upazila, setUpazila] = useState('Banani');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const qRole = searchParams.get('role');
    if (qRole === 'RESELLER' || qRole === 'WHOLESALE' || qRole === 'CUSTOMER') {
      setRole(qRole);
    }
  }, [searchParams]);

  const currentDistrictObj = BANGLADESH_DISTRICTS.find(
    (d) => d.name.toLowerCase() === district.toLowerCase()
  ) || BANGLADESH_DISTRICTS[0];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          role,
          businessName,
          tradeLicense,
          district,
          upazila,
          address,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setUser(data.user);

      if (role === 'RESELLER') {
        router.push('/dashboard/reseller');
      } else if (role === 'WHOLESALE') {
        router.push('/dashboard/wholesale');
      } else {
        router.push('/dashboard/customer');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9FF] min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#4F24E8]">
            DELIED Ecosystem
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-[#171936]">
            Create Your Account
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            Join as a retail customer, registered boutique reseller, or wholesale bulk buyer
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 space-y-6">
          {/* Role Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171936] mb-2">
              Select Membership Type
            </label>
            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => setRole('CUSTOMER')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  role === 'CUSTOMER'
                    ? 'border-[#4F24E8] bg-[#F5F3FF] text-[#4F24E8] font-bold shadow-sm'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <User className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                <span>Retail Shopper</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('RESELLER')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  role === 'RESELLER'
                    ? 'border-[#4F24E8] bg-[#F5F3FF] text-[#4F24E8] font-bold shadow-sm'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Users className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                <span>Reseller Partner</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('WHOLESALE')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  role === 'WHOLESALE'
                    ? 'border-[#4F24E8] bg-[#F5F3FF] text-[#4F24E8] font-bold shadow-sm'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Briefcase className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                <span>Wholesale Buyer</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
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
                <label className="block font-bold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@domain.com"
                  className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-[#4F24E8]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Phone Number (Bangladesh) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 01711223344"
                  className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-[#4F24E8]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Create Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-[#4F24E8]"
                />
              </div>
            </div>

            {/* Business Specific Fields */}
            {(role === 'RESELLER' || role === 'WHOLESALE') && (
              <div className="pt-2 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-purple-900 mb-1">
                    {role === 'RESELLER' ? 'Boutique / Facebook Page Name' : 'Company / Trade Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder={role === 'RESELLER' ? "e.g. Dhaka Glamour Wardrobe" : "e.g. Bengal Garments Ltd"}
                    className="w-full bg-purple-50/50 border border-purple-200 rounded-lg p-2.5 focus:outline-none focus:border-[#4F24E8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-purple-900 mb-1">
                    Trade License / BIN (Optional)
                  </label>
                  <input
                    type="text"
                    value={tradeLicense}
                    onChange={(e) => setTradeLicense(e.target.value)}
                    placeholder="e.g. TRAD/DH/2026/091"
                    className="w-full bg-purple-50/50 border border-purple-200 rounded-lg p-2.5 focus:outline-none focus:border-[#4F24E8]"
                  />
                </div>
              </div>
            )}

            {/* Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              <div>
                <label className="block font-bold text-gray-700 mb-1">District *</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 font-medium focus:outline-none focus:border-[#4F24E8]"
                >
                  {BANGLADESH_DISTRICTS.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name} ({d.bn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Thana / Upazila</label>
                <select
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 font-medium focus:outline-none focus:border-[#4F24E8]"
                >
                  {currentDistrictObj.upazilas.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, house or office location"
                  className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-[#4F24E8]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#4F24E8] hover:bg-[#431ec9] text-white font-bold text-xs shadow-xl shadow-purple-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span>Already have an account? </span>
            <Link href="/login" className="text-[#4F24E8] font-bold hover:underline">
              Sign In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF9FF] flex items-center justify-center text-xs">Loading registration form...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
