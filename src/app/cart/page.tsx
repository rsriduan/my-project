'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, ArrowRight, ShoppingBag, Tag, Check, AlertCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    deliveryCharge,
    setDeliveryCharge,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    total,
    formatPriceAmount,
    t,
    language,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    setCouponMsg(null);
    const res = await applyCoupon(couponInput.trim());
    setCouponMsg({ text: res.message, success: res.success });
    setIsApplying(false);
    if (res.success) setCouponInput('');
  };

  if (cart.length === 0) {
    return (
      <div className="bg-[#FAF9FF] min-h-[70vh] flex items-center justify-center py-16">
        <div className="max-w-md mx-auto text-center px-4 space-y-5">
          <div className="w-20 h-20 rounded-full bg-purple-100 text-[#4F24E8] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#171936]">
            {t.cartEmpty}
          </h2>
          <p className="text-gray-500 text-sm">
            Explore our handcrafted panjabis, sarees, and winter jackets to begin your luxury wardrobe.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4F24E8] text-white text-sm font-bold shadow-lg hover:bg-[#431ec9] transition-all"
          >
            <span>{t.continueShopping}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9FF] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs uppercase font-bold tracking-widest text-[#4F24E8]">
            Review & Checkout
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-[#171936] mt-1">
            {t.shoppingCart} ({cart.length} unique items)
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Items List (Col 1-8) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
              {cart.map((item, idx) => (
                <div key={idx} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-xl bg-gray-50 flex-shrink-0"
                  />

                  <div className="flex-1 space-y-1 text-center sm:text-left">
                    <span className="text-[10px] font-mono text-gray-400">SKU: {item.sku}</span>
                    <h3 className="text-sm font-bold text-[#171936]">{item.name}</h3>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-gray-500">
                      {item.size && <span>Size: <strong className="text-gray-800">{item.size}</strong></span>}
                      {item.color && <span>• Color: <strong className="text-gray-800">{item.color}</strong></span>}
                    </div>
                    <div className="text-sm font-extrabold text-[#4F24E8] pt-1">
                      {formatPriceAmount(item.customResellerPrice || item.price)}
                    </div>
                  </div>

                  {/* Quantity +/- */}
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size, item.color)}
                      className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-[#171936]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size, item.color)}
                      className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 font-bold text-xs"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right min-w-[90px]">
                    <span className="text-sm font-extrabold text-[#171936]">
                      {formatPriceAmount((item.customResellerPrice || item.price) * item.quantity)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.productId, item.size, item.color)}
                    className="p-2 text-gray-400 hover:text-rose-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center px-2">
              <Link
                href="/shop"
                className="text-xs font-semibold text-[#4F24E8] hover:underline"
              >
                ← {t.continueShopping}
              </Link>
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-rose-600 hover:underline"
              >
                Clear Entire Bag
              </button>
            </div>
          </div>

          {/* Order Summary & Coupon (Col 9-12) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="font-bold text-base text-[#171936] border-b border-gray-100 pb-3">
                Order Summary
              </h2>

              {/* Delivery Zone Selector */}
              <div>
                <label className="block text-xs font-bold text-[#171936] mb-2 uppercase tracking-wider">
                  Select Delivery Zone
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setDeliveryCharge(60)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      deliveryCharge === 60
                        ? 'border-[#4F24E8] bg-[#F5F3FF] text-[#4F24E8] font-bold'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>Inside Dhaka</span>
                    <strong className="block text-xs mt-0.5">৳60</strong>
                  </button>
                  <button
                    onClick={() => setDeliveryCharge(120)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      deliveryCharge === 120
                        ? 'border-[#4F24E8] bg-[#F5F3FF] text-[#4F24E8] font-bold'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>Outside Dhaka</span>
                    <strong className="block text-xs mt-0.5">৳120</strong>
                  </button>
                </div>
              </div>

              {/* Coupon Form */}
              <div className="pt-2 border-t border-gray-100">
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="block text-xs font-bold text-[#171936] uppercase tracking-wider">
                    Discount Coupon
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. DELIED10, EID2026"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-[#F5F3FF] border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono uppercase focus:outline-none focus:border-[#4F24E8]"
                    />
                    <button
                      type="submit"
                      disabled={isApplying || !couponInput.trim()}
                      className="px-4 py-2 bg-[#171936] hover:bg-[#4F24E8] text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                </form>

                {couponMsg && (
                  <div
                    className={`mt-2 p-2 rounded-lg text-xs flex items-center gap-1.5 ${
                      couponMsg.success
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {couponMsg.success ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    <span>{couponMsg.text}</span>
                  </div>
                )}

                {appliedCoupon && (
                  <div className="mt-2 p-2.5 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#4F24E8]">{appliedCoupon.code}</span>
                      <span className="text-gray-500 ml-1">
                        (-{formatPriceAmount(appliedCoupon.calculatedDiscount)})
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-rose-600 hover:underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Calculations Breakdown */}
              <div className="border-t border-gray-100 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>{t.subtotal}</span>
                  <span className="font-semibold text-[#171936]">{formatPriceAmount(subtotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>{t.discount} ({appliedCoupon.code})</span>
                    <span>- {formatPriceAmount(appliedCoupon.calculatedDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>{t.deliveryCharge}</span>
                  <span className="font-semibold text-[#171936]">{formatPriceAmount(deliveryCharge)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-extrabold text-[#171936]">
                  <span>{t.total}</span>
                  <span className="text-[#4F24E8]">{formatPriceAmount(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => router.push('/checkout')}
                className="w-full py-3.5 px-6 rounded-full bg-[#4F24E8] hover:bg-[#431ec9] text-white font-bold text-sm shadow-xl shadow-purple-900/30 transition-all flex items-center justify-center gap-2"
              >
                <span>{t.proceedCheckout}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
