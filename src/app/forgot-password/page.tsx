'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle2, Lock, ShieldCheck, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [step, setStep] = useState<'REQUEST' | 'OTP' | 'SUCCESS'>('REQUEST');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) return;
    setLoading(true);
    setErrorMsg('');

    // Simulate OTP dispatch via SMS or Email
    setTimeout(() => {
      setLoading(false);
      setStep('OTP');
    }, 800);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword) return;
    setLoading(true);
    setErrorMsg('');

    // Validate demo OTP or 6 digits
    if (otp !== '123456' && otp.length !== 6) {
      setLoading(false);
      setErrorMsg('Invalid verification code. For demo testing, use code: 123456');
      return;
    }

    setTimeout(() => {
      setLoading(false);
      setStep('SUCCESS');
    }, 800);
  };

  return (
    <div className="bg-[#FAF9FF] min-h-screen py-16">
      <div className="max-w-md mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#4F24E8]">
            DELIED Security
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-[#171936]">
            Password Recovery
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            Reset access to your customer or enterprise dashboard
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          {step === 'REQUEST' && (
            <form onSubmit={handleRequestOtp} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Registered Email Address or Phone Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="e.g. customer@delied.com or 01812345678"
                    className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg py-2.5 pl-9 pr-3 focus:outline-none focus:border-[#4F24E8]"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-[#4F24E8] hover:bg-[#431ec9] text-white font-bold text-xs shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Sending Code...' : 'Send Verification OTP'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-center text-xs text-gray-400 pt-2">
                <span>Remember your password? </span>
                <Link href="/login" className="text-[#4F24E8] font-bold hover:underline">
                  Sign In
                </Link>
              </div>
            </form>
          )}

          {step === 'OTP' && (
            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              <div className="p-3 bg-purple-50 rounded-xl text-purple-900 text-xs space-y-1">
                <p>We sent a 6-digit verification code to <strong>{emailOrPhone}</strong>.</p>
                <p className="text-[10px] text-purple-600">💡 Demo Verification Code: <strong>123456</strong></p>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Enter 6-Digit OTP *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 text-center font-mono font-bold tracking-widest text-base focus:outline-none focus:border-[#4F24E8]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Set New Password *</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password (min 6 characters)"
                    className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg py-2.5 pl-9 pr-3 focus:outline-none focus:border-[#4F24E8]"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-[#4F24E8] hover:bg-[#431ec9] text-white font-bold text-xs shadow-md transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating Password...' : 'Reset Password & Continue'}
              </button>
            </form>
          )}

          {step === 'SUCCESS' && (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#171936]">Password Reset Successful!</h3>
              <p className="text-xs text-gray-500">
                Your credentials have been securely updated. You can now sign in to your dashboard.
              </p>
              <Link
                href="/login"
                className="inline-block px-6 py-2.5 rounded-full bg-[#171936] text-white text-xs font-bold hover:bg-[#4F24E8] transition-colors"
              >
                Go to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
