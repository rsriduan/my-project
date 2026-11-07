'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    nameBn: string;
    slug: string;
    sku: string;
    regularPrice: number;
    discountPrice?: number | null;
    wholesalePrice: number;
    resellerPrice: number;
    suggestedRetailPrice: number;
    minWholesaleQty: number;
    stockQuantity: number;
    images: string | string[];
    isNewArrival?: boolean;
    isBestSeller?: boolean;
    isWinterCollection?: boolean;
    category?: { name: string; nameBn: string; slug: string };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { language, formatPriceAmount, addToCart, toggleWishlist, isInWishlist, user } = useApp();

  let imagesList: string[] = [];
  try {
    imagesList = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
  } catch (e) {
    imagesList = [];
  }
  const mainImage = imagesList[0] || 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800';

  const discountPercent = product.discountPrice
    ? Math.round(((product.regularPrice - product.discountPrice) / product.regularPrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      name: language === 'bn' ? product.nameBn : product.name,
      sku: product.sku,
      price: product.discountPrice || product.regularPrice,
      quantity: 1,
      image: mainImage,
      size: 'M',
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden luxury-card-hover flex flex-col justify-between">
      {/* Product Image & Badges */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-rose-600 text-white shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-[#4F24E8] text-white shadow-sm">
              NEW
            </span>
          )}
          {product.isWinterCollection && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-600 text-white shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              WINTER
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-800 text-white shadow-sm">
              HOT
            </span>
          )}
        </div>

        {/* Floating Action Buttons */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleWishlist}
            className={`p-2 rounded-full shadow-md transition-colors ${
              isInWishlist(product.id)
                ? 'bg-rose-50 text-rose-600'
                : 'bg-white/90 text-gray-700 hover:text-rose-600 hover:bg-white'
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
          </button>
          <Link
            href={`/product/${product.slug}`}
            className="p-2 rounded-full bg-white/90 text-gray-700 hover:text-[#4F24E8] hover:bg-white shadow-md transition-colors"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={handleQuickAdd}
            className="w-full py-2 px-3 rounded-lg bg-white text-[#171936] text-xs font-bold hover:bg-[#4F24E8] hover:text-white transition-colors flex items-center justify-center gap-1.5 shadow-lg"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'ব্যাগে নিন' : 'Quick Add'}</span>
          </button>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-3.5 flex flex-col gap-1.5">
        {product.category && (
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
            {language === 'bn' ? product.category.nameBn : product.category.name}
          </span>
        )}

        <Link
          href={`/product/${product.slug}`}
          className="text-sm font-semibold text-[#171936] hover:text-[#4F24E8] transition-colors line-clamp-1"
          title={product.name}
        >
          {language === 'bn' ? product.nameBn : product.name}
        </Link>

        {/* Retail Price */}
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-base font-extrabold text-[#171936]">
            {formatPriceAmount(product.discountPrice || product.regularPrice)}
          </span>
          {product.discountPrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatPriceAmount(product.regularPrice)}
            </span>
          )}
        </div>

        {/* Role-Specific Pricing Badges */}
        {user?.role === 'RESELLER' && (
          <div className="mt-1 pt-1.5 border-t border-dashed border-gray-100 text-[11px] text-purple-700 bg-purple-50 p-1.5 rounded">
            <div className="flex justify-between font-semibold">
              <span>Reseller Price:</span>
              <span>{formatPriceAmount(product.resellerPrice)}</span>
            </div>
            <div className="flex justify-between text-[10px] text-purple-600">
              <span>Potential Margin:</span>
              <span>+ {formatPriceAmount(product.suggestedRetailPrice - product.resellerPrice)}</span>
            </div>
          </div>
        )}

        {user?.role === 'WHOLESALE' && (
          <div className="mt-1 pt-1.5 border-t border-dashed border-gray-100 text-[11px] text-blue-700 bg-blue-50 p-1.5 rounded">
            <div className="flex justify-between font-semibold">
              <span>Wholesale Bulk:</span>
              <span>{formatPriceAmount(product.wholesalePrice)}</span>
            </div>
            <span className="text-[10px] text-blue-600 block">
              MOQ: {product.minWholesaleQty} pcs required
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
