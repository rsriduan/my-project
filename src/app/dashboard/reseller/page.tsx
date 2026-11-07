'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Wallet,
  TrendingUp,
  Package,
  Share2,
  DollarSign,
  ArrowDownToLine,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Percent,
  Clock,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { calculateResellerProfit } from '@/lib/pricing-engine';

export default function ResellerDashboard() {
  const { user, formatPriceAmount, addToCart } = useApp();

  const [activeTab, setActiveTab] = useState<'catalog' | 'wallet' | 'orders' | 'share'>('catalog');
  const [products, setProducts] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Custom price setter state per product
  const [customPrices, setCustomPrices] = useState<Record<string, number>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  // Withdrawal form
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('BKASH');
  const [withdrawDetails, setWithdrawDetails] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);

  const fetchResellerData = async () => {
    try {
      setLoading(true);
      const [prodRes, walletRes, ordersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/reseller/wallet'),
        fetch('/api/orders'),
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.products || []);
        // Initialize default custom price to suggested retail price
        const initialPrices: Record<string, number> = {};
        prodData.products?.forEach((p: any) => {
          initialPrices[p.id] = p.suggestedRetailPrice || p.discountPrice || p.regularPrice;
        });
        setCustomPrices(initialPrices);
      }

      if (walletRes.ok) {
        const wallData = await walletRes.json();
        setWallet(wallData.wallet || null);
        if (wallData.wallet?.payoutMethods?.bkashNumber) {
          setWithdrawDetails(`bKash: ${wallData.wallet.payoutMethods.bkashNumber}`);
        }
      }

      if (ordersRes.ok) {
        const ordData = await ordersRes.json();
        setOrders(ordData.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResellerData();
  }, []);

  const handlePriceChange = (productId: string, val: number) => {
    setCustomPrices((prev) => ({ ...prev, [productId]: val }));
  };

  const handleDispatchOrder = (product: any) => {
    const customPrice = customPrices[product.id] || product.suggestedRetailPrice;
    let images: string[] = [];
    try {
      images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
    } catch (e) {}

    addToCart({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: product.resellerPrice,
      customResellerPrice: customPrice,
      quantity: 1,
      image: images[0] || 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800',
      size: 'M',
    });

    window.location.href = '/checkout';
  };

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || !withdrawDetails) return;

    setIsSubmittingWithdraw(true);
    setWithdrawError('');
    setWithdrawSuccess('');

    try {
      const res = await fetch('/api/reseller/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(withdrawAmount),
          method: withdrawMethod,
          paymentDetails: withdrawDetails,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit withdrawal');
      }

      setWithdrawSuccess(`Withdrawal request of ৳${withdrawAmount} submitted! Admin will disburse via ${withdrawMethod}.`);
      setWithdrawAmount('');
      fetchResellerData();
    } catch (err: any) {
      setWithdrawError(err.message || 'Error submitting request');
    } finally {
      setIsSubmittingWithdraw(false);
    }
  };

  const handleCopyReferral = () => {
    const link = `${window.location.origin}/shop?ref=RESELLER_${user?.userId?.slice(0, 8)}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="bg-[#FAF9FF] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Reseller Header & Metrics */}
        <div className="bg-[#171936] text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Verified Reseller Partner
                </span>
                <span className="text-xs text-emerald-400 font-semibold">● Active Account</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {user?.name || 'Sumaiya Akter'} — Fashion Boutique Hub
              </h1>
              <p className="text-xs text-gray-400">
                Reseller ID: RES-{user?.userId ? user.userId.slice(0, 8).toUpperCase() : 'DEL-8821'} | 15% Base Margin Tier
              </p>
            </div>

            <button
              onClick={handleCopyReferral}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 flex items-center gap-2 transition-all"
            >
              <Copy className="w-3.5 h-3.5 text-purple-300" />
              <span>{copiedLink ? 'Link Copied!' : 'Copy Boutique Storefront Link'}</span>
            </button>
          </div>

          {/* 4 KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-gray-400 font-medium">Withdrawable Wallet Balance</span>
              <h3 className="text-2xl font-black text-emerald-400">
                ৳{(wallet?.balance || 14500).toLocaleString()}
              </h3>
              <p className="text-[10px] text-gray-400">Available for instant bKash / Bank payout</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-gray-400 font-medium">Total Lifetime Profit Earned</span>
              <h3 className="text-2xl font-black text-purple-300">
                ৳{(wallet?.totalEarned || 38200).toLocaleString()}
              </h3>
              <p className="text-[10px] text-gray-400">Cumulative margin from delivered orders</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-gray-400 font-medium">Total Withdrawn</span>
              <h3 className="text-2xl font-black text-amber-300">
                ৳{(wallet?.totalWithdrawn || 23700).toLocaleString()}
              </h3>
              <p className="text-[10px] text-gray-400">Successfully disbursed to bKash / Bank</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-gray-400 font-medium">Client Orders Dispatched</span>
              <h3 className="text-2xl font-black text-blue-300">
                {orders.length > 0 ? orders.length : 18} Orders
              </h3>
              <p className="text-[10px] text-gray-400">Fulfilled across Dhaka & Chittagong</p>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-5 py-2.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'catalog'
                ? 'bg-[#4F24E8] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Catalog & Custom Price Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-5 py-2.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'wallet'
                ? 'bg-[#4F24E8] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Wallet & Withdraw Requests</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-[#4F24E8] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Reseller Client Orders ({orders.length})</span>
          </button>
        </div>

        {/* Tab 1: Catalog with Real-time Pricing Engine */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 text-xs text-gray-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <strong className="text-[#171936]">Reseller Pricing Engine Rules:</strong> You purchase at Base Reseller Price. You can choose any customer selling price up to 130% of Suggested Retail Price. The system automatically computes your net profit and customer invoice.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const currentCustomPrice = customPrices[product.id] || product.suggestedRetailPrice;
                const calc = calculateResellerProfit(
                  {
                    regularPrice: product.regularPrice,
                    discountPrice: product.discountPrice,
                    resellerPrice: product.resellerPrice,
                    suggestedRetailPrice: product.suggestedRetailPrice,
                    wholesalePrice: product.wholesalePrice,
                    minWholesaleQty: product.minWholesaleQty,
                    productionCost: product.costing?.totalCost || 1000,
                  },
                  currentCustomPrice,
                  1
                );

                let images: string[] = [];
                try {
                  images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
                } catch (e) {}

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 mb-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={images[0] || 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#171936] text-white text-[10px] font-mono">
                          {product.sku}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-[#171936] line-clamp-1">{product.name}</h3>

                      {/* Prices comparison table */}
                      <div className="mt-3 bg-[#F5F3FF] p-3 rounded-xl space-y-1.5 text-xs">
                        <div className="flex justify-between text-gray-500">
                          <span>Base Reseller Price:</span>
                          <strong className="text-[#171936] font-mono">৳{product.resellerPrice.toLocaleString()}</strong>
                        </div>
                        <div className="flex justify-between text-gray-500">
                          <span>Suggested Retail:</span>
                          <span className="font-mono">৳{product.suggestedRetailPrice.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Interactive Custom Price Setter */}
                      <div className="mt-3 space-y-1">
                        <label className="block text-[11px] font-bold text-gray-700 uppercase">
                          Set Your Selling Price (৳):
                        </label>
                        <input
                          type="number"
                          min={product.resellerPrice}
                          max={Math.round(product.suggestedRetailPrice * 1.3)}
                          value={currentCustomPrice}
                          onChange={(e) => handlePriceChange(product.id, Number(e.target.value))}
                          className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs font-bold text-[#171936] focus:outline-none focus:border-[#4F24E8]"
                        />

                        {/* Calculated Net Profit Card */}
                        <div className="mt-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 flex justify-between items-center text-xs text-emerald-800">
                          <span className="font-semibold">Your Net Profit / Unit:</span>
                          <span className="font-black text-sm">
                            + ৳{calc.resellerProfitPerUnit.toLocaleString()} ({calc.resellerMarginPercentage}%)
                          </span>
                        </div>

                        {!calc.isValidPrice && (
                          <p className="text-[10px] text-rose-600 font-semibold">{calc.validationError}</p>
                        )}
                      </div>
                    </div>

                    {/* Dispatch Order for Customer */}
                    <button
                      onClick={() => handleDispatchOrder(product)}
                      disabled={!calc.isValidPrice}
                      className="w-full py-2.5 rounded-xl bg-[#4F24E8] hover:bg-[#431ec9] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
                    >
                      <DollarSign className="w-4 h-4 text-amber-300" />
                      <span>Dispatch for Client (Earn ৳{calc.resellerProfitPerUnit})</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Wallet & Withdrawals */}
        {activeTab === 'wallet' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Request Withdrawal Form (Col 1-5) */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-5">
              <h2 className="text-sm font-bold text-[#171936] uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
                <ArrowDownToLine className="w-4 h-4 text-[#4F24E8]" />
                <span>Submit Withdrawal Request</span>
              </h2>

              {withdrawSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{withdrawSuccess}</span>
                </div>
              )}

              {withdrawError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{withdrawError}</span>
                </div>
              )}

              <form onSubmit={handleWithdrawalSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Withdrawal Amount (৳) — Available: ৳{(wallet?.balance || 0).toLocaleString()}
                  </label>
                  <input
                    type="number"
                    required
                    min="500"
                    max={wallet?.balance || 50000}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Min ৳500"
                    className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 font-bold focus:outline-none focus:border-[#4F24E8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Disbursement Method</label>
                  <select
                    value={withdrawMethod}
                    onChange={(e) => setWithdrawMethod(e.target.value)}
                    className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 font-semibold focus:outline-none"
                  >
                    <option value="BKASH">bKash (Personal / Merchant)</option>
                    <option value="NAGAD">Nagad MFS</option>
                    <option value="BANK">Bank Electronic Fund Transfer (BEFTN)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Account Details / Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={withdrawDetails}
                    onChange={(e) => setWithdrawDetails(e.target.value)}
                    placeholder="e.g. bKash: 01912345678 or City Bank A/C: 1102938472910"
                    className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-[#4F24E8]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingWithdraw}
                  className="w-full py-3 rounded-full bg-[#4F24E8] hover:bg-[#431ec9] text-white font-bold text-xs shadow-md transition-colors disabled:opacity-50"
                >
                  {isSubmittingWithdraw ? 'Submitting...' : 'Request Payout'}
                </button>
              </form>
            </div>

            {/* Right: Wallet Transaction & Withdrawal History (Col 6-12) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-[#171936] uppercase tracking-wider border-b border-gray-100 pb-3">
                Wallet Ledger & Payout History
              </h2>

              <div className="space-y-3 max-h-96 overflow-y-auto divide-y divide-gray-100 text-xs">
                {wallet?.withdrawals?.length === 0 && wallet?.transactions?.length === 0 ? (
                  <p className="text-gray-400 py-4 text-center">No transaction records yet.</p>
                ) : (
                  <>
                    {wallet?.withdrawals?.map((w: any) => (
                      <div key={w.id} className="pt-2 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-rose-700">Withdrawal ({w.method})</span>
                          <p className="text-[10px] text-gray-400">{w.paymentDetails}</p>
                          <span className="text-[9px] text-gray-400">
                            {new Date(w.createdAt).toLocaleDateString('en-GB')}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-sm text-rose-600 font-mono">
                            - ৳{w.amount.toLocaleString()}
                          </span>
                          <span className="block text-[10px] uppercase font-bold text-amber-600">
                            {w.status}
                          </span>
                        </div>
                      </div>
                    ))}

                    {wallet?.transactions?.map((tx: any) => (
                      <div key={tx.id} className="pt-2 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-emerald-700">{tx.note || 'Profit Credited'}</span>
                          <p className="text-[10px] text-gray-400">Ref: {tx.reference || 'Order'}</p>
                        </div>
                        <span className="font-bold text-sm text-emerald-600 font-mono">
                          + ৳{tx.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Reseller Orders */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-[#171936] uppercase tracking-wider border-b border-gray-100 pb-3">
              Orders Dispatched on Your Behalf
            </h2>

            {orders.length === 0 ? (
              <p className="text-gray-400 text-xs py-8 text-center">
                No orders dispatched yet. Browse catalog and click &ldquo;Dispatch for Client&rdquo;.
              </p>
            ) : (
              <div className="divide-y divide-gray-100 text-xs">
                {orders.map((o) => (
                  <div key={o.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#171936]">{o.orderNumber}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-50 text-[#4F24E8]">
                          {o.status}
                        </span>
                      </div>
                      <p className="text-gray-700 font-semibold mt-1">Client: {o.customerName} ({o.district})</p>
                      <p className="text-gray-400 text-[11px]">Courier: {o.deliveryCourier || 'Steadfast'}</p>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-xs text-gray-500">Customer Invoice Total: </span>
                      <strong className="text-sm text-[#171936] font-mono">৳{o.totalAmount.toLocaleString()}</strong>
                      <span className="block text-xs font-bold text-emerald-600">
                        Your Net Profit: + ৳{(o.resellerProfit || 800).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
