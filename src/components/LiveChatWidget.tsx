'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Headset } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface ChatMsg {
  id?: string;
  senderName: string;
  senderType: string;
  message: string;
  createdAt?: string;
}

export default function LiveChatWidget() {
  const { user } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      senderName: 'Fatema (Customer Care)',
      senderType: 'MODERATOR',
      message: 'Assalamu Alaikum! Welcome to DELIED Haute Couture. How may we assist you today?',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isSending) return;

    const newMsg: ChatMsg = {
      senderName: user?.name || 'Guest Customer',
      senderType: 'CUSTOMER',
      message: text.trim(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setIsSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          customerName: user?.name || 'Guest Customer',
          customerEmail: user?.email,
          message: text.trim(),
        }),
      });

      const data = await res.json();
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
      }

      // Simulate instant moderator intelligent response
      setTimeout(() => {
        let reply = "Thank you for reaching out! We've notified our support lead and will assist you immediately.";
        const lower = text.toLowerCase();
        if (lower.includes('reseller')) {
          reply = "You can join our Reseller program with 15% profit margin directly via the 'Become a Reseller' link or register at /register?role=RESELLER.";
        } else if (lower.includes('wholesale') || lower.includes('bulk')) {
          reply = "Our wholesale minimum order quantity starts at 20-40 pcs with up to 35% tier discounts. You can view our bulk catalog at /dashboard/wholesale.";
        } else if (lower.includes('delivery') || lower.includes('dhaka')) {
          reply = "Delivery charge is ৳60 inside Dhaka (1-2 days) and ৳120 outside Dhaka (2-3 days). Express delivery is available!";
        } else if (lower.includes('track') || lower.includes('order')) {
          reply = "You can track your parcel live anytime by visiting /track-order with your order code (e.g. DEL-2026-XXXX).";
        }

        setMessages((prev) => [
          ...prev,
          {
            senderName: 'Fatema (DELIED Concierge)',
            senderType: 'MODERATOR',
            message: reply,
          },
        ]);
      }, 700);
    } catch (e) {
      console.error('Chat error:', e);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickQuestion = (q: string) => {
    handleSendMessage(q);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating launcher button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 bg-[#4F24E8] text-white px-4 py-3.5 rounded-full shadow-2xl hover:bg-[#431ec9] transition-all transform hover:scale-105"
          aria-label="Open 24/7 Live Support Chat"
        >
          <Headset className="w-5 h-5 animate-bounce" />
          <span className="font-semibold text-xs tracking-wide">Live Support</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute top-1 right-1 border-2 border-white"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="bg-[#171936] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-[#4F24E8] flex items-center justify-center font-bold text-sm">
                  D
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute bottom-0 right-0 border-2 border-[#171936]"></span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">DELIED Concierge</h4>
                <p className="text-[11px] text-gray-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Active Now • 24/7 Response
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick FAQ Prompts */}
          <div className="bg-[#F5F3FF] p-2.5 border-b border-gray-100 flex gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => handleQuickQuestion('Delivery charges & time?')}
              className="px-2.5 py-1 rounded-full bg-white border border-gray-200 text-[#171936] font-medium whitespace-nowrap hover:bg-[#4F24E8] hover:text-white transition-colors"
            >
              🚚 Delivery time?
            </button>
            <button
              onClick={() => handleQuickQuestion('How to become a reseller?')}
              className="px-2.5 py-1 rounded-full bg-white border border-gray-200 text-[#171936] font-medium whitespace-nowrap hover:bg-[#4F24E8] hover:text-white transition-colors"
            >
              💼 Reseller program?
            </button>
            <button
              onClick={() => handleQuickQuestion('Wholesale bulk MOQ?')}
              className="px-2.5 py-1 rounded-full bg-white border border-gray-200 text-[#171936] font-medium whitespace-nowrap hover:bg-[#4F24E8] hover:text-white transition-colors"
            >
              📦 Wholesale MOQ?
            </button>
          </div>

          {/* Messages Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50">
            {messages.map((m, idx) => {
              const isUser = m.senderType === 'CUSTOMER';
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-gray-400 mb-0.5 px-1">{m.senderName}</span>
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-[#4F24E8] text-white rounded-tr-none shadow-sm'
                        : 'bg-white text-[#171936] border border-gray-200 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {m.message}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about products, orders..."
              className="flex-1 bg-[#F5F3FF] border border-gray-200 rounded-full py-2 px-4 text-xs text-[#171936] focus:outline-none focus:border-[#4F24E8] focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="p-2.5 rounded-full bg-[#4F24E8] text-white hover:bg-[#431ec9] disabled:opacity-50 transition-colors shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
