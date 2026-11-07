# DELIED REST API Documentation

All API endpoints return JSON responses. Privileged endpoints verify session cookies and RBAC permissions.

---

## 1. Authentication & Session

### `POST /api/auth/login`
Authenticates a user via standard credentials or instant demo role login.
* **Request Body:**
  ```json
  {
    "email": "customer@delied.com",
    "password": "delied123",
    "demoRole": "ADMIN" // Optional: triggers instant demo role authentication
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "user": {
      "userId": "uuid",
      "email": "admin@delied.com",
      "name": "Mahmudur Rahman",
      "role": "ADMIN",
      "status": "ACTIVE"
    }
  }
  ```

### `POST /api/auth/register`
Creates a new account for Customer, Reseller, or Wholesale Buyer.
* **Request Body:**
  ```json
  {
    "name": "Sumaiya Akter",
    "email": "reseller@domain.com",
    "password": "secure_password",
    "phone": "+8801912345678",
    "role": "RESELLER",
    "businessName": "Chittagong Fashion Hub",
    "district": "Chittagong",
    "upazila": "Kotwali"
  }
  ```

### `GET /api/auth/me`
Returns current authenticated session user and associated role profile.

### `POST /api/auth/logout`
Destroys the session cookie.

---

## 2. Products & Catalog

### `GET /api/products`
Lists published products with optional filtering.
* **Query Parameters:**
  * `category`: Slug of the category (e.g. `mens-panjabi-kurta`)
  * `filter`: `featured`, `new`, `best`, `winter`
  * `minPrice`, `maxPrice`: Numerical price boundaries
  * `sort`: `price-asc`, `price-desc`, `newest`

### `POST /api/products` *(Admin / Staff only)*
Creates a new product SKU with production costing.

---

## 3. Orders & Fulfillment

### `GET /api/orders`
Fetches orders based on authenticated role:
* **Admin / Staff / Moderator:** View all orders.
* **Customer:** Only user's retail orders.
* **Reseller:** Orders placed by reseller.
* **Wholesale:** User's bulk wholesale consignments.
* **Public Tracking:** If `?orderNumber=DEL-2026-1001` is passed, returns order status and timeline publicly.

### `POST /api/orders`
Places a new retail, reseller, or wholesale order. Automatically deducts inventory stock and records immutable `StockMovement` audit logs.

### `PATCH /api/orders/:id/status` *(Admin / Staff / Moderator)*
Updates order progression state (`PENDING` $\to$ `CONFIRMED` $\to$ `PROCESSING` $\to$ `READY_TO_SHIP` $\to$ `SHIPPED` $\to$ `DELIVERED` $\to$ `CANCELLED`).
* Automatically credits reseller wallet upon `DELIVERED`.
* Automatically restocks product inventory upon `CANCELLED`.

---

## 4. Reseller Wallet & Payouts

### `GET /api/reseller/wallet` *(Reseller only)*
Returns balance, lifetime earnings, total withdrawn, and transaction ledger.

### `POST /api/reseller/wallet` *(Reseller only)*
Submits a withdrawal request to bKash, Nagad, or Bank.

### `PATCH /api/reseller/withdrawals` *(Admin only)*
Reviews and approves a withdrawal request, deducting balance and logging audit trail.

---

## 5. Company ERP & Costing

### `GET /api/erp/costing`
Returns 8-point costing breakdowns across fabric, accessories, printing, packaging, labour, overhead, and other.

### `POST /api/erp/costing`
Recalculates product costing according to the PRD production cost equation.

### `GET /api/erp/finance`
Returns live balance sheet, current assets, supplier payables, retained equity, and general ledger.

### `POST /api/erp/finance`
Records debit/credit transaction entries against financial accounts.

---

## 6. Support & Live Chat

### `GET /api/chat`
Fetches active live chat sessions and messages.

### `POST /api/chat`
Sends a message between customer and concierge moderator.
