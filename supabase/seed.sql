-- KitConnect Gadget Accessories Seed Data

-- 1. Seed Categories
INSERT INTO categories (id, name, slug, description, sort_order) VALUES
('21000000-0000-0000-0000-000000000001', 'Power & Chargers', 'power-chargers', 'High-speed GaN chargers, power banks, and wireless charging pads', 1),
('21000000-0000-0000-0000-000000000002', 'Cables & Adapters', 'cables-adapters', 'Heavy-duty braided USB-C, Lightning, and multi-port adapters', 2),
('21000000-0000-0000-0000-000000000003', 'Audio & Acoustics', 'audio-acoustics', 'TWS wireless earbuds, ANC headphones, and Bluetooth speakers', 3),
('21000000-0000-0000-0000-000000000004', 'Mounts & Accessories', 'mounts-accessories', 'Magnetic car mounts, desk stands, and ergonomic phone holders', 4)
ON CONFLICT (slug) DO NOTHING;

-- 2. Seed Products
INSERT INTO products (id, category_id, name, slug, sku, short_description, description, price, compare_at_price, brand, specifications, is_featured, is_active) VALUES
(
  '11000000-0000-0000-0000-000000000001',
  '21000000-0000-0000-0000-000000000001',
  'Apex 65W GaN Dual USB-C Fast Charger',
  'apex-65w-gan-fast-charger',
  'KC-CHG-65W',
  'Ultra-compact 65W GaN charger with dual USB-C Power Delivery ports.',
  'Engineered with advanced Gallium Nitride (GaN) semiconductor tech, the Apex 65W delivers high-efficiency charging for laptops, smartphones, and tablets simultaneously.',
  195.00,
  240.00,
  'KitConnect Pro',
  '{"Power Output": "65W Max", "Ports": "2x USB-C PD 3.0", "Material": "Fireproof PC Polycarbonate", "Efficiency": "92%", "Weight": "115g"}',
  true,
  true
),
(
  '11000000-0000-0000-0000-000000000002',
  '21000000-0000-0000-0000-000000000002',
  'ArmorBraid 100W USB-C to USB-C Cable (2m)',
  'armorbraid-100w-usbc-cable-2m',
  'KC-CBL-100W-2M',
  'Kevlar-reinforced 100W 5A fast charge braided cable with LED trace indicator.',
  'Built for extreme durability and ultra-fast power delivery up to 100W (20V/5A) with integrated smart E-marker chip.',
  75.00,
  90.00,
  'KitConnect Pro',
  '{"Current": "5A Max", "Data Speed": "480 Mbps", "Length": "2 meters", "Jacket": "Double Nylon Braided", "Bend Test": "30,000+ bends"}',
  true,
  true
),
(
  '11000000-0000-0000-0000-000000000003',
  '21000000-0000-0000-0000-000000000001',
  'VoltCore 20,000mAh 45W Power Bank',
  'voltcore-20000mah-45w-power-bank',
  'KC-PB-20K-45W',
  'High-capacity power bank with digital LED battery readout and 45W laptop charging.',
  'Features premium lithium-polymer cells, smart temperature management, and fast bi-directional charging.',
  320.00,
  380.00,
  'VoltCore',
  '{"Capacity": "20,000mAh / 74Wh", "USB-C Output": "45W PD", "USB-A Output": "22.5W QC 3.0", "Display": "Digital LED %", "Dimensions": "145 x 68 x 28 mm"}',
  true,
  true
),
(
  '11000000-0000-0000-0000-000000000004',
  '21000000-0000-0000-0000-000000000003',
  'PulseBuds Pro Active Noise Cancelling TWS',
  'pulsebuds-pro-anc-tws',
  'KC-AUD-PBUDS',
  'True wireless earbuds with 35dB active noise cancellation and low-latency gaming mode.',
  'Custom-tuned 12mm titanium dynamic drivers deliver crystal-clear highs and deep sub-bass response.',
  280.00,
  350.00,
  'AudioTek',
  '{"Bluetooth": "5.3", "ANC Depth": "35dB Hybrid ANC", "Playtime": "8h + 24h case", "Water Resistance": "IPX5", "Codec": "AAC / SBC"}',
  true,
  true
),
(
  '11000000-0000-0000-0000-000000000005',
  '21000000-0000-0000-0000-000000000004',
  'MagHold Aluminum Magnetic Desk Stand',
  'maghold-aluminum-desk-stand',
  'KC-MNT-MAGSTD',
  'Precision CNC aluminium desktop stand with N52 Neodymium magnets and 360 rotation.',
  'Sleek graphite dark mode finish matches high-end hardware. Weighted base with anti-slip silicone padding.',
  140.00,
  170.00,
  'KitConnect Pro',
  '{"Material": "Aerospace Aluminium Alloy", "Magnet Array": "16x N52 Neodymium", "Rotation": "360-degree ball joint", "Weight": "210g"}',
  false,
  true
),
(
  '11000000-0000-0000-0000-000000000006',
  '21000000-0000-0000-0000-000000000002',
  'MatrixHub 7-in-1 USB-C Hub',
  'matrixhub-7in1-usbc-hub',
  'KC-HUB-7IN1',
  'Aluminum 7-in-1 multi-port hub featuring 4K 60Hz HDMI, 100W PD input, and SD card reader.',
  'Expand laptop connectivity effortlessly with high-speed 5Gbps USB 3.0 data ports and precision thermal dissipation.',
  220.00,
  270.00,
  'KitConnect Pro',
  '{"HDMI": "4K @ 60Hz", "PD Pass-through": "100W", "USB 3.0 Ports": "3x 5Gbps", "Card Reader": "SD & MicroSD Dual Slot"}',
  true,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- 3. Seed Product Images
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
('11000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80', 'Apex 65W GaN Charger Front View', true, 1),
('11000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80', 'ArmorBraid 100W Cable Detail', true, 1),
('11000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=800&q=80', 'VoltCore 20000mAh Power Bank', true, 1),
('11000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', 'PulseBuds Pro ANC Earbuds', true, 1),
('11000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80', 'MagHold Desk Stand', true, 1),
('11000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1616440342230-016f1b24d032?auto=format&fit=crop&w=800&q=80', 'MatrixHub 7-in-1 Hub', true, 1)
ON CONFLICT DO NOTHING;

-- 4. Seed Inventory
INSERT INTO inventory (product_id, quantity, reserved_quantity, low_stock_threshold) VALUES
('11000000-0000-0000-0000-000000000001', 45, 0, 5),
('11000000-0000-0000-0000-000000000002', 80, 0, 10),
('11000000-0000-0000-0000-000000000003', 25, 0, 5),
('11000000-0000-0000-0000-000000000004', 30, 0, 5),
('11000000-0000-0000-0000-000000000005', 12, 0, 3),
('11000000-0000-0000-0000-000000000006', 18, 0, 4)
ON CONFLICT (product_id) DO NOTHING;

