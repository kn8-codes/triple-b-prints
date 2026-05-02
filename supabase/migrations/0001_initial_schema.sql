-- Triple B Prints — Phase 1 Initial Schema
-- Supabase PostgreSQL migration
-- Created: 2026-05-02

-- ============================================================
-- 1. ENUMS
-- ============================================================

-- Order lifecycle statuses
CREATE TYPE order_status AS ENUM (
  'new',
  'approved',
  'in_production',
  'ready',
  'shipped',
  'delivered',
  'refunded'
);

COMMENT ON TYPE order_status IS 'Lifecycle stages for a print order';

-- ============================================================
-- 2. TABLES
-- ============================================================

-- ---------------------------
-- products
-- ---------------------------
CREATE TABLE products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  description     TEXT,
  base_price      NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
  category        TEXT,
  image_url       TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  configurator_options JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  products IS 'Printable products available for purchase';
COMMENT ON COLUMN products.slug IS 'URL-friendly identifier, unique across catalog';
COMMENT ON COLUMN products.base_price IS 'Starting price before configurator up-charges';
COMMENT ON COLUMN products.configurator_options IS 'JSON schema driving the product configurator UI';

-- ---------------------------
-- customers
-- ---------------------------
CREATE TABLE customers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT NOT NULL UNIQUE,
  name            TEXT,
  phone           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  customers IS 'Buyers / site visitors who have placed at least one order';
COMMENT ON COLUMN customers.email IS 'Primary contact address; used for order notifications';

-- ---------------------------
-- orders
-- ---------------------------
CREATE TABLE orders (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email          TEXT NOT NULL,
  customer_name           TEXT,
  status                  order_status NOT NULL DEFAULT 'new',
  total_amount            NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  discount_code           TEXT,
  stripe_payment_intent_id TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  orders IS 'Parent order record containing checkout summary';
COMMENT ON COLUMN orders.status IS 'Current stage in the print & fulfillment pipeline';
COMMENT ON COLUMN orders.total_amount IS 'Final charged amount after discounts';
COMMENT ON COLUMN orders.discount_code IS 'Applied discount code at time of purchase';
COMMENT ON COLUMN orders.stripe_payment_intent_id IS 'Stripe PaymentIntent for reconciliation';

-- ---------------------------
-- order_items
-- ---------------------------
CREATE TABLE order_items (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id          UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity            INTEGER NOT NULL CHECK (quantity > 0),
  unit_price          NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  artwork_url         TEXT,
  configurator_state  JSONB DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  order_items IS 'Individual line items within an order';
COMMENT ON COLUMN order_items.unit_price IS 'Snapshot price at time of purchase';
COMMENT ON COLUMN order_items.artwork_url IS 'Uploaded or generated artwork file path/URL';
COMMENT ON COLUMN order_items.configurator_state IS 'JSON snapshot of user selections for this item';

-- ---------------------------
-- discount_codes
-- ---------------------------
CREATE TABLE discount_codes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code              TEXT NOT NULL UNIQUE,
  discount_percent  INTEGER NOT NULL CHECK (discount_percent BETWEEN 0 AND 100),
  max_uses          INTEGER NOT NULL CHECK (max_uses >= 0),
  used_count        INTEGER NOT NULL DEFAULT 0 CHECK (used_count >= 0),
  is_active         BOOLEAN NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT usage_limit CHECK (used_count <= max_uses)
);

COMMENT ON TABLE  discount_codes IS 'Promo / referral codes for checkout discounts';
COMMENT ON COLUMN discount_codes.code IS 'Case-insensitive code entered at checkout';

-- ---------------------------
-- inventory_tracking
-- ---------------------------
CREATE TABLE inventory_tracking (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku                 TEXT NOT NULL UNIQUE,
  product_id          UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity_on_hand    INTEGER NOT NULL DEFAULT 0 CHECK (quantity_on_hand >= 0),
  reorder_threshold   INTEGER NOT NULL DEFAULT 0 CHECK (reorder_threshold >= 0),
  is_active           BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  inventory_tracking IS 'Stock levels for printable substrates / supplies';
COMMENT ON COLUMN inventory_tracking.sku IS 'Internal stock-keeping unit';
COMMENT ON COLUMN inventory_tracking.reorder_threshold IS 'Trigger point for low-stock alerts';

-- ============================================================
-- 3. INDEXES
-- ============================================================

-- products
CREATE INDEX idx_products_slug      ON products(slug);
CREATE INDEX idx_products_category  ON products(category);
CREATE INDEX idx_products_active    ON products(is_active) WHERE is_active = true;

-- customers
CREATE INDEX idx_customers_email    ON customers(email);

-- orders
CREATE INDEX idx_orders_status      ON orders(status);
CREATE INDEX idx_orders_email       ON orders(customer_email);
CREATE INDEX idx_orders_created     ON orders(created_at DESC);

-- order_items
CREATE INDEX idx_order_items_order  ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- discount_codes
CREATE INDEX idx_discount_codes_code ON discount_codes(code);
CREATE INDEX idx_discount_codes_active ON discount_codes(is_active) WHERE is_active = true;

-- inventory_tracking
CREATE INDEX idx_inventory_sku      ON inventory_tracking(sku);
CREATE INDEX idx_inventory_product  ON inventory_tracking(product_id);

-- ============================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE products           ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders             ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_tracking ENABLE ROW LEVEL SECURITY;

-- ---------------------------
-- Helper: is_admin()
-- ---------------------------
-- Returns true if the current user has the 'admin' role in app_metadata.
-- Adjust to match your actual JWT claim structure (e.g. claims->'role').
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN coalesce(
    current_setting('request.jwt.claims', true)::jsonb->'app_metadata'->>'role',
    ''
  ) = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------
-- products policies
-- ---------------------------
-- Public read
CREATE POLICY products_select_public
  ON products FOR SELECT
  USING (is_active = true);

-- Admin full access
CREATE POLICY products_admin_all
  ON products FOR ALL
  USING (is_admin());

-- ---------------------------
-- orders policies
-- ---------------------------
-- Admin full access
CREATE POLICY orders_admin_all
  ON orders FOR ALL
  USING (is_admin());

-- Customers can read their own orders (by email match)
CREATE POLICY orders_select_own
  ON orders FOR SELECT
  USING (
    customer_email = coalesce(
      current_setting('request.jwt.claims', true)::jsonb->>'email',
      ''
    )
  );

-- ---------------------------
-- order_items policies
-- ---------------------------
-- Admin full access
CREATE POLICY order_items_admin_all
  ON order_items FOR ALL
  USING (is_admin());

-- Customers can read items belonging to their own orders
CREATE POLICY order_items_select_own
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id
        AND o.customer_email = coalesce(
              current_setting('request.jwt.claims', true)::jsonb->>'email',
              ''
            )
    )
  );

-- ---------------------------
-- customers policies
-- ---------------------------
-- Admin full access
CREATE POLICY customers_admin_all
  ON customers FOR ALL
  USING (is_admin());

-- Users can read their own customer record (by email match)
CREATE POLICY customers_select_own
  ON customers FOR SELECT
  USING (
    email = coalesce(
      current_setting('request.jwt.claims', true)::jsonb->>'email',
      ''
    )
  );

-- ---------------------------
-- discount_codes policies
-- ---------------------------
-- Public read (for validation at checkout)
CREATE POLICY discount_codes_select_public
  ON discount_codes FOR SELECT
  USING (is_active = true);

-- Admin full access
CREATE POLICY discount_codes_admin_all
  ON discount_codes FOR ALL
  USING (is_admin());

-- ---------------------------
-- inventory_tracking policies
-- ---------------------------
-- Admin full access only
CREATE POLICY inventory_tracking_admin_all
  ON inventory_tracking FOR ALL
  USING (is_admin());

-- ============================================================
-- 5. TRIGGERS
-- ============================================================

-- Auto-update `updated_at` on orders
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 6. SEED DATA (optional / examples)
-- ============================================================

-- Example product (disabled by default; uncomment to seed)
-- INSERT INTO products (name, slug, description, base_price, category, image_url, configurator_options)
-- VALUES (
--   'Custom Poster Print',
--   'custom-poster-print',
--   'High-quality matte poster in multiple sizes.',
--   12.99,
--   'poster',
--   'https://cdn.example.com/posters/default.jpg',
--   '{"sizes":["12x18","24x36"],"finishes":["matte","gloss"]}'
-- );
