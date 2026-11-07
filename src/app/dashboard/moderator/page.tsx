'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Headset,
  MessageSquare,
  LifeBuoy,
  CheckCircle2,
  XCircle,
  Star,
  Send,
  Clock,
  RotateCcw,
  AlertCircle,
  User,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function ModeratorPage() {
  const { user } = useApp();

  const [activeTab, setActiveTab] = useState<'tickets' | 'chat'>('tickets');
  const [tickets, setTickets] = useState<any[]>([]);
  const [chatSessions, setChatSessions] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const fetchModeratorData = async () => {
    try {
      const [tktRes, chatRes] = await Promise.all([
        fetch('/api/support/tickets'),
        fetch('/api/chat'),
      ]);

      if (tktRes.ok) {
        const tData = await tktRes.json();
        setTickets(tData.tickets || []);
      }
      if (chatRes.ok) {
        const cData = await chatRes.json();
        setChatSessions(cData.sessions || []);
        if (cData.sessions?.length > 0 && !activeSession) {
          setActiveSession(cData.sessions[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchModeratorData();
  }, []);

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeSession) return;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: activeSession.id,
          message: replyText,
          senderType: 'MODERATOR',
        }),
      });

      if (res.ok) {
        setReplyText('');
        // Refresh session messages
        const sessRes = await fetch(`/api/chat?sessionId=${activeSession.id}`);
        const sData = await sessRes.json();
        setActiveSession(sData.session);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReplyTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketReplyText.trim() || !selectedTicketId) return;

    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REPLY',
          ticketId: selectedTicketId,
          message: ticketReplyText,
          status: 'RESOLVED',
        }),
      });

      if (res.ok) {
        setTicketReplyText('');
        fetchModeratorData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-[#FAF9FF] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Moderator Header */}
        <div className="bg-[#171936] text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Customer Concierge & Dispute Moderator
                </span>
                <span className="text-xs text-emerald-400 font-semibold">● Morning Shift Online</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {user?.name || 'Fatema Tuz Zohra'} — Support Desk
              </h1>
              <p className="text-xs text-gray-400">
                Department: Customer Care & Returns Escalations • Real-Time SLA: 4 Minutes
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-gray-400 font-medium">Active Support Tickets</span>
              <h3 className="text-2xl font-black text-cyan-300">{tickets.length}</h3>
              <p className="text-[10px] text-gray-400">Exchanges, returns & courier inquiries</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-gray-400 font-medium">Live Chat Conversations</span>
              <h3 className="text-2xl font-black text-emerald-300">{chatSessions.length}</h3>
              <p className="text-[10px] text-gray-400">Shopper inquiries & automated triage</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-gray-400 font-medium">Resolution Rate</span>
              <h3 className="text-2xl font-black text-purple-300">98.4%</h3>
              <p className="text-[10px] text-gray-400">Within 24 hours turnaround</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-gray-400 font-medium">Shift Schedule</span>
              <h3 className="text-2xl font-black text-amber-300">08:00 - 16:00</h3>
              <p className="text-[10px] text-gray-400">BST Morning Customer Operations</p>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-5 py-2.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'tickets'
                ? 'bg-[#171936] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <LifeBuoy className="w-4 h-4" />
            <span>Support & Return Tickets ({tickets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-5 py-2.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-[#171936] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Live Chat Central Inbox ({chatSessions.length})</span>
          </button>
        </div>

        {/* Tab 1: Tickets */}
        {activeTab === 'tickets' && (
          <div className="space-y-4">
            {tickets.map((tkt) => (
              <div key={tkt.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-gray-100 gap-2">
                  <div>
                    <span className="font-mono font-bold text-[#4F24E8] text-xs">{tkt.ticketNumber}</span>
                    <h3 className="text-base font-bold text-[#171936]">{tkt.subject}</h3>
                    <p className="text-xs text-gray-500">
                      Customer: <strong>{tkt.customer?.name}</strong> ({tkt.customer?.phone || tkt.customer?.email})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                      {tkt.status}
                    </span>
                    <button
                      onClick={() => setSelectedTicketId(selectedTicketId === tkt.id ? null : tkt.id)}
                      className="px-3 py-1 rounded-full bg-[#171936] text-white text-xs font-bold hover:bg-[#4F24E8]"
                    >
                      {selectedTicketId === tkt.id ? 'Close Reply' : 'Reply & Resolve'}
                    </button>
                  </div>
                </div>

                {/* Messages in ticket */}
                <div className="bg-gray-50 p-4 rounded-2xl space-y-3 text-xs">
                  {tkt.messages?.map((m: any) => (
                    <div key={m.id} className="border-b border-gray-200/60 last:border-none pb-2 last:pb-0">
                      <div className="flex justify-between font-bold text-gray-800">
                        <span>{m.senderName} ({m.senderRole})</span>
                        <span className="text-[10px] text-gray-400 font-normal">
                          {new Date(m.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-1">{m.message}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                {selectedTicketId === tkt.id && (
                  <form onSubmit={handleReplyTicket} className="space-y-3 pt-2">
                    <textarea
                      required
                      rows={2}
                      value={ticketReplyText}
                      onChange={(e) => setTicketReplyText(e.target.value)}
                      placeholder="Write resolution reply to customer..."
                      className="w-full bg-[#F5F3FF] border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-[#4F24E8]"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Send Reply & Mark Resolved</span>
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Live Chat Queue */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
            {/* Conversations list (Col 1-4) */}
            <div className="lg:col-span-4 border-r border-gray-100 divide-y divide-gray-100 text-xs">
              <div className="p-4 bg-gray-50 font-bold text-[#171936] uppercase tracking-wider text-[11px]">
                Active Chat Queue
              </div>
              {chatSessions.map((sess) => (
                <div
                  key={sess.id}
                  onClick={() => setActiveSession(sess)}
                  className={`p-4 cursor-pointer transition-colors ${
                    activeSession?.id === sess.id ? 'bg-[#F5F3FF] border-l-4 border-[#4F24E8]' : 'hover:bg-gray-50'
                  }`}
                >
                  <h4 className="font-bold text-[#171936]">{sess.customerName}</h4>
                  <p className="text-gray-400 text-[11px] truncate">
                    {sess.messages?.[0]?.message || 'Customer initiated chat'}
                  </p>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase mt-1 inline-block">
                    {sess.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Conversation Window (Col 5-12) */}
            <div className="lg:col-span-8 flex flex-col justify-between p-6">
              {activeSession ? (
                <>
                  <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-sm text-[#171936]">{activeSession.customerName}</h3>
                      <p className="text-[11px] text-gray-400">Assigned: Fatema Tuz Zohra (Moderator)</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      ACTIVE
                    </span>
                  </div>

                  <div className="flex-1 py-4 space-y-3 overflow-y-auto max-h-80 text-xs">
                    {activeSession.messages?.map((m: any) => (
                      <div
                        key={m.id}
                        className={`flex flex-col ${
                          m.senderType === 'MODERATOR' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <span className="text-[10px] text-gray-400 mb-0.5">{m.senderName}</span>
                        <div
                          className={`max-w-[75%] rounded-2xl p-3 ${
                            m.senderType === 'MODERATOR'
                              ? 'bg-[#4F24E8] text-white rounded-tr-none'
                              : 'bg-gray-100 text-[#171936] rounded-tl-none'
                          }`}
                        >
                          {m.message}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendChatMessage} className="pt-3 border-t border-gray-100 flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type official moderator response..."
                      className="flex-1 bg-[#F5F3FF] border border-gray-200 rounded-full py-2.5 px-4 text-xs focus:outline-none focus:border-[#4F24E8]"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-full bg-[#4F24E8] text-white text-xs font-bold hover:bg-[#431ec9]"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <p className="text-gray-400 text-xs text-center py-16">Select a chat from the queue</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
