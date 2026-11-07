'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Star,
  Check,
  Sparkles,
  Share2,
  DollarSign,
  Package,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailsClient({
  product,
  relatedProducts,
}: {
  product: any;
  relatedProducts: any[];
}) {
  const router = useRouter();
  const { language, formatPriceAmount, addToCart, toggleWishlist, isInWishlist, user } = useApp();

  let images: string[] = [];
  try {
    images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
  } catch (e) {
    images = [];
  }
  if (images.length === 0) {
    images = ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800'];
  }

  let sizes: string[] = [];
  try {
    sizes = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes;
  } catch (e) {}

  let colors: string[] = [];
  try {
    colors = typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors;
  } catch (e) {}

  let specs: Record<string, string> = {};
  try {
    specs = typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications;
  } catch (e) {}

  const [selectedImage, setSelectedImage] = useState<string>(images[0]);
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] || 'Standard');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [addedAlert, setAddedAlert] = useState(false);

  const price = product.discountPrice || product.regularPrice;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: language === 'bn' ? product.nameBn : product.name,
      sku: product.sku,
      price,
      quantity,
      image: selectedImage,
      size: selectedSize,
      color: selectedColor,
    });
    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart({
      productId: product.id,
      name: language === 'bn' ? product.nameBn : product.name,
      sku: product.sku,
      price,
      quantity,
      image: selectedImage,
      size: selectedSize,
      color: selectedColor,
    });
    router.push('/checkout');
  };

  return (
    <div className="bg-[#FAF9FF] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-6 flex items-center space-x-2">
          <Link href="/" className="hover:text-[#4F24E8]">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#4F24E8]">Shop</Link>
          <span>/</span>
          <span className="text-[#171936] font-semibold">{product.name}</span>
        </div>

        {/* Added to Bag Toast */}
        {addedAlert && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-600 text-white flex items-center justify-between shadow-lg animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span className="text-sm font-bold">
                {product.name} ({quantity} pcs, Size: {selectedSize}) added to your shopping bag!
              </span>
            </div>
            <Link
              href="/cart"
              className="px-4 py-1.5 rounded-full bg-white text-emerald-800 text-xs font-bold hover:bg-emerald-50"
            >
              View Bag & Checkout
            </Link>
          </div>
        )}

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
          {/* Gallery (Col 1-6) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover object-top"
              />
              {product.discountPrice && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-rose-600 text-white text-xs font-extrabold uppercase rounded-full shadow-md">
                  SALE
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImage === img ? 'border-[#4F24E8] scale-105' : 'border-gray-200 opacity-70'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Actions (Col 7-12) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-widest text-[#4F24E8]">
                  {product.category?.name || 'Exclusive Fashion'}
                </span>
                <span className="text-xs text-gray-400 font-mono">SKU: {product.sku}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#171936] mt-2">
                {language === 'bn' ? product.nameBn : product.name}
              </h1>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-3 p-4 rounded-xl bg-[#F5F3FF] border border-purple-100">
              <span className="text-3xl font-extrabold text-[#171936]">
                {formatPriceAmount(price)}
              </span>
              {product.discountPrice && (
                <span className="text-base text-gray-400 line-through">
                  {formatPriceAmount(product.regularPrice)}
                </span>
              )}
              {product.discountPrice && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                  Save {formatPriceAmount(product.regularPrice - product.discountPrice)}
                </span>
              )}
            </div>

            {/* Reseller Advantage Box */}
            {user?.role === 'RESELLER' && (
              <div className="p-4 rounded-xl bg-purple-900 text-white space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-amber-300" />
                    Reseller Base Price:
                  </span>
                  <span className="text-sm font-bold text-amber-300">
                    {formatPriceAmount(product.resellerPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-purple-200">
                  <span>Suggested Retail: {formatPriceAmount(product.suggestedRetailPrice)}</span>
                  <span>Estimated Profit: {formatPriceAmount(product.suggestedRetailPrice - product.resellerPrice)}</span>
                </div>
              </div>
            )}

            {/* Wholesale Tier Notice */}
            {user?.role === 'WHOLESALE' && (
              <div className="p-4 rounded-xl bg-blue-900 text-white space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold flex items-center gap-1">
                    <Package className="w-4 h-4 text-blue-300" />
                    Wholesale Price (MOQ {product.minWholesaleQty} pcs):
                  </span>
                  <span className="text-sm font-bold text-amber-300">
                    {formatPriceAmount(product.wholesalePrice)} / pc
                  </span>
                </div>
              </div>
            )}

            {/* Size Selector */}
            {sizes.length > 0 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#171936] mb-2">
                  Select Size: <span className="text-[#4F24E8] font-semibold">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors ${
                        selectedSize === s
                          ? 'bg-[#171936] text-white border-[#171936]'
                          : 'bg-white text-gray-800 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {colors.length > 0 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#171936] mb-2">
                  Color: <span className="text-[#4F24E8] font-semibold">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        selectedColor === c
                          ? 'bg-[#4F24E8] text-white border-[#4F24E8]'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Stock Status */}
            <div className="flex items-center gap-6 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#171936] mb-1.5">
                  Quantity
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-bold text-[#171936]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-[#171936] mb-1.5">
                  Availability
                </span>
                {product.stockQuantity > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    In Stock ({product.stockQuantity} available)
                  </span>
                ) : (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1.5 rounded-lg">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity <= 0}
                className="flex-1 py-3.5 px-6 rounded-full bg-[#171936] hover:bg-[#4F24E8] text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stockQuantity <= 0}
                className="flex-1 py-3.5 px-6 rounded-full bg-[#4F24E8] hover:bg-[#431ec9] text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Instant Buy Now</span>
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-full border border-gray-200 transition-colors ${
                  isInWishlist(product.id)
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-white text-gray-700 hover:text-rose-600'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Trust Assurances */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-100 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#4F24E8]" />
                <span>Express Courier</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>7 Days Return</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Original Guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Section: Description, Specifications, Reviews */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm">
          <div className="flex border-b border-gray-100 gap-8 text-sm font-bold">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-3 transition-colors ${
                activeTab === 'desc'
                  ? 'border-b-2 border-[#4F24E8] text-[#4F24E8]'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              Description & Artisan Notes
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 transition-colors ${
                activeTab === 'specs'
                  ? 'border-b-2 border-[#4F24E8] text-[#4F24E8]'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 transition-colors ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-[#4F24E8] text-[#4F24E8]'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              Client Reviews ({product.reviews?.length || 0})
            </button>
          </div>

          <div className="pt-6">
            {activeTab === 'desc' && (
              <div className="space-y-4 max-w-3xl text-sm text-gray-700 leading-relaxed">
                <p>{product.description}</p>
                {product.descriptionBn && (
                  <p className="font-bengali text-gray-600 border-l-4 border-[#4F24E8] pl-3 py-1">
                    {product.descriptionBn}
                  </p>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-2xl">
                <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100 text-xs">
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} className="flex py-3 px-4 bg-white even:bg-gray-50/50">
                      <span className="w-1/3 font-bold text-[#171936]">{key}</span>
                      <span className="w-2/3 text-gray-600">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6 max-w-3xl">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev: any) => (
                    <div key={rev.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#171936]">{rev.customer?.name}</span>
                        <div className="flex text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">No reviews yet for this product. Be the first to review!</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-[#171936] mb-6">
              You May Also Admire
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
