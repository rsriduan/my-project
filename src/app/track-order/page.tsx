'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  AlertCircle,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

const STATUS_STEPS = [
  { key: 'PENDING', label: 'Order Placed', desc: 'Received and awaiting payment / confirmation' },
  { key: 'CONFIRMED', label: 'Confirmed', desc: 'Verified and queued for warehouse packaging' },
  { key: 'PROCESSING', label: 'Processing & QC', desc: 'Garment inspected, pressed and packed' },
  { key: 'READY_TO_SHIP', label: 'Ready to Dispatch', desc: 'Handed to logistics carrier hub' },
  { key: 'SHIPPED', label: 'Shipped (In Transit)', desc: 'On courier route to your delivery address' },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Successfully handed over to recipient' },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const { formatPriceAmount } = useApp();

  const [code, setCode] = useState(searchParams.get('code') || '');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchOrder = async (searchCode: string) => {
    if (!searchCode.trim()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/orders?orderNumber=${encodeURIComponent(searchCode.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Order not found');
      }
      setOrder(data.order);
    } catch (e: any) {
      setOrder(null);
      setErrorMsg(e.message || 'No matching order found. Please verify your order number.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialCode = searchParams.get('code');
    if (initialCode) {
      setCode(initialCode);
      fetchOrder(initialCode);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(code);
  };

  const getStepIndex = (status: string) => {
    const idx = STATUS_STEPS.findIndex((s) => s.key === status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="bg-[#FAF9FF] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Title & Lookup Form */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-purple-100 text-[#4F24E8] flex items-center justify-center mx-auto">
            <Truck className="w-7 h-7" />
          </div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#4F24E8]">
            Logistics & Delivery Tracking
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-[#171936]">
            Track Your Parcel in Real Time
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto">
            Enter your DELIED order number (e.g. <strong>DEL-2026-1001</strong>) to view courier status, dispatch history, and timeline.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-2 pt-2">
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. DEL-2026-1001"
              className="flex-1 bg-[#F5F3FF] border border-gray-200 rounded-full py-3 px-5 text-xs font-mono uppercase focus:outline-none focus:border-[#4F24E8] focus:bg-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-full bg-[#4F24E8] hover:bg-[#431ec9] text-white text-xs font-bold transition-all shadow-md disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {/* Quick Demo Code helper */}
          <div className="pt-2 text-[11px] text-gray-400">
            <span>Try demo codes: </span>
            <button
              onClick={() => {
                setCode('DEL-2026-1001');
                fetchOrder('DEL-2026-1001');
              }}
              className="font-mono text-[#4F24E8] hover:underline mx-1"
            >
              DEL-2026-1001 (Retail)
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setCode('DEL-2026-1002');
                fetchOrder('DEL-2026-1002');
              }}
              className="font-mono text-[#4F24E8] hover:underline mx-1"
            >
              DEL-2026-1002 (Reseller)
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Order Details & Stepper */}
        {order && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm space-y-8 animate-in fade-in duration-300">
            {/* Top Summary Banner */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#F5F3FF] p-5 rounded-2xl border border-purple-100 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#4F24E8]">
                  Order Number
                </span>
                <h3 className="text-xl font-extrabold text-[#171936] font-mono">{order.orderNumber}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-GB')}
                </p>
              </div>

              <div className="sm:text-right">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {order.status}
                </span>
                <p className="text-xs text-gray-600 mt-1">
                  Courier: <strong>{order.deliveryCourier || 'Steadfast Courier'}</strong>
                </p>
                {order.trackingNumber && (
                  <p className="text-xs text-[#4F24E8] font-mono">
                    Tracking #: <strong>{order.trackingNumber}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* Visual Stepper */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#171936] mb-6">
                Shipment Progression
              </h3>
              <div className="relative border-l-2 border-purple-200 ml-4 pl-6 space-y-6">
                {STATUS_STEPS.map((step, idx) => {
                  const currentIdx = getStepIndex(order.status);
                  const isDone = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={step.key} className="relative">
                      <span
                        className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 transition-all ${
                          isDone
                            ? 'bg-[#4F24E8] border-[#4F24E8]'
                            : 'bg-white border-gray-300'
                        }`}
                      ></span>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-xs font-bold ${
                              isDone ? 'text-[#171936]' : 'text-gray-400'
                            }`}
                          >
                            {step.label}
                          </h4>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#4F24E8] text-white">
                              Current Status
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Destination & Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-gray-100 text-xs">
              <div className="space-y-2">
                <h4 className="font-bold text-[#171936] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#4F24E8]" />
                  Delivery Address
                </h4>
                <p className="font-semibold text-gray-800">{order.customerName}</p>
                <p className="text-gray-600">{order.shippingAddress}</p>
                <p className="text-gray-600">{order.upazila ? `${order.upazila}, ` : ''}{order.district}</p>
                <p className="text-gray-600">Phone: {order.customerPhone}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#171936] uppercase tracking-wider flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#4F24E8]" />
                  Items in Parcel ({order.items.length})
                </h4>
                <div className="divide-y divide-gray-100">
                  {order.items.map((i: any) => (
                    <div key={i.id} className="py-1.5 flex justify-between">
                      <span className="text-gray-700">
                        {i.quantity}x {i.productName} ({i.size})
                      </span>
                      <strong className="text-[#171936]">
                        {formatPriceAmount(i.total)}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF9FF] flex items-center justify-center text-xs">Loading order tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
