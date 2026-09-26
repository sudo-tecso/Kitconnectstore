# KITCONNECT MVP — MASTER IMPLEMENTATION SPECIFICATION
Version: 1.0
Date: 2026-08-31
Status: Build Specification
Audience: Antigravity coding agent / developer
Project: KitConnect — Gadget Accessories E-Commerce MVP

---

## 0. PURPOSE

This document is the authoritative implementation specification for the KitConnect MVP.

The objective is to build a production-structured e-commerce web application for a gadget-accessories side business. Customers must be able to browse inventory, search/filter products, add products to a cart, and place orders using either:

1. Cash on Delivery (COD)
2. Mobile Money (MoMo)

Customers must be able to purchase as guests without creating an account. Registered accounts may be supported, but account creation must NOT be required to place an order.

The approved Stitch UI/design system is the visual source of truth. Do not redesign the approved screens unless required for functionality, accessibility, responsiveness, or technical correctness.

Technology stack:
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL via Supabase
- Supabase Auth
- Supabase Storage where needed
- GitHub
- Vercel
- Antigravity for implementation
- lucide-react for icons

Potential MoMo integration must be isolated behind a payment service interface so the specific provider/API can be configured without rewriting checkout/order logic.

IMPORTANT:
This document is the implementation contract. Do not invent major product behavior, payment methods, database structures, order states, or security policies that conflict with this specification.

---

# 1. MVP SCOPE

## 1.1 Customer-facing functionality

Required:
- Home page
- Product catalogue
- Category browsing
- Product search
- Product filtering
- Product detail page
- Cart
- Guest checkout
- Optional customer account
- Contact information collection
- Delivery address collection
- COD payment
- MoMo payment
- Order creation
- Order confirmation
- Order lookup/tracking
- Delivery verification code/OTP
- Responsive desktop/tablet/mobile UI
- Empty states
- Loading states
- Error states

## 1.2 Admin functionality

Required:
- Admin authentication
- Admin dashboard
- Product management
- Category management
- Inventory management
- Order management
- Order status management
- Payment status visibility
- Delivery verification visibility/status
- Customer/order contact information visibility
- Basic operational metrics

## 1.3 Explicitly OUT OF MVP unless later approved

Do not implement these as required MVP features:
- Credit/debit cards
- Wire transfer
- Cryptocurrency
- Subscriptions
- Marketplace/multi-vendor functionality
- Customer reviews/ratings
- Loyalty program
- Advanced analytics
- Complex promotions/coupon engine
- Product bundles with separate inventory rules
- Multi-country shipping
- Multi-currency checkout
- Native iOS/Android applications
- Complex warehouse management
- Automated courier marketplace integration

The MVP should be designed so these can be added later.

---

# 2. PRODUCT / BRAND CONTEXT

Brand:
KitConnect

Business:
Gadget accessories e-commerce.

The approved visual direction is:
"Electronic Precision" / "Tactile Dark Mode"

Approved core design tokens from the Stitch design system:

Background:
- #121315

Surface:
- #0d0e10
- #1b1c1e
- #1f2022
- #292a2c
- #343537
- #38393b

Graphite:
- #16181C
- #1D2025

Primary:
- #b4c5ff

Primary container:
- #608bff

Other approved tokens:
- #002a77
- #002469
- #0053da
- #dbe1ff
- #a9c7ff
- #003063
- #0464c3
- #d9e4ff
- #9AA3AD
- #8A8F98
- #5B5F66
- #26292F
- #8d90a1
- #424655

Typography:
- Hanken Grotesk: primary UI/body/display font
- JetBrains Mono: technical values, prices, IDs, status/metadata where appropriate

Do not introduce arbitrary colors unless required for semantic states such as success, warning, error, or accessibility.

The approved Stitch screens and DESIGN.md take visual precedence over this document for exact spacing/layout where they do not conflict with functional requirements.

---

# 3. USER TYPES

## 3.1 Guest customer

A guest can:
- Browse products
- Search
- Filter
- Add to cart
- Checkout
- Pay by COD
- Pay by MoMo
- Receive/order confirmation
- Track an order
- Complete delivery verification

Guest checkout is mandatory functionality.

A guest does not need:
- Password
- Account registration
- Login

Guest orders must still store enough information to identify and fulfill the order.

Required guest checkout data:
- Full name
- Phone number
- Delivery address
- City/area
- Region/location
- Optional email

Phone number is required.

## 3.2 Registered customer

Optional account functionality:
- Sign up
- Sign in
- View own orders
- View order details
- Reuse saved contact/address data

A registered customer must never be required to create an account to purchase.

## 3.3 Admin

Admin users:
- Authenticate through Supabase Auth
- Must be explicitly authorized as admin
- Can manage catalogue/inventory/orders
- Can see operational customer/order information

Admin access must be protected by server-side authorization and database RLS.

---

# 4. CUSTOMER USER FLOW

## 4.1 Browse flow

Home
→ Catalogue
→ Category/filter/search
→ Product details
→ Add to cart
→ Cart

## 4.2 Checkout flow

Cart
→ Checkout
→ Contact information
→ Delivery address
→ Payment method
→ Order review
→ Submit

If COD:
Checkout
→ Create order
→ Confirm order
→ Generate delivery verification code
→ Confirmation page

If MoMo:
Checkout
→ Create pending payment/order
→ Initiate MoMo payment
→ Customer completes MoMo authorization
→ Provider callback/webhook
→ Server verifies payment
→ Mark payment paid
→ Confirm order
→ Generate delivery verification code
→ Confirmation page

Do not mark MoMo payments as successful merely because the frontend receives a success response. Payment must be verified server-side.

---

# 5. ORDER LIFECYCLE

Canonical order statuses:

- PENDING
- CONFIRMED
- PROCESSING
- READY_FOR_DELIVERY
- OUT_FOR_DELIVERY
- DELIVERED
- CANCELLED
- DELIVERY_FAILED

Recommended lifecycle:

PENDING
→ CONFIRMED
→ PROCESSING
→ READY_FOR_DELIVERY
→ OUT_FOR_DELIVERY
→ DELIVERED

Cancellation:
PENDING → CANCELLED
CONFIRMED → CANCELLED where operationally permitted

Delivery failure:
OUT_FOR_DELIVERY → DELIVERY_FAILED
DELIVERY_FAILED → OUT_FOR_DELIVERY

Do not use fictional statuses such as "Calibrating & Packing". Use real e-commerce operational terminology.

Customer-facing labels may be friendlier, but internal enum values must remain stable.

---

# 6. PAYMENT MODEL

Payment methods:
- COD
- MOMO

Payment statuses:
- PENDING
- PROCESSING
- PAID
- FAILED
- CANCELLED
- REFUNDED

## 6.1 COD

At checkout:
payment_method = COD
payment_status = PENDING

Order can proceed to processing according to the business's operational rules.

When delivery occurs:
- Recipient identity is verified
- Cash is collected
- payment_status becomes PAID
- order_status becomes DELIVERED

If the business chooses to confirm COD payment separately from delivery, preserve payment and order status as independent fields.

## 6.2 MoMo

At checkout:
payment_method = MOMO

The system should:
1. Create an order/payment attempt with pending status.
2. Initiate the provider transaction.
3. Return only safe client-facing payment information.
4. Allow customer to complete payment.
5. Receive provider webhook/callback.
6. Verify transaction server-side.
7. Update payment status.
8. Confirm order only after successful verification.

Webhook handling must be idempotent.

Never expose provider secrets in client-side code.

Do not hard-code a specific MoMo provider into the core order model. Implement a payment adapter/service interface.

Example conceptual interface:

PaymentService:
- initiatePayment()
- verifyPayment()
- handleWebhook()
- normalizeStatus()

Provider-specific implementation can later be configured through environment variables.

---

# 7. DELIVERY VERIFICATION

Because guest checkout is supported, the delivery process needs a recipient-verification mechanism.

Each eligible order should have a delivery verification code/OTP.

Recommended:
- Generate a cryptographically secure short-lived code.
- Store only a secure hash if practical.
- Never display the raw code to admin unnecessarily.
- Customer receives the code through the chosen communication channel when messaging infrastructure exists.
- The customer gives the code to the delivery agent at delivery.
- Agent/admin verifies the code through the delivery workflow.
- Successful verification allows delivery completion.

MVP architecture must support:
- verification code hash
- expiration
- attempt count
- verified timestamp
- verified flag/status

Example:

delivery.status:
- PENDING
- OUT_FOR_DELIVERY
- VERIFIED
- DELIVERED
- FAILED

Do not expose verification codes through public order lookup endpoints.

---

# 8. GUEST ORDER IDENTIFICATION / TRACKING

Customers need a secure way to retrieve their order.

Do NOT rely on a guessable numeric order ID alone.

Internal order ID:
- UUID

Customer-facing order reference:
- Human-readable reference such as KC-XXXXXX

Recommended tracking verification:
- Order reference + phone number, or
- Order reference + one-time verification mechanism

The public tracking endpoint must not allow enumeration of all orders.

A user must not be able to access another person's full order details merely by changing:
`/order-tracking?order=123`

The tracking result should expose only the minimum required:
- order reference
- order status
- ordered items summary
- delivery status
- payment status appropriate for customer visibility
- estimated delivery if available

Never expose:
- internal database IDs unnecessarily
- admin notes
- payment provider secrets
- other customers' information
- delivery verification secret

---

# 9. REQUIRED PUBLIC PAGES

The existing Stitch-designed pages should be implemented.

## 9.1 Home
Route:
`/`

Purpose:
- Brand introduction
- Featured products
- Categories
- Primary shopping CTAs

Data:
- featured products
- active categories
- availability indicators

## 9.2 Product catalogue
Route:
`/products`

Features:
- Product grid
- Category filter
- Price filter
- Availability filter
- Sorting
- Pagination or controlled loading if catalogue grows

Data:
- active products
- categories
- inventory availability

## 9.3 Product details
Route:
`/products/[id]`

Features:
- Product images
- Name
- Price
- Description
- Technical specifications
- Stock state
- Quantity
- Add to cart
- Related products

Do not trust client-provided price/stock during order creation.

## 9.4 Search
Route:
`/search`

Features:
- Search input
- Search results
- Filters
- Empty state
- Result count

Search should query the database once Supabase integration is active.

## 9.5 Cart
Route:
`/cart`

Features:
- Items
- Quantity controls
- Remove item
- Subtotal
- Delivery estimate/fee if known
- Total
- Checkout CTA

Do not treat client-side cart totals as authoritative.

## 9.6 Checkout
Route:
`/checkout`

Sections:
1. Contact information
2. Delivery address
3. Payment method
4. Order summary
5. Submit order

Payment methods:
- Cash on Delivery
- Mobile Money

Remove:
- Credit Card
- Wire
- "Supabase Demo"

unless explicitly approved later.

## 9.7 Order confirmation
Route:
`/order-confirmation/[id]`

Display:
- Order reference
- Confirmation status
- Items summary
- Delivery details
- Payment method
- Payment status where safe
- Track order CTA

## 9.8 Order tracking
Route:
`/order-tracking`

Features:
- Order reference lookup
- Secure customer verification
- Status timeline
- Delivery status
- Appropriate payment status
- Order summary

---

# 10. REQUIRED ADMIN PAGES

Create an authenticated admin area.

Suggested routes:

`/admin`
`/admin/login`
`/admin/products`
`/admin/products/new`
`/admin/products/[id]`
`/admin/categories`
`/admin/inventory`
`/admin/orders`
`/admin/orders/[id]`
`/admin/payments`
`/admin/customers`

## 10.1 Admin dashboard

Show:
- Total orders
- Pending orders
- Orders awaiting delivery
- Delivered orders
- Revenue from paid orders
- Low-stock products
- Recent orders

Keep analytics simple for MVP.

## 10.2 Product management

Admin can:
- Create product
- Edit product
- Activate/deactivate product
- Set price
- Set SKU
- Set category
- Upload images
- Set technical specifications

## 10.3 Inventory

Admin can:
- View current stock
- Adjust stock
- Set low-stock threshold
- View SKU
- See stock state

Never allow customers to directly modify inventory.

## 10.4 Orders

Admin can:
- View orders
- View order details
- Update order status
- View payment status
- View delivery status
- View customer contact/delivery information
- Mark operational events

All sensitive status transitions should be validated server-side.

---

# 11. DATABASE SCHEMA

Use PostgreSQL/Supabase.

Use UUID primary keys unless a strong reason exists otherwise.

Recommended tables:

1. profiles
2. categories
3. products
4. product_images
5. inventory
6. addresses
7. orders
8. order_items
9. payments
10. delivery
11. order_status_history

Optional later:
- promotions
- coupons
- reviews
- notifications

---

# 12. TABLE SPECIFICATIONS

## 12.1 profiles

Purpose:
Registered customer/admin profile.

Fields:
- id UUID PK; references auth.users(id)
- full_name TEXT
- phone TEXT
- email TEXT
- role TEXT/ENUM: CUSTOMER, ADMIN
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

Do not trust client-side role values.

Admin role must be protected from ordinary users.

## 12.2 categories

Fields:
- id UUID PK
- name TEXT NOT NULL
- slug TEXT UNIQUE NOT NULL
- description TEXT
- image_url TEXT
- is_active BOOLEAN DEFAULT true
- sort_order INTEGER DEFAULT 0
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

## 12.3 products

Fields:
- id UUID PK
- category_id UUID FK categories.id
- name TEXT NOT NULL
- slug TEXT UNIQUE NOT NULL
- sku TEXT UNIQUE NOT NULL
- short_description TEXT
- description TEXT
- price NUMERIC(12,2) NOT NULL
- compare_at_price NUMERIC(12,2) NULL
- brand TEXT NULL
- specifications JSONB DEFAULT '{}'
- is_featured BOOLEAN DEFAULT false
- is_active BOOLEAN DEFAULT true
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

Price must be stored as numeric, not floating-point application values.

## 12.4 product_images

Fields:
- id UUID PK
- product_id UUID FK products.id
- image_url TEXT NOT NULL
- alt_text TEXT
- sort_order INTEGER DEFAULT 0
- is_primary BOOLEAN DEFAULT false
- created_at TIMESTAMPTZ

## 12.5 inventory

Fields:
- id UUID PK
- product_id UUID UNIQUE FK products.id
- quantity INTEGER NOT NULL DEFAULT 0
- reserved_quantity INTEGER NOT NULL DEFAULT 0
- low_stock_threshold INTEGER NOT NULL DEFAULT 5
- updated_at TIMESTAMPTZ

Available quantity:
quantity - reserved_quantity

Never allow available quantity to become negative.

## 12.6 addresses

Fields:
- id UUID PK
- profile_id UUID NULL FK profiles.id
- full_name TEXT NOT NULL
- phone TEXT NOT NULL
- address_line_1 TEXT NOT NULL
- address_line_2 TEXT NULL
- city TEXT NOT NULL
- region TEXT NOT NULL
- landmark TEXT NULL
- delivery_notes TEXT NULL
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

Guest addresses are allowed:
profile_id = NULL

For orders, snapshot the address/contact data into the order because customer data may change after the order is placed.

## 12.7 orders

Fields:
- id UUID PK
- order_reference TEXT UNIQUE NOT NULL
- profile_id UUID NULL FK profiles.id
- customer_name TEXT NOT NULL
- customer_phone TEXT NOT NULL
- customer_email TEXT NULL
- delivery_address JSONB NOT NULL
- subtotal NUMERIC(12,2) NOT NULL
- delivery_fee NUMERIC(12,2) NOT NULL DEFAULT 0
- discount NUMERIC(12,2) NOT NULL DEFAULT 0
- total NUMERIC(12,2) NOT NULL
- currency TEXT NOT NULL DEFAULT 'GHS'
- payment_method TEXT/ENUM: COD, MOMO
- order_status TEXT/ENUM as specified above
- notes TEXT NULL
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

Do not calculate final order total from client-supplied values without server validation.

## 12.8 order_items

Fields:
- id UUID PK
- order_id UUID FK orders.id
- product_id UUID FK products.id
- product_name_snapshot TEXT NOT NULL
- sku_snapshot TEXT NOT NULL
- unit_price NUMERIC(12,2) NOT NULL
- quantity INTEGER NOT NULL
- line_total NUMERIC(12,2) NOT NULL
- product_snapshot JSONB NULL
- created_at TIMESTAMPTZ

Snapshot product information so historical orders remain accurate even after product edits.

## 12.9 payments

Fields:
- id UUID PK
- order_id UUID FK orders.id
- payment_reference TEXT UNIQUE
- provider TEXT NULL
- provider_transaction_id TEXT NULL
- method TEXT/ENUM: COD, MOMO
- status TEXT/ENUM:
  PENDING, PROCESSING, PAID, FAILED, CANCELLED, REFUNDED
- amount NUMERIC(12,2) NOT NULL
- currency TEXT DEFAULT 'GHS'
- metadata JSONB DEFAULT '{}'
- paid_at TIMESTAMPTZ NULL
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

Provider transaction IDs should be indexed and unique where appropriate.

## 12.10 delivery

Fields:
- id UUID PK
- order_id UUID UNIQUE FK orders.id
- status TEXT/ENUM:
  PENDING, OUT_FOR_DELIVERY, VERIFIED, DELIVERED, FAILED
- verification_code_hash TEXT NULL
- verification_expires_at TIMESTAMPTZ NULL
- verification_attempts INTEGER DEFAULT 0
- verified_at TIMESTAMPTZ NULL
- delivered_at TIMESTAMPTZ NULL
- estimated_delivery_at TIMESTAMPTZ NULL
- delivery_notes TEXT NULL
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

Never expose verification_code_hash through public APIs.

## 12.11 order_status_history

Fields:
- id UUID PK
- order_id UUID FK orders.id
- from_status TEXT NULL
- to_status TEXT NOT NULL
- changed_by UUID NULL
- reason TEXT NULL
- created_at TIMESTAMPTZ

Purpose:
Auditability and tracking timeline.

---

# 13. DATABASE RELATIONSHIPS

categories
1 → many products

products
1 → many product_images
1 → 1 inventory

profiles
1 → many orders
1 → many addresses

orders
1 → many order_items
1 → 1 payment (or multiple payment attempts if implemented)
1 → 1 delivery
1 → many order_status_history

products
1 → many order_items

---

# 14. INVENTORY RULES

Inventory is authoritative in Supabase.

Never rely only on UI stock state.

At order creation:
1. Fetch/lock current inventory as appropriate.
2. Validate requested quantity.
3. Validate product is active.
4. Validate price from database.
5. Create order/items.
6. Reserve/decrement stock atomically.

For MVP, the preferred approach is a server-side PostgreSQL function/transaction for order creation and inventory changes.

Avoid a naive sequence:
frontend checks stock
→ frontend waits
→ frontend inserts order
→ frontend updates inventory

This creates race conditions.

Use an atomic server-side transaction.

---

# 15. ORDER CREATION TRANSACTION

Create a secure server-side operation such as:

`create_order`

Input:
- optional authenticated profile ID
- customer name
- customer phone
- customer email
- delivery address
- cart items: product IDs + requested quantities
- payment method

Server:
1. Validate required fields.
2. Validate payment method.
3. Load products from database.
4. Ensure all products are active.
5. Load current prices.
6. Load inventory.
7. Validate stock.
8. Calculate subtotal.
9. Calculate delivery fee using server rules.
10. Calculate discount (0 until promotions are implemented).
11. Calculate total.
12. Create order.
13. Create order items using snapshots.
14. Reserve/decrement inventory atomically.
15. Create payment record.
16. Create delivery record.
17. Create initial order status history.
18. Generate customer order reference.
19. Return safe order confirmation data.

The client must never be able to choose:
- final price
- subtotal
- total
- payment status
- order status
- inventory quantity after purchase

---

# 16. DELIVERY FEE

For MVP, delivery fee should be configurable and server-controlled.

Do not hard-code a fee in React components.

Recommended configuration:
- environment variable for a simple global fee, OR
- a future delivery_zones table

For MVP, a simple server-side function/configuration is acceptable.

Example:
`DELIVERY_FEE_GHS=0`

If free delivery is the initial business rule, display accordingly.

---

# 17. AUTHENTICATION

Use Supabase Auth.

Recommended:
- Email/password OR magic-link/OTP depending on final business preference.
- Do not block guest checkout.

Admin:
- authenticated
- role checked server-side
- RLS enforced

Customer:
- can access own profile/orders only

Guest:
- no auth identity required
- order contains customer snapshot fields

Do not store plaintext passwords.

---

# 18. SUPABASE CLIENT ARCHITECTURE

Use separate browser/server utilities.

Recommended:

`src/lib/supabase/client.ts`
Browser client.

`src/lib/supabase/server.ts`
Server client.

`src/lib/supabase/middleware.ts`
Session/middleware support if needed.

Do not expose Supabase service-role key to the browser.

Environment variables:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (server-only, if actually required)

Never prefix service-role secrets with NEXT_PUBLIC_.

---

# 19. RLS REQUIREMENTS

Enable RLS on all relevant tables.

## Public
Can read:
- active categories
- active products
- active product images
- safe inventory availability if desired

Do not expose sensitive inventory details unnecessarily.

## Customer
Authenticated customer can:
- read own profile
- update own profile
- read own orders
- read own order items
- read own addresses
- read own delivery status

## Guest
Guest should use controlled server-side order creation/tracking flows rather than unrestricted table access.

## Admin
Admin can:
- CRUD products/categories
- manage inventory
- read/manage orders
- read/manage payments
- read delivery records
- read operational customer information

RLS must not rely solely on frontend route protection.

---

# 20. SERVER API / SERVICE BOUNDARIES

Use Next.js Route Handlers or Server Actions for sensitive operations.

Suggested boundaries:

`POST /api/orders`
Create order.

`GET /api/orders/track`
Secure public tracking.

`POST /api/payments/momo/initiate`
Initiate MoMo payment.

`POST /api/payments/momo/webhook`
Receive provider webhook.

`POST /api/delivery/verify`
Verify delivery code.

Admin operations may use:
- server actions
- protected route handlers

The exact implementation may vary, but business-critical operations must execute server-side.

---

# 21. REPOSITORY / SERVICE LAYER

Avoid putting raw Supabase queries throughout UI components.

Recommended:

`src/lib/repositories/products.ts`
`src/lib/repositories/orders.ts`
`src/lib/repositories/inventory.ts`
`src/lib/repositories/categories.ts`
`src/lib/repositories/payments.ts`

Services:

`src/lib/services/orderService.ts`
`src/lib/services/paymentService.ts`
`src/lib/services/deliveryService.ts`

This separation makes the application easier to maintain and test.

---

# 22. RECOMMENDED PROJECT STRUCTURE

Suggested structure:

src/
  app/
    page.tsx
    products/
      page.tsx
      [id]/
        page.tsx
    search/
      page.tsx
    cart/
      page.tsx
    checkout/
      page.tsx
    order-confirmation/
      [id]/
        page.tsx
    order-tracking/
      page.tsx

    login/
      page.tsx
    signup/
      page.tsx
    account/
      page.tsx
    account/orders/
      page.tsx
    account/orders/[id]/
      page.tsx

    admin/
      page.tsx
      login/
        page.tsx
      products/
        page.tsx
        new/
          page.tsx
        [id]/
          page.tsx
      categories/
        page.tsx
      inventory/
        page.tsx
      orders/
        page.tsx
        [id]/
          page.tsx
      payments/
        page.tsx
      customers/
        page.tsx

    api/
      orders/
        route.ts
      orders/track/
        route.ts
      payments/momo/initiate/
        route.ts
      payments/momo/webhook/
        route.ts
      delivery/verify/
        route.ts

  components/
    Header.tsx
    MobileNav.tsx
    Footer.tsx
    ProductCard.tsx
    ProductGrid.tsx
    ProductGallery.tsx
    CartItem.tsx
    OrderSummary.tsx
    PaymentSelector.tsx
    OrderStatus.tsx
    OrderTimeline.tsx
    DeliveryVerification.tsx
    LoadingState.tsx
    EmptyState.tsx
    ErrorState.tsx
    TraceLine.tsx

  context/
    CartContext.tsx

  lib/
    supabase/
      client.ts
      server.ts
      middleware.ts
    repositories/
      products.ts
      categories.ts
      orders.ts
      inventory.ts
      payments.ts
    services/
      orderService.ts
      paymentService.ts
      deliveryService.ts
    validations/
      checkout.ts
      product.ts
      order.ts
    mock/
      products.ts

  types/
    database.ts
    product.ts
    order.ts
    payment.ts
    delivery.ts

  middleware.ts

---

# 23. CART ARCHITECTURE

Cart may initially be client-side.

Cart item:
- product ID
- quantity

Do not persist authoritative:
- price
- inventory
- final total

Those are reloaded from the server during checkout.

For guest users:
- localStorage is acceptable for cart persistence.

For registered users:
- local cart may later sync with server.

MVP does not require server-side persistent carts.

---

# 24. PRODUCT DATA

Product cards should display:
- image
- name
- short description/spec
- price
- stock state
- CTA

Stock labels:
- IN STOCK
- LOW STOCK
- OUT OF STOCK

Exact threshold comes from inventory.low_stock_threshold.

If quantity <= 0:
- prevent adding to cart.

If requested quantity exceeds available inventory:
- block checkout and ask user to reduce quantity.

---

# 25. PRODUCT IMAGES

Use Supabase Storage if product images are managed through the admin portal.

Recommended bucket:
`product-images`

Only authenticated admins may upload/delete product images.

Public read access can be enabled if appropriate.

Validate:
- file type
- file size
- image dimensions where appropriate

Do not allow arbitrary executable uploads.

---

# 26. SEARCH

Search should cover:
- product name
- SKU
- description
- brand
- category where useful

Use database queries rather than downloading the entire catalogue to the browser.

For small MVP catalogues, simple PostgreSQL `ILIKE` search is acceptable.

The architecture should allow PostgreSQL full-text search later.

---

# 27. SORTING / FILTERING

Supported MVP filters:
- Category
- Availability
- Price range

Sorting:
- Price low → high
- Price high → low
- Newest
- Popularity if a reliable metric exists

Do not invent a popularity algorithm.

If popularity is not yet available, omit it or use a clearly defined simple metric such as order count only after implemented.

---

# 28. ORDER CONFIRMATION

After successful order creation:
Display:
- KC order reference
- status
- items
- subtotal
- delivery fee
- total
- payment method
- delivery address
- customer contact summary
- tracking CTA

For MoMo:
Do not show "paid" until server verification confirms it.

For COD:
show "Payment due on delivery" / equivalent approved copy.

---

# 29. TRACKING TIMELINE

Customer-facing timeline:

1. Order Placed
2. Order Confirmed
3. Processing
4. Ready for Delivery
5. Out for Delivery
6. Delivered

Cancelled and delivery-failed states should be displayed clearly if they occur.

Do not expose internal audit notes.

---

# 30. ERROR HANDLING

Every major page needs:
- loading state
- empty state
- error state

Checkout errors:
- invalid phone
- missing address
- invalid cart
- product unavailable
- insufficient stock
- payment failure
- network failure

Never silently create duplicate orders after retries.

Use idempotency for order/payment creation where practical.

---

# 31. SECURITY REQUIREMENTS

Mandatory:
- RLS
- server-side authorization
- server-side order validation
- server-side price calculation
- server-side inventory validation
- secure environment variables
- input validation
- output minimization
- protected admin routes
- webhook verification
- payment idempotency
- rate limiting or abuse protection for public order tracking/verification where practical

Never:
- expose service-role key
- trust client payment status
- trust client price
- trust client stock
- expose all orders publicly
- allow customer role escalation
- store plaintext secrets
- put payment provider credentials in source code

Use a schema validation library such as Zod if included in the dependency set.

---

# 32. IDEMPOTENCY

Order submission can be retried due to network failures.

Use a client-generated idempotency key for checkout submission.

Store/check it server-side where appropriate so the same checkout request does not accidentally create duplicate orders.

Payment webhooks must also be idempotent.

If a provider sends the same webhook twice:
- do not create two payments
- do not double-decrement inventory
- do not duplicate order history

---

# 33. DATABASE INDEXES

At minimum consider indexes on:
- products.slug
- products.sku
- products.category_id
- products.is_active
- products.is_featured
- product_images.product_id
- inventory.product_id
- orders.order_reference
- orders.profile_id
- orders.order_status
- orders.created_at
- order_items.order_id
- payments.order_id
- payments.provider_transaction_id
- delivery.order_id
- order_status_history.order_id

Add indexes based on actual query patterns.

---

# 34. SEED DATA

Create development seed data representative of a gadget accessories business.

Examples:
- USB-C cables
- Lightning cables
- USB-C chargers
- Power banks
- Phone cases
- Screen protectors
- Car chargers
- Wireless earbuds
- USB adapters
- Phone stands
- Laptop accessories

Do not use fictional laboratory equipment as the primary product catalogue.

Mock data must match the production database types/interfaces.

---

# 35. DESIGN / UI IMPLEMENTATION RULES

The Stitch UI is approved.

Implement it accurately.

Do not:
- randomly change colors
- replace typography
- remove important visual hierarchy
- introduce unrelated design systems
- replace approved layouts without reason

Do:
- preserve responsiveness
- make buttons functional
- add accessible labels
- add keyboard navigation
- maintain visual hierarchy
- handle long product names
- handle empty states
- handle failed images
- support mobile checkout

Use reusable components rather than duplicating markup.

---

# 36. RESPONSIVE REQUIREMENTS

Minimum:
- mobile
- tablet
- desktop

Test:
- narrow mobile
- standard mobile
- tablet
- laptop
- desktop

Mobile:
- bottom navigation if included in approved UI
- checkout must remain usable
- cart controls must be touch-friendly
- no horizontal overflow

---

# 37. ACCESSIBILITY

Minimum:
- semantic HTML
- keyboard navigation
- visible focus states
- accessible form labels
- sufficient contrast
- alt text for product images
- buttons with meaningful labels
- error messages associated with fields
- no color-only status communication

---

# 38. SEO

Public product/catalogue pages should support:
- metadata
- page titles
- descriptions
- product URLs using slugs where practical
- Open Graph metadata where appropriate

Product pages should be indexable if the business wants search traffic.

Do not index admin pages.

---

# 39. PERFORMANCE

Use Next.js appropriately:
- Server Components by default
- Client Components only when interactivity requires them
- image optimization
- lazy loading where appropriate
- avoid unnecessary client-side data fetching
- paginate large catalogues
- avoid loading the entire product catalogue for search/filtering

Do not turn the entire app into a client-side application unnecessarily.

---

# 40. ENVIRONMENT VARIABLES

Expected:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

MOmo/provider variables should be server-only, for example:

MOMO_API_BASE_URL=
MOMO_API_KEY=
MOMO_API_SECRET=
MOMO_MERCHANT_ID=
MOMO_CALLBACK_URL=

Names can be adjusted to the selected provider.

Optional:
DELIVERY_FEE_GHS=
NEXT_PUBLIC_SITE_URL=

Never commit `.env.local` or secrets to GitHub.

Provide `.env.example`.

---

# 41. GITHUB

Repository should contain:
- source code
- database migration files
- seed scripts
- README
- `.env.example`
- documentation

Do not commit:
- secrets
- production credentials
- `.env.local`
- service-role keys
- provider private keys

Suggested workflow:
- main = production
- feature branches for changes
- pull/merge into main after testing

For a solo MVP, keep Git workflow simple.

---

# 42. VERCEL

Deployment:
GitHub → Vercel → production

Configure production environment variables in Vercel.

Do not depend on local mock data in production unless explicitly enabled.

Recommended environment flag:
`NEXT_PUBLIC_USE_MOCK_DATA=false`

Mock data may be used in development only.

Production should fail clearly if required Supabase configuration is missing rather than silently pretending to be connected.

---

# 43. MOCK DATA POLICY

Mock data is for:
- UI development
- local development
- design verification

Mock data is NOT a substitute for:
- production database
- inventory
- order persistence
- payment state
- security

Avoid code paths where a failed database query silently becomes a fake successful order.

A missing Supabase configuration during development may use mock catalogue data, but order creation should clearly remain development-only and must not mimic a production payment success.

---

# 44. ADMIN AUTHORIZATION MODEL

Recommended:
profiles.role = CUSTOMER | ADMIN

But role must not be editable through an ordinary customer profile update.

Admin role assignment should be performed:
- manually in Supabase, or
- through a secure server-side administrative process

Admin UI must check:
- authenticated session
- role
- authorization

Use middleware for route gating plus server/database enforcement.

---

# 45. BUSINESS RULES

1. Customer may purchase without an account.
2. Phone number is required at checkout.
3. Payment methods are COD and MoMo only.
4. Product price comes from database.
5. Inventory comes from database.
6. Final order total is calculated server-side.
7. Order item product data is snapshotted.
8. Guest order has no profile_id.
9. Registered order may have profile_id.
10. Order reference is human-readable and unique.
11. Internal IDs use UUIDs.
12. Customer tracking must be protected from enumeration.
13. MoMo payment must be verified server-side.
14. COD payment is collected during delivery.
15. Delivery verification is required before completing delivery.
16. Admin operations require authorization.
17. Inventory changes must be atomic.
18. Payment webhook processing must be idempotent.
19. Client-side totals are informational only.
20. Client-side stock is informational only.

---

# 46. ACCEPTANCE CRITERIA

## Catalogue
- Products load from Supabase.
- Only active products are publicly displayed.
- Category filtering works.
- Search works.
- Sorting works.
- Product details display correctly.
- Out-of-stock products cannot be purchased.

## Cart
- Add item.
- Remove item.
- Change quantity.
- Cart survives page refresh for guests.
- Invalid/stale products are handled.

## Guest checkout
- No account required.
- Name required.
- Phone required.
- Address required.
- Payment method required.
- Order can be created.

## COD
- COD order creates payment record with PENDING status.
- Order is persisted.
- Confirmation page displays order reference.
- Delivery can later verify recipient and mark payment paid.

## MoMo
- Payment initiation is server-side.
- Provider secrets never reach browser.
- Webhook is verified.
- Payment state is updated.
- Duplicate webhooks are safe.
- Order is not falsely marked paid.

## Inventory
- Stock cannot become negative.
- Concurrent orders are handled safely.
- Order creation and stock update are atomic.

## Tracking
- Customer can retrieve own order securely.
- Cannot enumerate arbitrary orders.
- Status timeline is accurate.

## Admin
- Unauthorized users cannot access admin.
- Admin can create/edit products.
- Admin can change inventory.
- Admin can process orders.
- Admin can view payment status.
- Admin can see delivery status.

## Responsive UI
- Works on mobile/tablet/desktop.
- No horizontal overflow.
- Checkout remains usable on mobile.

## Security
- RLS enabled.
- Service-role key server-only.
- Input validation active.
- Admin authorization server-side.
- No secrets in repository.

---

# 47. TESTING STRATEGY

Before production:

### Automated
- TypeScript compilation
- ESLint
- production build
- unit tests for pricing/validation where practical
- order calculation tests
- inventory tests
- payment state tests

### Manual
Test:
- guest checkout
- registered checkout
- COD
- MoMo success
- MoMo failure
- duplicate MoMo webhook
- out-of-stock checkout
- quantity exceeding stock
- order tracking
- delivery verification
- cancelled order
- delivery failure
- admin authorization
- mobile layout

---

# 48. IMPLEMENTATION PHASES

Do NOT attempt to build everything as one uncontrolled change.

## Phase 1 — Project foundation
- Next.js
- TypeScript
- Tailwind
- fonts
- Stitch design tokens
- reusable UI primitives
- GitHub
- Vercel baseline

## Phase 2 — Supabase foundation
- Supabase project
- migrations
- enums
- tables
- indexes
- RLS
- seed data
- Storage

## Phase 3 — Storefront
- Home
- catalogue
- categories
- search
- product details

## Phase 4 — Cart
- CartContext
- local persistence
- cart UI
- validation

## Phase 5 — Checkout
- guest checkout
- optional authenticated customer
- address/contact
- server-side validation
- server-side order calculation

## Phase 6 — Order engine
- order creation transaction
- order items
- inventory reservation/decrement
- payment record
- delivery record
- status history

## Phase 7 — COD
- COD checkout
- delivery workflow
- payment collection status

## Phase 8 — MoMo
- payment adapter
- initiation
- callback/webhook
- verification
- idempotency
- failure handling

## Phase 9 — Tracking + delivery verification
- public tracking
- secure order lookup
- delivery verification
- delivery completion

## Phase 10 — Admin
- admin authentication
- dashboard
- products
- categories
- inventory
- orders
- payments
- customers

## Phase 11 — Security / QA
- RLS review
- authorization review
- input validation
- rate limiting
- error handling
- accessibility
- responsive QA

## Phase 12 — Production
- production Supabase
- Vercel environment variables
- domain
- production testing
- monitoring/logging
- backup strategy

---

# 49. ANTIGRAVITY OPERATING RULES

1. Treat this document as the master MVP technical specification.
2. Inspect existing Stitch UI and DESIGN.md before modifying UI.
3. Preserve approved visual design.
4. Do not add unapproved payment methods.
5. Do not omit guest checkout.
6. Do not omit admin.
7. Do not omit inventory.
8. Do not omit delivery verification.
9. Do not trust client-side prices or stock.
10. Do not expose secrets.
11. Do not implement production order creation solely in client code.
12. Do not use mock data as a hidden production fallback.
13. Keep payment provider logic isolated.
14. Use migrations for database changes.
15. Use RLS.
16. Test each phase before moving to the next.
17. When requirements are ambiguous, choose the smallest implementation consistent with this specification and document the decision.
18. Do not invent features simply to make screens look populated.
19. Use realistic gadget-accessory seed data.
20. Keep the code modular so Phase 2 features can be added without rewriting the MVP.

---

# 50. IMPORTANT CORRECTIONS TO THE PREVIOUS STOREfront PLAN

The previous storefront implementation plan included:
- Credit Card
- Wire
- Supabase Demo

These are NOT KitConnect MVP payment methods.

Replace them with:
- Cash on Delivery
- Mobile Money

The previous fictional product examples should be replaced with realistic gadget-accessory development seed data.

The previous tracking labels:
- Order Placed
- Calibrating & Packing
- Dispatched
- In Transit
- Delivered

should be replaced internally with:
- PENDING
- CONFIRMED
- PROCESSING
- READY_FOR_DELIVERY
- OUT_FOR_DELIVERY
- DELIVERED

Customer-facing labels can be polished for the Stitch UI, but must map to the canonical internal statuses.

---

# 51. FINAL MVP ARCHITECTURE

High-level:

Customer Browser
        |
        v
Vercel / Next.js
        |
        +----------------------+
        |                      |
        v                      v
Client UI                 Server Layer
                              |
                  +-----------+-----------+
                  |           |           |
                  v           v           v
              Products      Orders      Payments
                  |           |           |
                  |           v           v
                  |       Inventory      MoMo
                  |           |
                  |           v
                  |       Delivery
                  |           |
                  +-----------+
                              |
                              v
                         Supabase
                              |
              +---------------+---------------+
              |               |               |
              v               v               v
          PostgreSQL         Auth          Storage
              |
              v
        RLS + Transactions

Admin Browser
        |
        v
Vercel / Next.js
        |
        v
Protected Server Layer
        |
        v
Supabase

---

# 52. MVP SUCCESS DEFINITION

The KitConnect MVP is complete only when this end-to-end scenario works:

1. Admin creates a gadget product.
2. Product appears in the public catalogue.
3. Customer browses product.
4. Customer adds product to cart.
5. Customer checks out as guest.
6. Customer enters name, phone, and delivery address.
7. Customer selects COD or MoMo.
8. Server validates price and stock.
9. Order is created.
10. Inventory is safely updated/reserved.
11. Payment record is created.
12. Delivery record is created.
13. Customer receives order reference.
14. Customer can securely track the order.
15. Admin sees the order.
16. Admin processes the order.
17. Order moves to out-for-delivery.
18. Customer provides delivery verification code.
19. Recipient is verified.
20. COD is collected if applicable.
21. Payment becomes paid.
22. Order becomes delivered.
23. Inventory reflects the completed sale.
24. The entire workflow is auditable.

If this scenario works reliably, KitConnect has a real MVP rather than only a polished storefront.

END OF SPECIFICATION
