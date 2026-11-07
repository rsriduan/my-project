'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  Package,
  Wrench,
  DollarSign,
  TrendingUp,
  FileText,
  Truck,
  Plus,
  CheckCircle2,
  AlertCircle,
  Calculator,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { calculateTotalProductionCost } from '@/lib/pricing-engine';

export default function StaffERPPage() {
  const { formatPriceAmount } = useApp();

  const [activeTab, setActiveTab] = useState<'costing' | 'finance' | 'raw' | 'batches'>('costing');
  const [costings, setCostings] = useState<any[]>([]);
  const [finance, setFinance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Costing update modal
  const [selectedCosting, setSelectedCosting] = useState<any>(null);
  const [fabricCost, setFabricCost] = useState(0);
  const [accessoriesCost, setAccessoriesCost] = useState(0);
  const [printingCost, setPrintingCost] = useState(0);
  const [labelCost, setLabelCost] = useState(0);
  const [packagingCost, setPackagingCost] = useState(0);
  const [labourCost, setLabourCost] = useState(0);
  const [overheadCost, setOverheadCost] = useState(0);
  const [otherCost, setOtherCost] = useState(0);
  const [costingNotes, setCostingNotes] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  // Transaction form
  const [txAccountId, setTxAccountId] = useState('');
  const [txType, setTxType] = useState('EXPENSE');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('FABRIC_PURCHASE');
  const [txDescription, setTxDescription] = useState('');

  const fetchStaffData = async () => {
    try {
      setLoading(true);
      const [costRes, finRes] = await Promise.all([
        fetch('/api/erp/costing'),
        fetch('/api/erp/finance'),
      ]);

      if (costRes.ok) {
        const cData = await costRes.json();
        setCostings(cData.costings || []);
      }
      if (finRes.ok) {
        const fData = await finRes.json();
        setFinance(fData);
        if (fData.accounts?.length > 0) {
          setTxAccountId(fData.accounts[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  const openCostingModal = (c: any) => {
    setSelectedCosting(c);
    setFabricCost(c.fabricCost);
    setAccessoriesCost(c.accessoriesCost);
    setPrintingCost(c.printingCost);
    setLabelCost(c.labelCost);
    setPackagingCost(c.packagingCost);
    setLabourCost(c.labourCost);
    setOverheadCost(c.overheadCost);
    setOtherCost(c.otherCost);
    setCostingNotes(c.notes || '');
  };

  const calculatedTotal = calculateTotalProductionCost({
    fabricCost,
    accessoriesCost,
    printingCost,
    labelCost,
    packagingCost,
    labourCost,
    overheadCost,
    otherCost,
  });

  const handleSaveCosting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCosting) return;

    try {
      const res = await fetch('/api/erp/costing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedCosting.productId,
          fabricCost,
          accessoriesCost,
          printingCost,
          labelCost,
          packagingCost,
          labourCost,
          overheadCost,
          otherCost,
          notes: costingNotes,
        }),
      });

      if (res.ok) {
        setSaveSuccess('Product costing breakdown updated and recalculated!');
        setTimeout(() => setSaveSuccess(''), 3000);
        setSelectedCosting(null);
        fetchStaffData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRecordTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txAmount || !txDescription) return;

    try {
      const res = await fetch('/api/erp/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: txAccountId,
          type: txType,
          amount: parseFloat(txAmount),
          category: txCategory,
          description: txDescription,
        }),
      });

      if (res.ok) {
        setTxAmount('');
        setTxDescription('');
        fetchStaffData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-[#FAF9FF] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Staff ERP Header */}
        <div className="bg-[#171936] text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Operations & Factory ERP
                </span>
                <span className="text-xs text-gray-400">Department: Production & Inventory</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mt-1">
                DELIED Enterprise Resource Planning
              </h1>
              <p className="text-xs text-gray-400">
                Product Costing Breakdown • Raw Materials • Production Accounting • General Ledger
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-gray-400 font-medium">Finished Goods Inventory</span>
              <h3 className="text-2xl font-black text-white font-mono">
                ৳{(finance?.balanceSheet?.currentAssets?.finishedGoodsInventory || 285000).toLocaleString()}
              </h3>
              <p className="text-[10px] text-gray-400">Valued at production cost</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-gray-400 font-medium">Raw Materials Inventory</span>
              <h3 className="text-2xl font-black text-amber-300 font-mono">
                ৳{(finance?.balanceSheet?.currentAssets?.rawMaterialsInventory || 732000).toLocaleString()}
              </h3>
              <p className="text-[10px] text-gray-400">Fabric, yarns, buttons & packaging</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-gray-400 font-medium">Corporate Bank Balance</span>
              <h3 className="text-2xl font-black text-emerald-400 font-mono">
                ৳{(finance?.balanceSheet?.currentAssets?.bankAccounts || 2270000).toLocaleString()}
              </h3>
              <p className="text-[10px] text-gray-400">Prime Bank & bKash Merchant</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-gray-400 font-medium">Operational Gross Net</span>
              <h3 className="text-2xl font-black text-purple-300 font-mono">
                ৳{(finance?.metrics?.netProfit || 594000).toLocaleString()}
              </h3>
              <p className="text-[10px] text-gray-400">YTD operating surplus</p>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('costing')}
            className={`px-5 py-2.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'costing'
                ? 'bg-[#171936] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Product Costing Breakdown (PRD Formula)</span>
          </button>

          <button
            onClick={() => setActiveTab('finance')}
            className={`px-5 py-2.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'finance'
                ? 'bg-[#171936] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Accounts, Expenses & Balance Sheet</span>
          </button>
        </div>

        {/* Tab 1: Product Costing Breakdown */}
        {activeTab === 'costing' && (
          <div className="space-y-6">
            {saveSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{saveSuccess}</span>
              </div>
            )}

            {/* Edit Costing Modal */}
            {selectedCosting && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#4F24E8] shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#171936]">
                      Edit Production Costing: {selectedCosting.product?.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-mono">SKU: {selectedCosting.product?.sku}</p>
                  </div>
                  <button
                    onClick={() => setSelectedCosting(null)}
                    className="text-xs font-bold text-gray-400 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleSaveCosting} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Fabric Cost (৳)</label>
                      <input
                        type="number"
                        value={fabricCost}
                        onChange={(e) => setFabricCost(Number(e.target.value))}
                        className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Accessories (৳)</label>
                      <input
                        type="number"
                        value={accessoriesCost}
                        onChange={(e) => setAccessoriesCost(Number(e.target.value))}
                        className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Printing / Embroidery (৳)</label>
                      <input
                        type="number"
                        value={printingCost}
                        onChange={(e) => setPrintingCost(Number(e.target.value))}
                        className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Label & Tag (৳)</label>
                      <input
                        type="number"
                        value={labelCost}
                        onChange={(e) => setLabelCost(Number(e.target.value))}
                        className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Packaging (৳)</label>
                      <input
                        type="number"
                        value={packagingCost}
                        onChange={(e) => setPackagingCost(Number(e.target.value))}
                        className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Direct Labour (৳)</label>
                      <input
                        type="number"
                        value={labourCost}
                        onChange={(e) => setLabourCost(Number(e.target.value))}
                        className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Overhead & Utilities (৳)</label>
                      <input
                        type="number"
                        value={overheadCost}
                        onChange={(e) => setOverheadCost(Number(e.target.value))}
                        className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Other Production Costs (৳)</label>
                      <input
                        type="number"
                        value={otherCost}
                        onChange={(e) => setOtherCost(Number(e.target.value))}
                        className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-xl flex justify-between items-center text-xs text-purple-900 font-bold">
                    <span>PRD Costing Formula Total:</span>
                    <span className="text-base font-extrabold text-[#4F24E8]">৳{calculatedTotal.toLocaleString()}</span>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#4F24E8] text-white font-bold hover:bg-[#431ec9]"
                  >
                    Commit Costing Update
                  </button>
                </form>
              </div>
            )}

            {/* Costing Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#171936] text-white font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Style & SKU</th>
                      <th className="py-3 px-4 text-right">Fabric</th>
                      <th className="py-3 px-4 text-right">Accessories</th>
                      <th className="py-3 px-4 text-right">Labour</th>
                      <th className="py-3 px-4 text-right">Packaging</th>
                      <th className="py-3 px-4 text-right">Total Cost</th>
                      <th className="py-3 px-4 text-right">Wholesale Rate</th>
                      <th className="py-3 px-4 text-right">Gross Margin</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {costings.map((c) => {
                      const wholesalePrice = c.product?.wholesalePrice || 1750;
                      const grossMargin = wholesalePrice - c.totalCost;
                      const marginPercent = Math.round((grossMargin / wholesalePrice) * 100);

                      return (
                        <tr key={c.id} className="hover:bg-gray-50/50">
                          <td className="py-3 px-4">
                            <p className="font-bold text-[#171936]">{c.product?.name}</p>
                            <span className="text-[10px] font-mono text-gray-400">{c.product?.sku}</span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-gray-700">৳{c.fabricCost}</td>
                          <td className="py-3 px-4 text-right font-mono text-gray-700">৳{c.accessoriesCost}</td>
                          <td className="py-3 px-4 text-right font-mono text-gray-700">৳{c.labourCost}</td>
                          <td className="py-3 px-4 text-right font-mono text-gray-700">৳{c.packagingCost}</td>
                          <td className="py-3 px-4 text-right font-mono font-extrabold text-[#4F24E8]">
                            ৳{c.totalCost}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-gray-700">
                            ৳{wholesalePrice.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="font-bold text-emerald-600 font-mono">
                              + ৳{grossMargin} ({marginPercent}%)
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => openCostingModal(c)}
                              className="px-3 py-1 rounded bg-[#F5F3FF] text-[#4F24E8] font-bold hover:bg-[#4F24E8] hover:text-white transition-colors"
                            >
                              Edit Formula
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Finance & Balance Sheet */}
        {activeTab === 'finance' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Record Journal Entry (Col 1-5) */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-[#171936] uppercase tracking-wider border-b border-gray-100 pb-3">
                Post Financial Transaction
              </h2>

              <form onSubmit={handleRecordTransaction} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Financial Account</label>
                  <select
                    value={txAccountId}
                    onChange={(e) => setTxAccountId(e.target.value)}
                    className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 font-bold focus:outline-none"
                  >
                    {finance?.accounts?.map((acc: any) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} (Balance: ৳{acc.balance.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Type</label>
                    <select
                      value={txType}
                      onChange={(e) => setTxType(e.target.value)}
                      className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 font-bold focus:outline-none"
                    >
                      <option value="EXPENSE">EXPENSE (Debit)</option>
                      <option value="INCOME">INCOME (Credit)</option>
                      <option value="SALARY">SALARY (Payroll)</option>
                      <option value="SUPPLIER_PAYMENT">SUPPLIER PAYMENT</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Amount (৳)</label>
                    <input
                      type="number"
                      required
                      value={txAmount}
                      onChange={(e) => setTxAmount(e.target.value)}
                      placeholder="e.g. 25000"
                      className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 font-mono font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Description / Memo *</label>
                  <input
                    type="text"
                    required
                    value={txDescription}
                    onChange={(e) => setTxDescription(e.target.value)}
                    placeholder="e.g. Payment for 60/1 combed cotton yarn order"
                    className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#171936] hover:bg-[#4F24E8] text-white font-bold text-xs transition-colors"
                >
                  Post Transaction
                </button>
              </form>
            </div>

            {/* Balance Sheet Statement (Col 6-12) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-[#171936] uppercase tracking-wider border-b border-gray-100 pb-3">
                Company Balance Sheet (PRD Section 6)
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-[#171936] mb-1.5 uppercase text-[11px] text-gray-500">
                    Current Assets
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-xl divide-y divide-gray-100 space-y-1">
                    <div className="flex justify-between py-1">
                      <span>Cash In Hand:</span>
                      <strong className="font-mono">৳{(finance?.balanceSheet?.currentAssets?.cashInHand || 85000).toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Bank Accounts & MFS:</span>
                      <strong className="font-mono">৳{(finance?.balanceSheet?.currentAssets?.bankAccounts || 2270000).toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Finished Goods Inventory:</span>
                      <strong className="font-mono">৳{(finance?.balanceSheet?.currentAssets?.finishedGoodsInventory || 285000).toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Raw Materials & Fabric:</span>
                      <strong className="font-mono">৳{(finance?.balanceSheet?.currentAssets?.rawMaterialsInventory || 732000).toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between py-1 font-bold text-[#4F24E8] border-t border-gray-200">
                      <span>Total Assets:</span>
                      <span className="font-mono text-sm">৳{(finance?.balanceSheet?.currentAssets?.totalAssets || 3372000).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-[#171936] mb-1.5 uppercase text-[11px] text-gray-500">
                    Liabilities & Shareholder Equity
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-xl divide-y divide-gray-100 space-y-1">
                    <div className="flex justify-between py-1">
                      <span>Accounts Payable to Suppliers:</span>
                      <strong className="font-mono text-rose-600">৳{(finance?.balanceSheet?.liabilities?.accountsPayableToSuppliers || 100000).toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between py-1 font-bold text-emerald-700 border-t border-gray-200">
                      <span>Total Shareholder Equity & Retained Earnings:</span>
                      <span className="font-mono text-sm">৳{(finance?.balanceSheet?.equity?.totalEquity || 3272000).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
