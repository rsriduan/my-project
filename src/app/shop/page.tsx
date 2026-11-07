'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { useApp } from '@/context/AppContext';
import { Filter, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';

function ShopContent() {
  const { language, t } = useApp();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'ALL');
  const [selectedSort, setSelectedSort] = useState<string>('newest');
  const [selectedSize, setSelectedSize] = useState<string>('ALL');
  const [selectedColor, setSelectedColor] = useState<string>('ALL');
  const [priceRange, setPriceRange] = useState<number>(10000);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();

        setProducts(prodData.products || []);
        setCategories(catData.categories || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  // Update category when query param changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const filter = searchParams.get('filter');
    if (filter === 'winter') setSelectedCategory('winter-collection');
  }, [searchParams]);

  // Filter products
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'ALL' && p.category?.slug !== selectedCategory) {
      return false;
    }
    const currentPrice = p.discountPrice || p.regularPrice;
    if (currentPrice > priceRange) {
      return false;
    }

    if (selectedSize !== 'ALL') {
      try {
        const sizes = JSON.parse(p.sizes || '[]');
        if (!sizes.some((s: string) => s.includes(selectedSize))) return false;
      } catch (e) {}
    }

    if (selectedColor !== 'ALL') {
      try {
        const colors = JSON.parse(p.colors || '[]');
        if (!colors.some((c: string) => c.toLowerCase().includes(selectedColor.toLowerCase()))) {
          return false;
        }
      } catch (e) {}
    }

    return true;
  });

  // Sorting
  filteredProducts.sort((a, b) => {
    const priceA = a.discountPrice || a.regularPrice;
    const priceB = b.discountPrice || b.regularPrice;
    if (selectedSort === 'price-asc') return priceA - priceB;
    if (selectedSort === 'price-desc') return priceB - priceA;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const allSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const allColors = ['Indigo', 'Navy', 'White', 'Charcoal', 'Green', 'Gold'];

  return (
    <div className="bg-[#FAF9FF] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumbs & Title */}
        <div className="mb-8">
          <span className="text-xs uppercase font-bold tracking-widest text-[#4F24E8]">
            DELIED Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#171936] mt-1">
            {language === 'bn' ? 'এক্সক্লুসিভ ফ্যাশন ক্যাটালগ' : 'The Fashion Catalog'}
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Showing {filteredProducts.length} premium pieces curated for luxury comfort
          </p>
        </div>

        {/* Layout: Sidebar Filter & Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Mobile Filter Button */}
          <div className="lg:hidden flex items-center justify-between pb-4">
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-xs font-bold text-[#171936] shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#4F24E8]" />
              <span>Filters & Categories</span>
            </button>

            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold text-[#171936]"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#171936] mb-3">
                  Categories
                </h3>
                <div className="space-y-1.5 text-xs">
                  <button
                    onClick={() => setSelectedCategory('ALL')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg transition-colors flex justify-between ${
                      selectedCategory === 'ALL'
                        ? 'bg-[#4F24E8] text-white font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>All Products</span>
                    <span>{products.length}</span>
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`w-full text-left py-1.5 px-2 rounded-lg transition-colors flex justify-between ${
                        selectedCategory === c.slug
                          ? 'bg-[#4F24E8] text-white font-bold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="truncate">{language === 'bn' ? c.nameBn : c.name}</span>
                      <span>{c._count.products}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="border-t border-gray-100 pt-5">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#171936]">
                    Max Price
                  </h3>
                  <span className="text-xs font-bold text-[#4F24E8]">৳{priceRange.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="250"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#4F24E8] cursor-pointer"
                />
              </div>

              {/* Size Filter */}
              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#171936] mb-2.5">
                  Filter by Size
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedSize('ALL')}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                      selectedSize === 'ALL'
                        ? 'bg-[#171936] text-white border-[#171936]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    All
                  </button>
                  {allSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                        selectedSize === s
                          ? 'bg-[#4F24E8] text-white border-[#4F24E8]'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Filters */}
              {(selectedCategory !== 'ALL' || selectedSize !== 'ALL' || priceRange < 10000) && (
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSelectedSize('ALL');
                    setPriceRange(10000);
                  }}
                  className="w-full py-2 text-xs font-bold text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Product Grid & Top Sort Bar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="hidden lg:flex items-center justify-between bg-white px-5 py-3 rounded-xl border border-gray-100 shadow-sm">
              <span className="text-xs text-gray-500 font-medium">
                Showing {filteredProducts.length} matching fashion items
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Sort By:</span>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="bg-[#F5F3FF] border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-[#171936] focus:outline-none"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-gray-200 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl text-center border border-gray-100 space-y-3">
                <p className="text-gray-500 text-sm">No products found matching your current filter criteria.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSelectedSize('ALL');
                    setPriceRange(10000);
                  }}
                  className="px-4 py-2 bg-[#4F24E8] text-white text-xs font-bold rounded-full"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF9FF] flex items-center justify-center text-xs">Loading shop collection...</div>}>
      <ShopContent />
    </Suspense>
  );
}
