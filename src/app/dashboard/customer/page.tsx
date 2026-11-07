'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  Heart,
  Truck,
  RotateCcw,
  LifeBuoy,
  User,
  ShoppingBag,
  ExternalLink,
  Plus,
  Send,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function CustomerDashboard() {
  const router = useRouter();
  const { user, wishlist, formatPriceAmount, logout } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'tracking' | 'wishlist' | 'tickets' | 'profile'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New ticket state
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState('GENERAL');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersRes, ticketsRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/support/tickets'),
        ]);

        if (ordersRes.ok) {
          const ordData = await ordersRes.json();
          setOrders(ordData.orders || []);
        }

        if (ticketsRes.ok) {
          const tktData = await ticketsRes.json();
          setTickets(tktData.tickets || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject || !newTicketMessage) return;

    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_TICKET',
          subject: newTicketSubject,
          category: newTicketCategory,
          message: newTicketMessage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTickets([data.ticket, ...tickets]);
        setNewTicketSubject('');
        setNewTicketMessage('');
        setTicketSuccess(true);
        setTimeout(() => setTicketSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-[#FAF9FF] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Welcome Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#4F24E8] to-purple-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
              {user?.name?.charAt(0) || 'C'}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#EEF2FF] text-[#4F24E8]">
                Retail Member
              </span>
              <h1 className="font-serif text-2xl font-bold text-[#171936] mt-0.5">
                Welcome back, {user?.name || 'Valued Shopper'}
              </h1>
              <p className="text-xs text-gray-500">{user?.email || 'customer@delied.com'}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href="/shop"
              className="px-4 py-2 rounded-full bg-[#4F24E8] text-white text-xs font-bold hover:bg-[#431ec9] transition-colors"
            >
              Continue Shopping
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-[#171936] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-5 py-2.5 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'wishlist'
                ? 'bg-[#171936] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist ({wishlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-5 py-2.5 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'tickets'
                ? 'bg-[#171936] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <LifeBuoy className="w-4 h-4" />
            <span>Support & Returns ({tickets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-2.5 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-[#171936] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Profile & Addresses</span>
          </button>
        </div>

        {/* Tab 1: Orders List */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm space-y-3">
                <Package className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="text-base font-bold text-[#171936]">No Orders Placed Yet</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Your purchase history will appear here once you make your first order.
                </p>
                <Link
                  href="/shop"
                  className="inline-block px-5 py-2 rounded-full bg-[#4F24E8] text-white text-xs font-bold"
                >
                  Browse Collection
                </Link>
              </div>
            ) : (
              orders.map((o) => (
                <div
                  key={o.id}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-100 gap-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#171936]">{o.orderNumber}</span>
                      <p className="text-[11px] text-gray-400">
                        Placed: {new Date(o.createdAt).toLocaleDateString('en-GB')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-purple-50 text-[#4F24E8] border border-purple-200">
                        {o.status}
                      </span>
                      <Link
                        href={`/track-order?code=${o.orderNumber}`}
                        className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#171936] text-white hover:bg-[#4F24E8] transition-colors flex items-center gap-1"
                      >
                        <Truck className="w-3 h-3" />
                        <span>Track</span>
                      </Link>
                      <Link
                        href={`/order/${o.orderNumber}`}
                        className="p-1 text-gray-400 hover:text-gray-800"
                        title="View invoice"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-50 text-xs">
                    {o.items.map((item: any) => (
                      <div key={item.id} className="py-2 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-[#171936]">{item.productName}</p>
                          <span className="text-[10px] text-gray-400">Qty: {item.quantity} | Size: {item.size}</span>
                        </div>
                        <span className="font-bold text-[#171936]">
                          {formatPriceAmount(item.total)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
                    <span className="text-gray-500">
                      Payment: <strong>{o.paymentMethod}</strong> ({o.paymentStatus})
                    </span>
                    <span className="text-sm font-extrabold text-[#4F24E8]">
                      Total: {formatPriceAmount(o.totalAmount)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center space-y-4">
            <Heart className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-base font-bold text-[#171936]">
              Saved Wishlist Items ({wishlist.length})
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Items you mark with a heart appear here for quick access when you are ready to purchase.
            </p>
            <Link
              href="/shop"
              className="inline-block px-5 py-2 rounded-full bg-[#4F24E8] text-white text-xs font-bold"
            >
              Explore and Save Pieces
            </Link>
          </div>
        )}

        {/* Tab 3: Support Tickets & Returns */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            {/* Create Ticket Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-[#171936] uppercase tracking-wider border-b border-gray-100 pb-3">
                Open a Support or Exchange Ticket
              </h2>

              {ticketSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  Your ticket has been submitted to the DELIED Concierge team!
                </div>
              )}

              <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Issue Category</label>
                    <select
                      value={newTicketCategory}
                      onChange={(e) => setNewTicketCategory(e.target.value)}
                      className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 font-medium focus:outline-none"
                    >
                      <option value="RETURN_REFUND">Size Exchange / Return Request</option>
                      <option value="ORDER_ISSUE">Order / Delivery Delay</option>
                      <option value="PAYMENT">Payment Verification</option>
                      <option value="PRODUCT_INQUIRY">Fabric & Sizing Inquiry</option>
                      <option value="GENERAL">General Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Subject / Order Code *</label>
                    <input
                      type="text"
                      required
                      value={newTicketSubject}
                      onChange={(e) => setNewTicketSubject(e.target.value)}
                      placeholder="e.g. Size exchange for Order DEL-2026-1001"
                      className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Detailed Message *</label>
                  <textarea
                    required
                    rows={3}
                    value={newTicketMessage}
                    onChange={(e) => setNewTicketMessage(e.target.value)}
                    placeholder="Describe your issue or exchange requirements..."
                    className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg p-2.5 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#4F24E8] text-white font-bold hover:bg-[#431ec9] transition-colors flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Ticket</span>
                </button>
              </form>
            </div>

            {/* Existing Tickets */}
            <div className="space-y-3">
              {tickets.map((tkt) => (
                <div
                  key={tkt.id}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3"
                >
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-mono font-bold text-[#4F24E8]">{tkt.ticketNumber}</span>
                      <h4 className="font-bold text-[#171936] text-sm mt-0.5">{tkt.subject}</h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] bg-amber-50 text-amber-700 border border-amber-200">
                      {tkt.status}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl space-y-2 text-xs">
                    {tkt.messages?.map((m: any) => (
                      <div key={m.id} className="border-b border-gray-100 last:border-none pb-2 last:pb-0">
                        <span className="font-bold text-gray-800 text-[11px]">{m.senderName} ({m.senderRole}):</span>
                        <p className="text-gray-600 mt-0.5">{m.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Profile & Addresses */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4 max-w-xl text-xs">
            <h2 className="text-sm font-bold text-[#171936] uppercase tracking-wider border-b border-gray-100 pb-3">
              Saved Account Details
            </h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>Name:</strong> {user?.name || 'Tanvir Ahmed'}</p>
              <p><strong>Email:</strong> {user?.email || 'customer@delied.com'}</p>
              <p><strong>Default District:</strong> Dhaka</p>
              <p><strong>Default Upazila:</strong> Banani</p>
              <p><strong>Primary Address:</strong> House 42, Road 11, Block D, Banani, Dhaka</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
