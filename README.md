# DELIED — Fashion E-commerce & Business Management Platform

> **Product Type:** Multi-role E-commerce + Reseller + Wholesale + Company ERP  
> **Target Market:** Bangladesh | **Currency:** BDT (৳) & USD ($) | **Languages:** English & Bangla (বাংলা)  
> **Architecture:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Prisma ORM + Relational Database

---

## 🌟 Executive Summary

**DELIED** is a unified fashion e-commerce and enterprise business ecosystem built for the Bangladesh market. It connects customers, independent boutique resellers, wholesale bulk buyers, company staff, shareholders, customer support moderators, affiliate marketers, and administrators through one single centralized database.

---

## 👥 Eight Role Portals & Demo Credentials

Every role has a separate dedicated dashboard with independent permissions enforced server-side. For evaluation and testing, you can sign in with **one click** on the `/login` page or use the credentials below:

| # | Role | Email | Password | Dedicated Dashboard | Primary Capabilities |
|---|---|---|---|---|---|
| **1** | **Super Admin** | `admin@delied.com` | `delied123` | [`/dashboard/admin`](http://localhost:3000/dashboard/admin) | Full control center, user approvals, order workflow commits, ERP, audit logs, db backup |
| **2** | **Retail Customer** | `customer@delied.com` | `delied123` | [`/dashboard/customer`](http://localhost:3000/dashboard/customer) | My orders, live parcel tracking, wishlist, returns/exchanges, support tickets |
| **3** | **Boutique Reseller** | `reseller@delied.com` | `delied123` | [`/dashboard/reseller`](http://localhost:3000/dashboard/reseller) | Custom selling price setter, net profit calculator, client dispatch, bKash wallet withdrawals |
| **4** | **Wholesale Buyer** | `wholesale@delied.com` | `delied123` | [`/dashboard/wholesale`](http://localhost:3000/dashboard/wholesale) | Bulk catalog, Minimum Order Quantity (MOQ) validation, tier discounts (25%-35%), invoices |
| **5** | **Company Staff** | `staff@delied.com` | `delied123` | [`/dashboard/staff`](http://localhost:3000/dashboard/staff) | Production batches, raw materials inventory, 8-point costing formula, balance sheet |
| **6** | **Shareholder** | `shareholder@delied.com` | `delied123` | [`/dashboard/shareholder`](http://localhost:3000/dashboard/shareholder) | Equity shares (15%), approved dividend payouts, audited financial statements, AGM minutes |
| **7** | **Moderator** | `moderator@delied.com` | `delied123` | [`/dashboard/moderator`](http://localhost:3000/dashboard/moderator) | Live customer care chat inbox, dispute resolution, size exchange tickets, review approvals |
| **8** | **Growth Marketer** | `marketer@delied.com` | `delied123` | [`/dashboard/marketer`](http://localhost:3000/dashboard/marketer) | Campaign creation, affiliate UTM links, order attribution, 6.5% commission reporting |

---

## 🛍️ Public Website Features

1. **Homepage:** All 13 PRD sections implemented:
   * Announcement Bar with nationwide delivery hotline
   * Luxury Header with dual language (EN / বাংলা) and currency (BDT ৳ / USD $) toggles
   * Hero Banner showcasing festive Panjabi and Jamdani collections
   * New Arrivals, Best Sellers, Featured Categories, Winter Collection
   * Promotional B2B Reseller Banner, Recommended Products, Customer Testimonials
   * Brand Introduction, Newsletter Subscription, and Bangladesh Payment Badges
2. **Shop Catalog (`/shop`):** Live category filters, price range slider (৳500 - ৳10,000), size (S/M/L/XL/XXL), colorway filters, and sorting.
3. **Product Details (`/product/[slug]`):** Multi-image gallery, interactive size/color selectors, live stock status, specifications sheet, client reviews, quick add to bag, and instant buy now.
4. **Shopping Cart (`/cart`):** Quantity adjustments, coupon validator (`DELIED10`, `EID2026`, `WELCOME50`), delivery zone selector (Dhaka ৳60 vs Outside Dhaka ৳120).
5. **Checkout (`/checkout`):** 64 Bangladesh Districts and Upazilas with automated shipping calculation, Payment methods (Cash on Delivery, bKash, Nagad, SSLCommerz).
6. **Order Confirmation (`/order/[orderNumber]`):** Digital tax invoice with print support.
7. **Order Tracking (`/track-order`):** Real-time multi-step progress stepper (Pending $\to$ Confirmed $\to$ Processing $\to$ Ready to Ship $\to$ Shipped $\to$ Delivered).
8. **Interactive 24/7 Live Concierge Widget:** Real-time customer chat with instant responses, quick questions, and moderator queue routing.

---

## ⚙️ Mathematical & Business Engines

### Product Costing Formula (PRD Section 6)
$$\text{Total Production Cost} = \text{Fabric} + \text{Accessories} + \text{Printing} + \text{Labels} + \text{Packaging} + \text{Labour} + \text{Overhead} + \text{Other}$$

### Reseller Pricing Engine (PRD Section 5)
* Reseller buys at **Base Reseller Price**.
* Reseller chooses custom selling price within boundary: $\text{Base Reseller Price} \le \text{Selling Price} \le 1.30 \times \text{Suggested MSRP}$.
* Profit is calculated automatically and credited to wallet upon confirmed delivery.

### Wholesale Bulk Tiers (PRD Section 5)
* **Tier 1:** Base wholesale rate (MOQ 20-40 pcs).
* **Tier 2:** $+3\%$ extra discount for orders $\ge 2 \times \text{MOQ}$.
* **Tier 3:** $+7\%$ extra discount for orders $\ge 5 \times \text{MOQ}$.

---

## 🚀 Quickstart & Installation

```bash
# 1. Install dependencies
npm install

# 2. Push Prisma database schema (creates SQLite dev.db)
npm run prisma:push

# 3. Seed database with all 8 demo accounts, products, ERP accounts, orders
npm run prisma:seed

# 4. Run automated test suite (Vitest)
npm test

# 5. Build production bundle
npm run build

# 6. Start production server
npm start
```
The application will be live at `http://localhost:3000`.

---

## 🧪 Automated Testing

Run the test suite:
```bash
npm test
```
Tests verify:
* 8-point ERP production costing equation
* Reseller profit calculations and anti-price gouging boundary enforcement
* Wholesale MOQ threshold validation and tier volume discounts
* Role-Based Access Control (RBAC) permission logic
* Bangladesh district shipping charge calculations (Dhaka ৳60 vs Outside Dhaka ৳120)

---

## 📁 Repository Structure

```
├── docs/
│   ├── ARCHITECTURE.md          # System architecture, RBAC matrix & formulas
│   ├── API_DOCUMENTATION.md     # Complete REST API specifications
│   └── DEPLOYMENT_GUIDE.md      # Linux / PM2 / Nginx / Backup setup
├── prisma/
│   ├── schema.prisma            # 24 relational models
│   └── seed.js                  # Database seeder (8 roles, catalog, accounts)
├── src/
│   ├── app/
│   │   ├── api/                 # 17 REST API endpoints
│   │   ├── dashboard/           # All 8 role dashboards
│   │   │   ├── admin/           # Super Admin Control Center
│   │   │   ├── customer/        # Customer Orders & Returns
│   │   │   ├── reseller/        # Reseller Catalog & Wallet
│   │   │   ├── wholesale/       # Wholesale Bulk & Invoices
│   │   │   ├── staff/           # Company Costing & ERP
│   │   │   ├── shareholder/     # Shareholder Dividends & Reports
│   │   │   ├── moderator/       # Support Tickets & Live Chat
│   │   │   └── marketer/        # Affiliate Links & Campaigns
│   │   ├── product/[slug]/      # Product Details Page
│   │   ├── shop/                # Fashion Catalog with live filters
│   │   ├── cart/                # Cart & Coupon calculation
│   │   ├── checkout/            # Bangladesh Shipping & Gateways
│   │   ├── order/[orderNumber]/ # Invoice & Order Confirmation
│   │   ├── track-order/         # Live Parcel Tracker
│   │   ├── login/ & register/   # Unified Auth & Instant Demo Login
│   │   └── (policy pages)/      # About, Contact, FAQ, Returns, Shipping, Privacy, Terms
│   ├── components/              # Navbar, Footer, ProductCard, LiveChatWidget
│   ├── context/                 # Language, Currency (BDT/USD), Cart & Auth State
│   └── lib/                     # Auth, Bangladesh Locations, Pricing Engine, Prisma
└── tailwind.config.js           # Design system tokens (Royal Indigo #4F24E8, Deep Navy #171936)
```
