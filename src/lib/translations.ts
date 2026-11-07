export type Language = 'en' | 'bn';
export type Currency = 'BDT' | 'USD';

export const USD_RATE = 122.5;

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    shop: 'Shop',
    categories: 'Categories',
    newArrivals: 'New Arrivals',
    bestSellers: 'Best Sellers',
    winterCollection: 'Winter Collection',
    aboutUs: 'About Us',
    contact: 'Contact',
    searchPlaceholder: 'Search Panjabi, Saree, Hoodies, Polo...',
    cart: 'Cart',
    wishlist: 'Wishlist',
    login: 'Sign In',
    register: 'Join DELIED',
    account: 'My Account',
    logout: 'Sign Out',
    dashboard: 'Dashboard',

    // Roles
    customer: 'Customer',
    reseller: 'Reseller',
    wholesale: 'Wholesale Buyer',
    admin: 'Super Admin',
    staff: 'Company Staff',
    shareholder: 'Shareholder',
    moderator: 'Moderator',
    marketer: 'Marketer',

    // Hero & Promotion
    heroTagline: 'Luxury Bangladeshi Heritage Meets Modern Craft',
    heroTitle: 'Eid & Festive High Fashion Collection 2026',
    heroDescription: 'Experience handcrafted jacquard cotton panjabis, heritage Jamdani sarees, and heavyweight winter outerwear designed for elegance and unmatched comfort.',
    shopNow: 'Explore Collection',
    wholesaleInquiry: 'Wholesale & Reseller Portal',
    announcementText: '✨ FREE Express Delivery inside Dhaka on orders above ৳2,000 | Cash on Delivery Available Nationwide',

    // Badges & Actions
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    lowStock: 'Low Stock',
    sku: 'SKU',
    category: 'Category',
    size: 'Size',
    color: 'Color',
    quantity: 'Quantity',
    price: 'Price',
    resellerPrice: 'Reseller Price',
    wholesalePrice: 'Wholesale Price',
    suggestedRetail: 'Suggested Retail',
    description: 'Description',
    specifications: 'Specifications',
    reviews: 'Customer Reviews',
    relatedProducts: 'You May Also Like',

    // Cart & Checkout
    shoppingCart: 'Shopping Cart',
    cartEmpty: 'Your shopping cart is currently empty.',
    continueShopping: 'Continue Shopping',
    subtotal: 'Subtotal',
    discount: 'Discount',
    deliveryCharge: 'Delivery Charge',
    total: 'Total Amount',
    applyCoupon: 'Apply Coupon',
    couponCode: 'Coupon Code',
    proceedCheckout: 'Proceed to Checkout',
    checkout: 'Checkout',
    customerInfo: 'Customer Information',
    deliveryAddress: 'Delivery Address',
    district: 'District',
    upazila: 'Thana / Upazila',
    paymentMethod: 'Payment Method',
    placeOrder: 'Confirm & Place Order',
    cod: 'Cash on Delivery (COD)',
    bkash: 'bKash Instant Payment',
    nagad: 'Nagad MFS',
    sslcommerz: 'SSLCommerz Gateway (Card/Internet Banking)',

    // Tracking
    orderTracking: 'Track Order',
    orderNumber: 'Order Number',
    orderStatus: 'Order Status',
    trackNow: 'Track Shipment',
  },
  bn: {
    // Navigation
    home: 'হোম',
    shop: 'শপ',
    categories: 'ক্যাটাগরি',
    newArrivals: 'নতুন কালেকশন',
    bestSellers: 'সেরা বিক্রিত',
    winterCollection: 'শীতকালীন পোশাক',
    aboutUs: 'আমাদের সম্পর্কে',
    contact: 'যোগাযোগ',
    searchPlaceholder: 'পাঞ্জাবি, শাড়ি, হুডি, পোলো খুঁজুন...',
    cart: 'ব্যাগ',
    wishlist: 'পছন্দের তালিকা',
    login: 'লগইন',
    register: 'রেজিস্টার',
    account: 'আমার অ্যাকাউন্ট',
    logout: 'লগআউট',
    dashboard: 'ড্যাশবোর্ড',

    // Roles
    customer: 'কাস্টমার',
    reseller: 'রিসেলার',
    wholesale: 'পাইকারি ক্রেতা',
    admin: 'সুপার অ্যাডমিন',
    staff: 'কোম্পানি স্টাফ',
    shareholder: 'শেয়ারহোল্ডার',
    moderator: 'মডারেটর',
    marketer: 'মার্কেটার',

    // Hero & Promotion
    heroTagline: 'অভিজাত ফ্যাশন ও দেশীয় ঐতিহ্য',
    heroTitle: 'ঈদ ও উৎসবের এক্সক্লুসিভ ফ্যাশন কালেকশন ২০২৬',
    heroDescription: 'হাতে বোনা জাকোয়ার্ড তুলা পাঞ্জাবি, ঐতিহ্যবাহী জামদানি শাড়ি ও আরামদায়ক শীতের পোশাক। আভিজাত্য ও সেরা স্বাচ্ছন্দ্যের অনন্য মেলবন্ধন।',
    shopNow: 'কালেকশন দেখুন',
    wholesaleInquiry: 'হোলসেল ও রিসেলার পোর্টাল',
    announcementText: '✨ ২,০০০ টাকার বেশি অর্ডারে ঢাকা সিটিতে ফ্রি হোম ডেলিভারি | সারা দেশে ক্যাশ অন ডেলিভারি সুবিধা',

    // Badges & Actions
    addToCart: 'ব্যাগে যোগ করুন',
    buyNow: 'সরাসরি কিনুন',
    inStock: 'স্টকে আছে',
    outOfStock: 'স্টক শেষ',
    lowStock: 'সীমিত স্টক',
    sku: 'এসকেইউ',
    category: 'ক্যাটাগরি',
    size: 'সাইজ',
    color: 'কালার',
    quantity: 'পরিমাণ',
    price: 'মূল্য',
    resellerPrice: 'রিসেলার মূল্য',
    wholesalePrice: 'হোলসেল মূল্য',
    suggestedRetail: 'প্রস্তাবিত খুচরা মূল্য',
    description: 'পণ্যের বিবরণ',
    specifications: 'বৈশিষ্ট্যসমূহ',
    reviews: 'গ্রাহকদের রিভিউ',
    relatedProducts: 'সম্পর্কিত অন্যান্য পণ্য',

    // Cart & Checkout
    shoppingCart: 'শপিং ব্যাগ',
    cartEmpty: 'আপনার শপিং ব্যাগটি বর্তমানে খালি রয়েছে।',
    continueShopping: 'শপিং চালিয়ে যান',
    subtotal: 'সাব-টোটাল',
    discount: 'ডিসকাউন্ট',
    deliveryCharge: 'ডেলিভারি চার্জ',
    total: 'সর্বমোট মূল্য',
    applyCoupon: 'কুপন প্রয়োগ করুন',
    couponCode: 'কুপন কোড',
    proceedCheckout: 'চেকআউট সম্পন্ন করুন',
    checkout: 'চেকআউট',
    customerInfo: 'গ্রাহকের তথ্য',
    deliveryAddress: 'ডেলিভারি ঠিকানা',
    district: 'জেলা',
    upazila: 'থানা / উপজেলা',
    paymentMethod: 'পেমেন্ট মাধ্যম',
    placeOrder: 'অর্ডার নিশ্চিত করুন',
    cod: 'ক্যাশ অন ডেলিভারি (হাতে পেয়ে মূল্য পরিশোধ)',
    bkash: 'বিকাশ পেমেন্ট',
    nagad: 'নগদ পেমেন্ট',
    sslcommerz: 'এসএসএলকমার্স (কার্ড ও নেট ব্যাংকিং)',

    // Tracking
    orderTracking: 'অর্ডার ট্র্যাকিং',
    orderNumber: 'অর্ডার নম্বর',
    orderStatus: 'অর্ডারের বর্তমান অবস্থা',
    trackNow: 'ট্র্যাক করুন',
  }
};

export function formatPrice(amountBdt: number, currency: Currency = 'BDT'): string {
  if (currency === 'USD') {
    const usd = amountBdt / USD_RATE;
    return `$${usd.toFixed(2)}`;
  }
  return `৳${Math.round(amountBdt).toLocaleString('en-IN')}`;
}
