'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Truck,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Smartphone,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { BANGLADESH_DISTRICTS } from '@/lib/bangladesh';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    clearCart,
    subtotal,
    deliveryCharge,
    setDeliveryCharge,
    appliedCoupon,
    total,
    formatPriceAmount,
    user,
    t,
  } = useApp();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.email === 'customer@delied.com' ? '+8801812345678' : '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Dhaka');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('Banani');
  const [notes, setNotes] = useState('');

  // Payment method: COD, BKASH, NAGAD, SSLCOMMERZ
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BKASH' | 'NAGAD' | 'SSLCOMMERZ'>('COD');
  const [paymentTxId, setPaymentTxId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Update upazilas when district changes
  const currentDistrictObj = BANGLADESH_DISTRICTS.find(
    (d) => d.name.toLowerCase() === selectedDistrict.toLowerCase()
  ) || BANGLADESH_DISTRICTS[0];

  useEffect(() => {
    if (currentDistrictObj) {
      setDeliveryCharge(currentDistrictObj.deliveryCharge);
      if (currentDistrictObj.upazilas.length > 0) {
        setSelectedUpazila(currentDistrictObj.upazilas[0]);
      }
    }
  }, [selectedDistrict, setDeliveryCharge, currentDistrictObj]);

  if (cart.length === 0) {
    return (
      <div className="bg-[#FAF9FF] min-h-[60vh] flex items-center justify-center py-16">
        <div className="text-center space-y-4">
          <p className="text-gray-500 text-sm">Your shopping bag is empty.</p>
          <button
            onClick={() => router.push('/shop')}
            className="px-6 py-2.5 rounded-full bg-[#4F24E8] text-white text-xs font-bold"
          >
            Go to Shop
          </button>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !shippingAddress || !selectedDistrict) {
      setErrorMsg('Please complete all mandatory delivery fields.');
      return;
    }

    if ((paymentMethod === 'BKASH' || paymentMethod === 'NAGAD') && !paymentTxId) {
      setErrorMsg(`Please enter your ${paymentMethod} TrxID / Transaction Reference.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const orderPayload = {
        customerName,
        customerPhone,
        customerEmail,
        shippingAddress,
        district: selectedDistrict,
        upazila: selectedUpazila,
        notes,
        paymentMethod,
        paymentTxId: paymentTxId || undefined,
        couponCode: appliedCoupon?.code,
        orderType: user?.role === 'RESELLER' ? 'RESELLER' : user?.role === 'WHOLESALE' ? 'WHOLESALE' : 'RETAIL',
        items: cart.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
          customResellerPrice: i.customResellerPrice,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      clearCart();
      router.push(`/order/${data.order.orderNumber}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while placing order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF9FF] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs uppercase font-bold tracking-widest text-[#4F24E8]">
            Secure Checkout
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-[#171936] mt-1">
            Complete Your Fashion Order
          </h1>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Details & Address & Payment (Col 1-8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Section 1: Customer Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h2 className="text-sm font-bold text-[#171936] uppercase tracking-wider border-b border-gray-100 pb-3">
                1. Customer Contact Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-[#4F24E8]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phone Number (Bangladesh) *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 01812345678"
                    className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-[#4F24E8]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Email Address (Optional for invoice)</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-[#4F24E8]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Delivery Address (Bangladesh Location Hierarchy) */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h2 className="text-sm font-bold text-[#171936] uppercase tracking-wider">
                  2. Bangladesh Shipping Address
                </h2>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  Steadfast / Pathao Courier
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Select District *</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 font-medium focus:outline-none focus:border-[#4F24E8]"
                  >
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name} ({d.bn}) — ৳{d.deliveryCharge} delivery
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Thana / Upazila *</label>
                  <select
                    value={selectedUpazila}
                    onChange={(e) => setSelectedUpazila(e.target.value)}
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
                  <label className="block font-bold text-gray-700 mb-1">
                    Detailed Street / House / Road Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="House number, road name, area landmark..."
                    className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-[#4F24E8]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Order Notes (Optional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Special delivery instructions, preferred timing, etc."
                    className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-[#4F24E8]"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Payment Method */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h2 className="text-sm font-bold text-[#171936] uppercase tracking-wider border-b border-gray-100 pb-3">
                3. Payment Gateway & Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-[#4F24E8] bg-[#F5F3FF] shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#171936]">Cash on Delivery (COD)</span>
                    <Truck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-gray-500 text-[11px] mt-1">
                    Pay securely in cash when parcel is handed over.
                  </p>
                </div>

                {/* bKash */}
                <div
                  onClick={() => setPaymentMethod('BKASH')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'BKASH'
                      ? 'border-[#4F24E8] bg-[#F5F3FF] shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-pink-700">bKash Instant Transfer</span>
                    <Smartphone className="w-4 h-4 text-pink-600" />
                  </div>
                  <p className="text-gray-500 text-[11px] mt-1">
                    Merchant Number: <strong className="text-gray-800">01811990011</strong>
                  </p>
                </div>

                {/* Nagad */}
                <div
                  onClick={() => setPaymentMethod('NAGAD')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'NAGAD'
                      ? 'border-[#4F24E8] bg-[#F5F3FF] shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-700">Nagad MFS Payment</span>
                    <Smartphone className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-gray-500 text-[11px] mt-1">
                    Merchant Number: <strong className="text-gray-800">01811990022</strong>
                  </p>
                </div>

                {/* SSLCommerz */}
                <div
                  onClick={() => setPaymentMethod('SSLCOMMERZ')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'SSLCOMMERZ'
                      ? 'border-[#4F24E8] bg-[#F5F3FF] shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-700">SSLCommerz Gateway</span>
                    <CreditCard className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-gray-500 text-[11px] mt-1">
                    Visa, Mastercard, Amex, City Bank, Brac Bank.
                  </p>
                </div>
              </div>

              {/* TrxID input for bKash or Nagad */}
              {(paymentMethod === 'BKASH' || paymentMethod === 'NAGAD') && (
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-2 text-xs">
                  <p className="text-gray-700 leading-relaxed">
                    Please send <strong>{formatPriceAmount(total)}</strong> to official {paymentMethod} merchant number{' '}
                    <strong>{paymentMethod === 'BKASH' ? '01811990011' : '01811990022'}</strong> and enter the Transaction ID below:
                  </p>
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      {paymentMethod} TrxID / Transaction Reference *
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentTxId}
                      onChange={(e) => setPaymentTxId(e.target.value.toUpperCase())}
                      placeholder="e.g. BKH9827364102"
                      className="w-full bg-white border border-gray-300 rounded-lg p-2 font-mono uppercase focus:outline-none focus:border-[#4F24E8]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Summary (Col 9-12) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h2 className="font-bold text-sm text-[#171936] uppercase tracking-wider border-b border-gray-100 pb-3">
                Order Items ({cart.length})
              </h2>

              <div className="space-y-3 max-h-72 overflow-y-auto divide-y divide-gray-50 text-xs">
                {cart.map((item, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt="" className="w-10 h-12 object-cover rounded bg-gray-50" />
                      <div>
                        <h4 className="font-bold text-[#171936] line-clamp-1">{item.name}</h4>
                        <span className="text-gray-400">Qty: {item.quantity} | {item.size}</span>
                      </div>
                    </div>
                    <span className="font-bold text-[#171936]">
                      {formatPriceAmount((item.customResellerPrice || item.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Math */}
              <div className="border-t border-gray-100 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#171936]">{formatPriceAmount(subtotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>- {formatPriceAmount(appliedCoupon.calculatedDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery ({selectedDistrict})</span>
                  <span className="font-semibold text-[#171936]">{formatPriceAmount(deliveryCharge)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-extrabold text-[#171936]">
                  <span>Grand Total</span>
                  <span className="text-[#4F24E8]">{formatPriceAmount(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-full bg-[#4F24E8] hover:bg-[#431ec9] text-white font-bold text-sm shadow-xl shadow-purple-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Securing Order...</span>
                ) : (
                  <>
                    <span>Confirm & Place Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>SSL Encrypted Checkout • Verified Bangladesh Deliveries</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
