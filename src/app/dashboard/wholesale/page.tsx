'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Package,
  Layers,
  FileText,
  Truck,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { calculateWholesalePricing } from '@/lib/pricing-engine';

export default function WholesaleDashboard() {
  const { user, formatPriceAmount, addToCart } = useApp();

  const [activeTab, setActiveTab] = useState<'catalog' | 'orders' | 'invoices'>('catalog');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Bulk order quantity picker per product
  const [bulkQuantities, setBulkQuantities] = useState<Record<string, number>>({});
  const [tier, setTier] = useState<'TIER_1' | 'TIER_2' | 'TIER_3'>('TIER_1');

  useEffect(() => {
    const fetchWholesaleData = async () => {
      try {
        setLoading(true);
        const [prodRes, ordRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders'),
        ]);

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData.products || []);
          const initialQtys: Record<string, number> = {};
          prodData.products?.forEach((p: any) => {
            initialQtys[p.id] = p.minWholesaleQty || 25;
          });
          setBulkQuantities(initialQtys);
        }

        if (ordRes.ok) {
          const ordData = await ordRes.json();
          setOrders(ordData.orders || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchWholesaleData();
  }, []);

  const handleQtyChange = (productId: string, val: number) => {
    setBulkQuantities((prev) => ({ ...prev, [productId]: Math.max(1, val) }));
  };

  const handleAddBulkToCart = (product: any) => {
    const qty = bulkQuantities[product.id] || product.minWholesaleQty || 25;
    const pricing = calculateWholesalePricing(
      {
        regularPrice: product.regularPrice,
        discountPrice: product.discountPrice,
        resellerPrice: product.resellerPrice,
        suggestedRetailPrice: product.suggestedRetailPrice,
        wholesalePrice: product.wholesalePrice,
        minWholesaleQty: product.minWholesaleQty,
        productionCost: 1000,
      },
      qty,
      tier
    );

    if (!pricing.isMoqSatisfied) {
      alert(`Minimum order quantity for this item is ${pricing.minOrderQty} pieces.`);
      return;
    }

    let images: string[] = [];
    try {
      images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
    } catch (e) {}

    addToCart({
      productId: product.id,
      name: `[Wholesale Bulk] ${product.name}`,
      sku: product.sku,
      price: pricing.effectiveUnitPrice,
      quantity: qty,
      image: images[0] || 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800',
      size: 'Assorted Bulk Sizes (M, L, XL)',
    });

    window.location.href = '/checkout';
  };

  return (
    <div className="bg-[#FAF9FF] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Wholesale Header Banner */}
        <div className="bg-gradient-to-r from-[#171936] via-[#1f234f] to-[#171936] text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Approved Wholesale Partner (Tier 1)
                </span>
                <span className="text-xs text-emerald-400 font-semibold">● Verified Corporate Account</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Karim Garments & Wholesale Emporium
              </h1>
              <p className="text-xs text-gray-400">
                BIN: 003928172-0102 | Trade License: TRAD/NRG/2024/4401 | Narayanganj Hub
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-300">Pricing Tier:</span>
              <select
                value={tier}
                onChange={(e: any) => setTier(e.target.value)}
                className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none"
              >
                <option value="TIER_1" className="text-gray-900">Tier 1: Standard Wholesale (25% off)</option>
                <option value="TIER_2" className="text-gray-900">Tier 2: High Volume (+3% extra)</option>
                <option value="TIER_3" className="text-gray-900">Tier 3: Mega Commercial (+7% extra)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-gray-400 font-medium">Approved Credit Limit</span>
              <h3 className="text-2xl font-black text-blue-300">৳2,50,000</h3>
              <p className="text-[10px] text-gray-400">30-day corporate trade credit term</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-gray-400 font-medium">Active Production Orders</span>
              <h3 className="text-2xl font-black text-amber-300">1 In-Production</h3>
              <p className="text-[10px] text-gray-400">Order DEL-2026-1003 (50 Panjabis)</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-gray-400 font-medium">Standard MOQ Policy</span>
              <h3 className="text-2xl font-black text-emerald-300">20 - 40 Pcs</h3>
              <p className="text-[10px] text-gray-400">Per colorway with assorted size ratios</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-gray-400 font-medium">Logistics Dispatch</span>
              <h3 className="text-2xl font-black text-purple-300">Direct Factory Hub</h3>
              <p className="text-[10px] text-gray-400">Pallet & Carton freight to your warehouse</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-5 py-2.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'catalog'
                ? 'bg-[#171936] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Wholesale Bulk Catalog & MOQ Tiers</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-[#171936] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Bulk Production Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-5 py-2.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'invoices'
                ? 'bg-[#171936] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Commercial Invoices & VAT Receipts</span>
          </button>
        </div>

        {/* Tab 1: Bulk Catalog */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const qty = bulkQuantities[product.id] || product.minWholesaleQty || 25;
                const pricing = calculateWholesalePricing(
                  {
                    regularPrice: product.regularPrice,
                    discountPrice: product.discountPrice,
                    resellerPrice: product.resellerPrice,
                    suggestedRetailPrice: product.suggestedRetailPrice,
                    wholesalePrice: product.wholesalePrice,
                    minWholesaleQty: product.minWholesaleQty,
                    productionCost: 1000,
                  },
                  qty,
                  tier
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
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold">
                          MOQ: {product.minWholesaleQty} pcs
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-[#171936]">{product.name}</h3>
                      <p className="text-[11px] font-mono text-gray-400">SKU: {product.sku}</p>

                      {/* Pricing Calculator */}
                      <div className="mt-3 p-3 rounded-xl bg-blue-50/60 border border-blue-100 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Base Wholesale Price:</span>
                          <span className="font-bold font-mono">৳{product.wholesalePrice.toLocaleString()} / pc</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tier Discount:</span>
                          <span className="font-bold text-emerald-600">
                            {pricing.tierDiscountPercent}% Off
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-blue-200/60 pt-1 font-bold">
                          <span>Effective Rate / Pc:</span>
                          <span className="text-[#4F24E8] font-mono text-sm">
                            ৳{pricing.effectiveUnitPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Quantity input */}
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-[11px] font-bold text-gray-700">
                          <span>Order Bulk Quantity (Pcs):</span>
                          <span>Min {product.minWholesaleQty}</span>
                        </div>
                        <input
                          type="number"
                          min={product.minWholesaleQty}
                          step="5"
                          value={qty}
                          onChange={(e) => handleQtyChange(product.id, Number(e.target.value))}
                          className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2 text-xs font-bold font-mono focus:outline-none focus:border-[#4F24E8]"
                        />

                        {/* Total lot cost */}
                        <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 mt-2 space-y-1 text-xs">
                          <div className="flex justify-between font-extrabold text-[#171936]">
                            <span>Lot Total ({qty} pcs):</span>
                            <span>৳{pricing.totalWholesaleAmount.toLocaleString()}</span>
                          </div>
                          <p className="text-[10px] text-emerald-600 font-semibold">
                            Saves ৳{pricing.savingsComparedToRetail.toLocaleString()} compared to retail MSRP
                          </p>
                        </div>

                        {!pricing.isMoqSatisfied && (
                          <p className="text-[10px] text-rose-600 font-semibold">{pricing.validationError}</p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddBulkToCart(product)}
                      disabled={!pricing.isMoqSatisfied}
                      className="w-full py-2.5 rounded-xl bg-[#171936] hover:bg-[#4F24E8] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Order Wholesale Lot (৳{pricing.totalWholesaleAmount.toLocaleString()})</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Orders */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-[#171936] uppercase tracking-wider border-b border-gray-100 pb-3">
              Wholesale Consignment Orders
            </h2>

            {orders.length === 0 ? (
              <p className="text-gray-400 text-xs py-8 text-center">No wholesale bulk orders placed yet.</p>
            ) : (
              <div className="divide-y divide-gray-100 text-xs">
                {orders.map((o) => (
                  <div key={o.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#171936]">{o.orderNumber}</span>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700">
                          {o.status}
                        </span>
                      </div>
                      <p className="text-gray-700 font-semibold mt-1">Consignee: {o.customerName}</p>
                      <p className="text-gray-400 text-[11px]">{o.shippingAddress}, {o.district}</p>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-xs text-gray-500">Commercial Lot Total: </span>
                      <strong className="text-sm text-[#4F24E8] font-mono">৳{o.totalAmount.toLocaleString()}</strong>
                      <p className="text-[11px] text-emerald-600 font-semibold">Payment: {o.paymentStatus}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Invoices */}
        {activeTab === 'invoices' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-[#171936] uppercase tracking-wider border-b border-gray-100 pb-3">
              Tax Invoices & Commercial Requisitions
            </h2>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-2">
              <div className="flex justify-between font-bold text-[#171936]">
                <span>Invoice # INV-WS-2026-NARG-001</span>
                <span>৳85,000 (PAID)</span>
              </div>
              <p className="text-gray-500 text-[11px]">50x Royal Indigo Embroidered Jacquard Panjabi (Assorted: 15 M, 20 L, 15 XL)</p>
              <div className="pt-2 flex gap-3 text-blue-600 font-semibold">
                <Link href="/order/DEL-2026-1003" className="hover:underline">View Digital Invoice</Link>
                <span>•</span>
                <button onClick={() => window.print()} className="hover:underline">Print Form Mushak 6.3</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
