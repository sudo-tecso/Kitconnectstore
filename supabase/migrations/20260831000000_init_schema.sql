-- KitConnect Database Migration Schema
-- Master Specification & Security Rules Compliant

-- 1. Create Enums
CREATE TYPE user_role_enum AS ENUM ('CUSTOMER', 'ADMIN');

CREATE TYPE order_status_enum AS ENUM (
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'READY_FOR_DELIVERY',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'DELIVERY_FAILED'
);

CREATE TYPE payment_status_enum AS ENUM (
  'PENDING',
  'PROCESSING',
  'PAID',
  'FAILED',
  'CANCELLED',
  'REFUNDED'
);

CREATE TYPE payment_method_enum AS ENUM (
  'COD',
  'MOMO'
);

CREATE TYPE delivery_status_enum AS ENUM (
  'PENDING',
  'OUT_FOR_DELIVERY',
  'VERIFIED',
  'DELIVERED',
  'FAILED'
);

-- 2. Create Tables
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  role user_role_enum NOT NULL DEFAULT 'CUSTOMER',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT,
  price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(12,2) CHECK (compare_at_price IS NULL OR compare_at_price >= 0),
  brand TEXT,
  specifications JSONB NOT NULL DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID UNIQUE NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  reserved_quantity INT NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
  low_stock_threshold INT NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  region TEXT NOT NULL,
  landmark TEXT,
  delivery_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_reference TEXT UNIQUE NOT NULL,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  delivery_address JSONB NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
  discount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total NUMERIC(12,2) NOT NULL CHECK (total >= 0),
  currency TEXT NOT NULL DEFAULT 'GHS',
  payment_method payment_method_enum NOT NULL,
  order_status order_status_enum NOT NULL DEFAULT 'PENDING',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name_snapshot TEXT NOT NULL,
  sku_snapshot TEXT NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
  quantity INT NOT NULL CHECK (quantity > 0),
  line_total NUMERIC(12,2) NOT NULL CHECK (line_total >= 0),
  product_snapshot JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  payment_reference TEXT UNIQUE NOT NULL,
  provider TEXT,
  provider_transaction_id TEXT,
  method payment_method_enum NOT NULL,
  status payment_status_enum NOT NULL DEFAULT 'PENDING',
  amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'GHS',
  metadata JSONB NOT NULL DEFAULT '{}',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE delivery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status delivery_status_enum NOT NULL DEFAULT 'PENDING',
  verification_code_hash TEXT,
  verification_expires_at TIMESTAMPTZ,
  verification_attempts INT NOT NULL DEFAULT 0,
  verified_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  estimated_delivery_at TIMESTAMPTZ,
  delivery_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status order_status_enum,
  to_status order_status_enum NOT NULL,
  changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE rate_limit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  action_type TEXT NOT NULL,
  attempt_count INT NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Indexes
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_reference ON orders(order_reference);
CREATE INDEX idx_orders_phone ON orders(customer_phone);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_provider_tx ON payments(provider_transaction_id);
CREATE INDEX idx_delivery_order ON delivery(order_id);
CREATE INDEX idx_rate_limit_ip_action ON rate_limit_logs(ip_address, action_type);

-- 4. Enable Row-Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Public catalogue read access
CREATE POLICY "Public categories read" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public products read" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public product images read" ON product_images FOR SELECT USING (true);

-- Admin full access policies helper check
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id AND role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin policies
CREATE POLICY "Admin full categories" ON categories FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admin full products" ON products FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admin full product images" ON product_images FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admin full inventory" ON inventory FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admin full orders" ON orders FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admin full order items" ON order_items FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admin full payments" ON payments FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admin full delivery" ON delivery FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admin full status history" ON order_status_history FOR ALL USING (is_admin(auth.uid()));

-- Customer policies
CREATE POLICY "Customer profile read write" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Customer orders read" ON orders FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Customer items read" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.profile_id = auth.uid())
);

-- 6. Atomic Order Creation PostgreSQL RPC with FOR UPDATE locking
CREATE OR REPLACE FUNCTION create_order_tx(
  p_profile_id UUID,
  p_customer_name TEXT,
  p_customer_phone TEXT,
  p_customer_email TEXT,
  p_delivery_address JSONB,
  p_items JSONB,
  p_payment_method payment_method_enum,
  p_delivery_fee NUMERIC DEFAULT 0,
  p_otp_hash TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  v_item JSONB;
  v_product_id UUID;
  v_qty INT;
  v_product_price NUMERIC(12,2);
  v_product_name TEXT;
  v_product_sku TEXT;
  v_product_active BOOLEAN;
  v_inv_qty INT;
  v_inv_reserved INT;
  v_line_total NUMERIC(12,2);
  v_subtotal NUMERIC(12,2) := 0;
  v_total NUMERIC(12,2);
  v_order_id UUID := gen_random_uuid();
  v_order_ref TEXT;
  v_pay_ref TEXT;
  v_result JSONB;
BEGIN
  -- Validate required inputs
  IF p_customer_name IS NULL OR TRIM(p_customer_name) = '' THEN
    RAISE EXCEPTION 'Customer name is required';
  END IF;
  IF p_customer_phone IS NULL OR TRIM(p_customer_phone) = '' THEN
    RAISE EXCEPTION 'Customer phone is required';
  END IF;
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Cart items cannot be empty';
  END IF;

  -- Generate Unique Order Reference e.g. KC-9X2F8A
  v_order_ref := 'KC-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR 6));
  v_pay_ref := 'PAY-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR 8));

  -- Loop 1: Verify all items, lock inventory with FOR UPDATE, check stock and calculate subtotal
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::UUID;
    v_qty := (v_item->>'quantity')::INT;

    IF v_qty <= 0 THEN
      RAISE EXCEPTION 'Item quantity must be greater than zero';
    END IF;

    -- Fetch product details
    SELECT price, name, sku, is_active
    INTO v_product_price, v_product_name, v_product_sku, v_product_active
    FROM products WHERE id = v_product_id;

    IF v_product_name IS NULL OR v_product_active = false THEN
      RAISE EXCEPTION 'Product with ID % is not active or available', v_product_id;
    END IF;

    -- Lock inventory row FOR UPDATE to prevent race conditions
    SELECT quantity, reserved_quantity
    INTO v_inv_qty, v_inv_reserved
    FROM inventory
    WHERE product_id = v_product_id
    FOR UPDATE;

    IF (v_inv_qty - v_inv_reserved) < v_qty THEN
      RAISE EXCEPTION 'Insufficient inventory stock for product % (SKU: %). Requested: %, Available: %',
        v_product_name, v_product_sku, v_qty, (v_inv_qty - v_inv_reserved);
    END IF;

    v_line_total := v_product_price * v_qty;
    v_subtotal := v_subtotal + v_line_total;
  END LOOP;

  v_total := v_subtotal + p_delivery_fee;

  -- Insert Order Record
  INSERT INTO orders (
    id, order_reference, profile_id, customer_name, customer_phone,
    customer_email, delivery_address, subtotal, delivery_fee, discount,
    total, currency, payment_method, order_status
  ) VALUES (
    v_order_id, v_order_ref, p_profile_id, p_customer_name, p_customer_phone,
    p_customer_email, p_delivery_address, v_subtotal, p_delivery_fee, 0,
    v_total, 'GHS', p_payment_method, 'PENDING'
  );

  -- Loop 2: Insert items and update reserved_quantity
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::UUID;
    v_qty := (v_item->>'quantity')::INT;

    SELECT price, name, sku INTO v_product_price, v_product_name, v_product_sku
    FROM products WHERE id = v_product_id;

    v_line_total := v_product_price * v_qty;

    INSERT INTO order_items (
      order_id, product_id, product_name_snapshot, sku_snapshot,
      unit_price, quantity, line_total
    ) VALUES (
      v_order_id, v_product_id, v_product_name, v_product_sku,
      v_product_price, v_qty, v_line_total
    );

    -- Increment reserved_quantity atomically
    UPDATE inventory
    SET reserved_quantity = reserved_quantity + v_qty,
        updated_at = NOW()
    WHERE product_id = v_product_id;
  END LOOP;

  -- Insert Payment Record (PENDING)
  INSERT INTO payments (
    order_id, payment_reference, method, status, amount, currency
  ) VALUES (
    v_order_id, v_pay_ref, p_payment_method, 'PENDING', v_total, 'GHS'
  );

  -- Insert Delivery Record with OTP Hash
  INSERT INTO delivery (
    order_id, status, verification_code_hash, verification_expires_at
  ) VALUES (
    v_order_id, 'PENDING', p_otp_hash, NOW() + INTERVAL '7 days'
  );

  -- Record Status History
  INSERT INTO order_status_history (
    order_id, from_status, to_status, reason
  ) VALUES (
    v_order_id, NULL, 'PENDING', 'Order created via checkout transaction'
  );

  SELECT jsonb_build_object(
    'order_id', v_order_id,
    'order_reference', v_order_ref,
    'subtotal', v_subtotal,
    'delivery_fee', p_delivery_fee,
    'total', v_total,
    'payment_method', p_payment_method,
    'order_status', 'PENDING'
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
