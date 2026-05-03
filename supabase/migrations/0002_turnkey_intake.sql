-- Triple B Prints — Turnkey Business Intake Schema
-- Supabase PostgreSQL migration
-- Created: 2026-05-03

-- ============================================================
-- 1. TABLE: turnkey_intake
-- ============================================================

CREATE TABLE turnkey_intake (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_by    TEXT,                       -- Name of person submitting (friend, Nate, etc.)
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- ── Section 1: What's Included ──
  package_name    TEXT,                       -- e.g. "Starter Kit", "Pro Shop"
  equipment_list  TEXT,                       -- Free-form: what machines/materials come with it
  training_included BOOLEAN DEFAULT false,    -- Does the package include training?
  training_details TEXT,                      -- What kind: in-person, video, docs?
  support_period  TEXT,                       -- e.g. "30 days", "6 months", "1 year"

  -- ── Section 2: Pricing Tiers ──
  tier_1_name     TEXT,
  tier_1_price    NUMERIC(10, 2),
  tier_1_includes TEXT,                       -- What's in the base tier
  tier_2_name     TEXT,
  tier_2_price    NUMERIC(10, 2),
  tier_2_includes TEXT,
  tier_3_name     TEXT,
  tier_3_price    NUMERIC(10, 2),
  tier_3_includes TEXT,

  -- ── Section 3: Target Customer ──
  target_audience TEXT,                       -- Who buys this? Hobbyists, side-hustlers, full-time?
  ideal_customer_profile TEXT,                -- Description of the perfect buyer
  estimated_startup_cost TEXT,                -- Range or specific number
  time_to_first_sale TEXT,                    -- How long until a new buyer makes money?

  -- ── Section 4: Proof & Social ──
  has_testimonials BOOLEAN DEFAULT false,
  testimonial_count INTEGER DEFAULT 0,
  success_stories TEXT,                       -- Free-form: notable customer wins
  revenue_proof   TEXT,                       -- Any numbers we can share?
  photos_available BOOLEAN DEFAULT false,     -- Shop photos, customer work, unboxing?

  -- ── Section 5: Operations ──
  supplier_relationships TEXT,                -- Who supplies blanks/materials?
  shipping_strategy TEXT,                     -- How does fulfillment work?
  software_included TEXT,                     -- Design software, RIP, etc.
  workspace_requirements TEXT,                -- Square footage, power, ventilation?

  -- ── Section 6: Marketing ──
  branding_included BOOLEAN DEFAULT false,    -- Logo, business cards, website?
  social_media_help BOOLEAN DEFAULT false,    -- Do you help them market?
  lead_generation TEXT,                       -- How do buyers find customers?

  -- ── Admin ──
  status          TEXT NOT NULL DEFAULT 'draft', -- draft, review, approved, published, archived
  admin_notes     TEXT,                       -- Nate's internal notes
  priority        INTEGER DEFAULT 0         -- Sort order for review
);

COMMENT ON TABLE turnkey_intake IS 'Collected information for the turnkey print-shop business offering. One row per draft/submission.';
COMMENT ON COLUMN turnkey_intake.submitted_by IS 'Who filled this out — friend, Nate, or other';
COMMENT ON COLUMN turnkey_intake.status IS 'Workflow stage: draft → review → approved → published → archived';

-- ============================================================
-- 2. INDEXES
-- ============================================================

CREATE INDEX idx_turnkey_status ON turnkey_intake(status);
CREATE INDEX idx_turnkey_submitted_at ON turnkey_intake(submitted_at DESC);
CREATE INDEX idx_turnkey_priority ON turnkey_intake(priority DESC, submitted_at DESC);

-- ============================================================
-- 3. RLS
-- ============================================================

ALTER TABLE turnkey_intake ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY turnkey_intake_admin_all
  ON turnkey_intake FOR ALL
  USING (is_admin());

-- Public can INSERT (anonymous form submissions)
CREATE POLICY turnkey_intake_insert_public
  ON turnkey_intake FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- 4. TRIGGERS
-- ============================================================

CREATE TRIGGER turnkey_updated_at
  BEFORE UPDATE ON turnkey_intake
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
