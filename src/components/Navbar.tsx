'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  PhoneCall,
  Globe,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Navbar() {
  const {
    t,
    language,
    setLanguage,
    currency,
    setCurrency,
    cartCount,
    wishlist,
    user,
    logout,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'ADMIN':
        return '/dashboard/admin';
      case 'RESELLER':
        return '/dashboard/reseller';
      case 'WHOLESALE':
        return '/dashboard/wholesale';
      case 'STAFF':
        return '/dashboard/staff';
      case 'SHAREHOLDER':
        return '/dashboard/shareholder';
      case 'MODERATOR':
        return '/dashboard/moderator';
      case 'MARKETER':
        return '/dashboard/marketer';
      case 'CUSTOMER':
      default:
        return '/dashboard/customer';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      {/* 1. Announcement Bar */}
      <div className="bg-[#171936] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{t.announcementText}</span>
          </div>
          <div className="flex items-center space-x-4 text-gray-300">
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-delied-primary" />
              +880 9612 345678 (24/7 Support)
            </span>
            <span className="hidden md:inline">|</span>
            <Link href="/track-order" className="hover:text-white flex items-center gap-1 transition-colors">
              <Truck className="w-3.5 h-3.5" />
              {t.orderTracking}
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-delied-secondary hover:text-delied-primary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/" className="flex flex-col">
            <span className="font-serif tracking-wider text-2xl sm:text-3xl font-extrabold text-[#171936]">
              DELIED
            </span>
            <span className="text-[9px] font-sans tracking-widest text-[#4F24E8] font-bold uppercase -mt-1">
              HAUTE COUTURE & ERP
            </span>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-lg relative items-center mx-4"
        >
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F5F3FF] border border-gray-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-[#4F24E8] focus:bg-white transition-all text-[#171936]"
          />
          <button
            type="submit"
            className="absolute right-3 text-gray-400 hover:text-[#4F24E8] transition-colors"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Right: Controls (Currency, Language, Wishlist, Cart, User) */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Currency Toggle */}
          <button
            onClick={() => setCurrency(currency === 'BDT' ? 'USD' : 'BDT')}
            className="px-2 py-1 text-xs font-semibold rounded bg-[#F5F3FF] text-[#4F24E8] border border-[#E5E7EB] hover:bg-delied-primary hover:text-white transition-colors"
            title="Toggle Currency"
          >
            {currency === 'BDT' ? '৳ BDT' : '$ USD'}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-[#F5F3FF] text-[#171936] border border-[#E5E7EB] hover:bg-gray-100 transition-colors"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#4F24E8]" />
            {language === 'en' ? 'বাংলা' : 'English'}
          </button>

          {/* Wishlist Link */}
          <Link
            href="/dashboard/customer"
            className="relative p-2 text-gray-700 hover:text-[#4F24E8] transition-colors"
            title={t.wishlist}
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Shopping Cart */}
          <Link
            href="/cart"
            className="relative p-2 text-gray-700 hover:text-[#4F24E8] transition-colors"
            title={t.cart}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4.5 h-4.5 rounded-full bg-[#4F24E8] text-white text-[10px] flex items-center justify-center font-bold px-1">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Menu */}
          <div className="relative">
            {user ? (
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 py-1 px-2.5 rounded-full border border-gray-200 bg-[#F5F3FF] hover:border-[#4F24E8] transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-[#4F24E8] text-white flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-xs font-medium text-[#171936] max-w-[100px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#171936] text-white text-xs font-medium hover:bg-[#4F24E8] transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t.login}</span>
              </Link>
            )}

            {/* Dropdown for Logged In User */}
            {user && userDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 text-sm"
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-semibold text-[#171936] truncate">{user.name}</p>
                  <p className="text-xs text-[#71758A] truncate">{user.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-[#EEF2FF] text-[#4F24E8]">
                    {user.role}
                  </span>
                </div>

                <Link
                  href={getDashboardLink()}
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[#F5F3FF] text-[#171936] font-medium"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#4F24E8]" />
                  <span>{user.role} {t.dashboard}</span>
                </Link>

                {user.role === 'ADMIN' && (
                  <Link
                    href="/dashboard/admin"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-[#F5F3FF] text-[#171936]"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Control Panel</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    logout();
                  }}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-rose-50 text-rose-600 transition-colors border-t border-gray-100 mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.logout}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Navigation Bar (Desktop) */}
      <nav className="hidden lg:block bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm font-medium">
          <div className="flex items-center space-x-6 py-2.5">
            <Link
              href="/"
              className={`hover:text-[#4F24E8] transition-colors ${
                pathname === '/' ? 'text-[#4F24E8] font-bold border-b-2 border-[#4F24E8] pb-1' : 'text-[#171936]'
              }`}
            >
              {t.home}
            </Link>
            <Link
              href="/shop"
              className={`hover:text-[#4F24E8] transition-colors ${
                pathname === '/shop' ? 'text-[#4F24E8] font-bold border-b-2 border-[#4F24E8] pb-1' : 'text-[#171936]'
              }`}
            >
              {t.shop}
            </Link>
            <Link
              href="/shop?category=mens-panjabi-kurta"
              className="text-[#171936] hover:text-[#4F24E8] transition-colors"
            >
              {language === 'bn' ? 'পাঞ্জাবি ও কুর্তা' : 'Panjabi & Kurta'}
            </Link>
            <Link
              href="/shop?category=womens-saree-festive"
              className="text-[#171936] hover:text-[#4F24E8] transition-colors"
            >
              {language === 'bn' ? 'শাড়ি ও লেডিস' : 'Saree & Festive'}
            </Link>
            <Link
              href="/shop?filter=new"
              className="text-[#171936] hover:text-[#4F24E8] transition-colors"
            >
              {t.newArrivals}
            </Link>
            <Link
              href="/shop?filter=best"
              className="text-[#171936] hover:text-[#4F24E8] transition-colors"
            >
              {t.bestSellers}
            </Link>
            <Link
              href="/shop?filter=winter"
              className="text-amber-700 font-semibold hover:text-amber-800 transition-colors flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              {t.winterCollection}
            </Link>
          </div>

          <div className="flex items-center space-x-4 py-2.5 text-xs">
            <Link
              href="/register?role=RESELLER"
              className="text-[#4F24E8] font-bold hover:underline"
            >
              {language === 'bn' ? '🤝 রিসেলার হোন' : '🤝 Become a Reseller'}
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/register?role=WHOLESALE"
              className="text-[#171936] font-bold hover:text-[#4F24E8]"
            >
              {language === 'bn' ? '📦 পাইকারি ক্রয়' : '📦 Wholesale Inquiry'}
            </Link>
          </div>
        </div>
      </nav>

      {/* 4. Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-40 flex">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between p-5 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="font-serif text-2xl font-bold text-[#171936]">DELIED</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-gray-500 hover:text-gray-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="mt-4 relative">
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F5F3FF] border border-gray-200 rounded-lg py-2 pl-3 pr-9 text-xs focus:outline-none"
                />
                <button type="submit" className="absolute right-2.5 top-2.5 text-gray-400">
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Mobile Links */}
              <div className="mt-6 space-y-3 text-sm font-medium">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[#171936] hover:text-[#4F24E8] border-b border-gray-50"
                >
                  {t.home}
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[#171936] hover:text-[#4F24E8] border-b border-gray-50"
                >
                  {t.shop}
                </Link>
                <Link
                  href="/shop?filter=winter"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-amber-700 font-semibold border-b border-gray-50"
                >
                  ❄️ {t.winterCollection}
                </Link>
                <Link
                  href="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[#171936] hover:text-[#4F24E8] border-b border-gray-50"
                >
                  🚚 {t.orderTracking}
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[#171936] hover:text-[#4F24E8] border-b border-gray-50"
                >
                  {t.aboutUs}
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[#171936] hover:text-[#4F24E8] border-b border-gray-50"
                >
                  {t.contact}
                </Link>
              </div>

              {/* Role Portals in Mobile */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs uppercase tracking-wider text-[#71758A] font-bold mb-2">
                  Business Portals
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Link
                    href="/dashboard/reseller"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded bg-[#F5F3FF] text-[#4F24E8] font-bold text-center"
                  >
                    Reseller Portal
                  </Link>
                  <Link
                    href="/dashboard/wholesale"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded bg-gray-100 text-[#171936] font-bold text-center"
                  >
                    Wholesale Hub
                  </Link>
                  <Link
                    href="/dashboard/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded bg-slate-800 text-white font-bold text-center col-span-2"
                  >
                    Admin Control
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-gray-100">
              {user ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-2 px-4 rounded bg-rose-50 text-rose-600 text-sm font-semibold text-center"
                >
                  {t.logout} ({user.name})
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2.5 px-4 rounded bg-[#4F24E8] text-white text-sm font-semibold text-center"
                >
                  {t.login} / Register
                </Link>
              )}
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
        </div>
      )}
    </header>
  );
}
