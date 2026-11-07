import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Users,
  Briefcase,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const revalidate = 0; // Dynamic rendering

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { status: 'PUBLISHED' },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const winterCollection = products.filter((p) => p.isWinterCollection).slice(0, 4);
  const recommended = products.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 3. Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#171936] via-[#212450] to-[#171936] text-white py-16 sm:py-24 lg:py-28">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#4F24E8_1px,transparent_1px)] [background-size:20px_20px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-purple-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>EID & WINTER HAUTE COUTURE 2026</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Luxury Bangladeshi Heritage Meets Modern Craft.
              </h1>

              <p className="text-gray-300 text-base sm:text-lg max-w-xl leading-relaxed">
                Experience handcrafted Jacquard Panjabis, Dhakai Jamdani Sarees, and 380 GSM Heavyweight Winter Fleece engineered with sartorial precision.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/shop"
                  className="px-6 py-3.5 rounded-full bg-[#4F24E8] hover:bg-[#431ec9] text-white text-sm font-bold shadow-lg shadow-purple-900/40 transition-all flex items-center gap-2"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/register?role=RESELLER"
                  className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 backdrop-blur-sm transition-all flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-purple-300" />
                  <span>Reseller & Wholesale</span>
                </Link>
              </div>

              {/* Value propositions */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-delied-primary" />
                  <span>Free Dhaka Delivery Over ৳2,000</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>100% Genuine Artisan Fabrics</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-amber-400" />
                  <span>7 Days Hassle-Free Exchange</span>
                </div>
              </div>
            </div>

            {/* Right Column: Featured Luxury Showcase Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white/5 backdrop-blur-md p-3">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop"
                    alt="DELIED Luxury Panjabi"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171936] via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 text-[#171936] shadow-xl backdrop-blur-sm">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#4F24E8]">
                      Heritage Edition
                    </span>
                    <h3 className="text-base font-bold text-[#171936]">
                      Royal Indigo Embroidered Jacquard Panjabi
                    </h3>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <div>
                        <span className="text-lg font-extrabold text-[#171936]">৳2,450</span>
                        <span className="ml-2 text-xs text-gray-400 line-through">৳2,850</span>
                      </div>
                      <Link
                        href="/product/royal-indigo-embroidered-panjabi"
                        className="px-3 py-1.5 rounded-full bg-[#171936] hover:bg-[#4F24E8] text-white text-xs font-semibold transition-colors"
                      >
                        Order Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Featured Categories */}
      <section className="py-16 bg-[#FAF9FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#4F24E8]">
                Curated Aesthetics
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#171936] mt-1">
                Explore Signature Collections
              </h2>
            </div>
            <Link
              href="/shop"
              className="mt-3 sm:mt-0 text-sm font-semibold text-[#4F24E8] hover:text-[#431ec9] flex items-center gap-1"
            >
              <span>View All Categories</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group relative rounded-xl overflow-hidden aspect-[4/5] bg-gray-200 luxury-card-hover shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800'}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-sm sm:text-base leading-snug">{cat.name}</h3>
                  <p className="text-[11px] text-gray-300 mt-0.5">{cat._count.products} Products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. New Arrivals */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#4F24E8]">
                Just In For Festive Season
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#171936] mt-1">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/shop?filter=new"
              className="mt-3 sm:mt-0 text-sm font-semibold text-[#4F24E8] hover:text-[#431ec9] flex items-center gap-1"
            >
              <span>Explore All New</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Winter Collection Showcase Banner */}
      <section className="py-16 bg-[#171936] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Winter Drop 2026
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Warmth Meets Contemporary Streetwear
              </h2>
            </div>
            <Link
              href="/shop?filter=winter"
              className="mt-3 sm:mt-0 text-sm font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>Explore Winter Catalog</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {winterCollection.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Promotional Banner */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#4F24E8] to-[#171936] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold tracking-wider uppercase">
                DELIED B2B & RESELLER NETWORK
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold">
                Start Your Fashion Business With Zero Inventory Risk
              </h2>
              <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
                Join over 1,200+ active Bangladeshi resellers. Access exclusive reseller pricing, custom customer dispatch, instant automated profit calculation, and verified bKash wallet payouts.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <Link
                  href="/register?role=RESELLER"
                  className="px-6 py-3 rounded-full bg-white text-[#171936] hover:bg-gray-100 font-bold text-sm transition-colors shadow-lg"
                >
                  Apply as Reseller
                </Link>
                <Link
                  href="/register?role=WHOLESALE"
                  className="px-6 py-3 rounded-full bg-transparent hover:bg-white/10 text-white border border-white/30 font-semibold text-sm transition-colors"
                >
                  Wholesale Bulk Tier Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Best Selling Products */}
      <section className="py-16 bg-[#FAF9FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#4F24E8]">
                Customer Favorites
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#171936] mt-1">
                Best Selling Pieces
              </h2>
            </div>
            <Link
              href="/shop?filter=best"
              className="mt-3 sm:mt-0 text-sm font-semibold text-[#4F24E8] hover:text-[#431ec9] flex items-center gap-1"
            >
              <span>View All Best Sellers</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 10. Customer Reviews */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4F24E8]">
              Client Testimonials
            </span>
            <h2 className="font-serif text-3xl font-extrabold text-[#171936] mt-1">
              Loved by Discerning Shoppers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#F5F3FF] border border-gray-100 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-[#171936] leading-relaxed italic">
                  &ldquo;The Jacquard Panjabi fabric quality is incredible. Stitching, mother-of-pearl buttons, and fit are comparable to international designer labels.&rdquo;
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-purple-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#171936] text-white flex items-center justify-center font-bold text-xs">
                  TA
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#171936]">Tanvir Ahmed</h4>
                  <p className="text-[10px] text-gray-500">Verified Buyer • Gulshan, Dhaka</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#F5F3FF] border border-gray-100 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-[#171936] leading-relaxed italic">
                  &ldquo;As a fashion reseller, DELIED&apos;s automated profit tracking and quick bKash withdrawal has changed my boutique business. My customers are thrilled!&rdquo;
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-purple-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#4F24E8] text-white flex items-center justify-center font-bold text-xs">
                  SA
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#171936]">Sumaiya Akter</h4>
                  <p className="text-[10px] text-gray-500">Boutique Reseller • Chittagong</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#F5F3FF] border border-gray-100 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-[#171936] leading-relaxed italic">
                  &ldquo;We ordered 200 pcs of polo shirts for our corporate event via the wholesale portal. Accurate delivery time and exceptional fabric finish.&rdquo;
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-purple-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs">
                  KR
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#171936]">Kamrul Hasan</h4>
                  <p className="text-[10px] text-gray-500">Corporate Buyer • Dhaka</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Brand Introduction */}
      <section className="py-16 bg-[#171936] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#4F24E8]">
                About The Brand
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                The DELIED Philosophy: Craft, Community, & Enterprise.
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                DELIED was founded with a unified ambition: to elevate Bangladeshi festive apparel to the global standard while providing a transparent, tech-powered business platform for entrepreneurs across all 64 districts.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                By uniting retail shoppers, wholesale partners, and resellers under a real-time production costing ERP, we ensure ethical garment production, zero duplicate accounting, and unmatched customer delight.
              </p>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#4F24E8] hover:text-purple-300 transition-colors"
                >
                  <span>Read Our Full Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="font-serif text-3xl sm:text-4xl font-extrabold text-white">100%</span>
                <p className="text-xs text-gray-300 mt-1">Made in Bangladesh</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#4F24E8]">1,200+</span>
                <p className="text-xs text-gray-300 mt-1">Active Resellers</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="font-serif text-3xl sm:text-4xl font-extrabold text-amber-400">64</span>
                <p className="text-xs text-gray-300 mt-1">Districts Covered</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="font-serif text-3xl sm:text-4xl font-extrabold text-emerald-400">24/7</span>
                <p className="text-xs text-gray-300 mt-1">Live Concierge Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
