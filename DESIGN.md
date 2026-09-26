# E-Commerce Storefront Design System (`KitConnect`)

> **Brand Narrative**: "Electronic Precision" & "Tactile Dark Mode"  
> **Target Aesthetic**: High-performance, calibrated, premium hardware laboratory aesthetic with deep neutral surfaces, glowing blue accents, and tactile metallic details.

---

## 1. Color Palette

The color system operates in a dark mode environment. Surfaces are layered using "Graphite" variants to establish elevation without relying on heavy drop shadows.

### Surface & Background Tokens
| Token | Hex Value | Description / Usage |
|---|---|---|
| `background` / `surface` | `#121315` | Void base background color |
| `surface-container-lowest` | `#0d0e10` | Darkest recessed background level |
| `surface-container-low` | `#1b1c1e` | Low-elevation bar / header background |
| `surface-container` | `#1f2022` | Standard container background |
| `surface-container-high` | `#292a2c` | Elevated panel background |
| `surface-container-highest` / `surface-variant` | `#343537` | Hover states and interactive highlight backgrounds |
| `surface-bright` | `#38393b` | High contrast elevated accent surface |
| `graphite-1` | `#16181C` | Primary sidebar and top navigation container background |
| `graphite-2` | `#1D2025` | Interactive cards, input fields, and product modules |

### Primary & Accent Colors (Connect Blue)
| Token | Hex Value | Description / Usage |
|---|---|---|
| `primary` | `#b4c5ff` | Soft illuminated blue; primary text links, icons, trace line glow |
| `on-primary` | `#002a77` | High-contrast text on primary background |
| `primary-container` | `#608bff` | Main action buttons and CTA fills |
| `on-primary-container` | `#002469` | Text on primary container CTAs |
| `inverse-primary` | `#0053da` | Contrast primary accent state |
| `primary-fixed` | `#dbe1ff` | Fixed light blue accent token |

### Secondary & Metallic Tones
| Token | Hex Value | Description / Usage |
|---|---|---|
| `secondary` | `#a9c7ff` | Secondary badges and active highlights |
| `on-secondary` | `#003063` | Contrast text on secondary fills |
| `secondary-container` | `#0464c3` | Selected category chips and active tab background |
| `on-secondary-container` | `#d9e4ff` | Text on active chips / selected tabs |
| `chrome-lo` | `#9AA3AD` | Low-brightness metallic chrome accent |
| `slate` | `#8A8F98` | Muted metadata text, subheaders, mono labels |
| `slate-dim` | `#5B5F66` | Subtle border and secondary icon color |

### Outline & Border Tokens
| Token | Hex Value | Description / Usage |
|---|---|---|
| `border-line` | `#26292F` | 1px standard border line for cards and dividers |
| `outline` | `#8d90a1` | Input outlines and secondary icons |
| `outline-variant` | `#424655` | Subtle container outline |

### Text & Contrast Tokens
| Token | Hex Value | Description / Usage |
|---|---|---|
| `on-surface` / `on-background` | `#e3e2e5` | Warm White primary body and heading text |
| `on-surface-variant` | `#c3c6d8` | Muted body copy and secondary descriptions |

---

## 2. Typography

The system pairs **Hanken Grotesk** for clean UI copy and headings with **JetBrains Mono** for technical specs, currency, and eyebrow labels.

### Typography Hierarchy Table
| Style Token | Font Family | Size | Weight | Line Height | Letter Spacing | Purpose |
|---|---|---|---|---|---|---|
| `display` | Hanken Grotesk | 40px | 700 (Bold) | 1.2 | -0.5px | Main page titles & hero headlines |
| `headline-lg` | Hanken Grotesk | 28px | 700 (Bold) | 1.3 | -0.5px | Section titles & section headers |
| `headline-md` | Hanken Grotesk | 19px | 700 (Bold) | 1.3 | Normal | Card titles & section sub-titles |
| `body-lg` | Hanken Grotesk | 15px | 400 (Regular) | 1.6 | Normal | Hero body text & featured lead text |
| `body-md` | Hanken Grotesk | 14px | 400 (Regular) | 1.6 | Normal | Standard body copy & paragraph text |
| `label-ui` | Hanken Grotesk | 13px | 600 (SemiBold)| 1.4 | Normal | Buttons, navigation links & action tags |
| `caption` | Hanken Grotesk | 12px | 600 (SemiBold)| 1.4 | Normal | Auxiliary text & badge labels |
| `data-mono` | JetBrains Mono | 13px | 400 (Regular) | 1.5 | Normal | Prices, numerical values & order IDs |
| `eyebrow-mono` | JetBrains Mono | 11px | 400 (Regular) | 1.2 | 3px (UPPERCASE)| Section eyebrows & spec tags |
| `micro-mono` | JetBrains Mono | 10px | 400 (Regular) | 1.2 | 1px (UPPERCASE)| Form field labels & status indicators |

---

## 3. Spacing & Layout Tokens

A strict spacing grid based on an 8px module ensures predictable layout rhythm across viewports.

| Spacing Token | Pixel Value | Rem Value | Purpose / Usage |
|---|---|---|---|
| `tight-gap` | 8px | 0.5rem | Micro-spacing (icon to text, tight flex stacks) |
| `grid-gutter` | 12px | 0.75rem | Column gap for product grid and card layouts |
| `component-padding` | 20px | 1.25rem | Internal padding for cards, panels, and forms |
| `stack-gap` | 28px | 1.75rem | Spacing between related groups of components |
| `edge-margin` | 32px | 2.0rem | Page margin padding on desktop/tablet |
| `section-gap` | 56px | 3.5rem | Vertical spacing between major page sections |
| `container-max` | 1400px | N/A | Maximum width limit for central content container |

---

## 4. Border Radius (Shape Language)

The shape language uses hyper-rounded modern contours scaling up to full pills for badges and action chips.

| Radius Token | Pixel Value | Class / Usage |
|---|---|---|
| `DEFAULT` / `sm` | 4px (`0.25rem`) | Small code blocks, micro badges |
| `lg` | 8px (`0.5rem`) | Form inputs, small sub-containers |
| `xl` | 12px (`0.75rem`) | Buttons, main product cards, hero containers |
| `full` | 9999px | Category chips, pill badges, circular icon buttons |

---

## 5. Components Specification

### A. Buttons
* **Primary Button**: `bg-primary-container text-on-primary-container px-6 py-3 rounded-xl font-label-ui hover:bg-secondary-container transition-colors shadow-lg`
* **Secondary / Outline Button**: `bg-transparent border border-border-line text-on-surface px-4 py-2 rounded-xl font-label-ui hover:border-primary transition-colors`
* **Filter Pill Chips**:
  * *Active State*: `bg-secondary-container text-on-secondary-container px-6 py-2 rounded-full font-label-ui shadow-[0_0_15px_rgba(47,111,255,0.2)]`
  * *Inactive State*: `bg-graphite-2 text-on-surface-variant border border-border-line px-6 py-2 rounded-full font-label-ui hover:border-primary transition-colors`

### B. Cards
* **Standard Container Card**: `bg-graphite-2 rounded-xl border border-border-line overflow-hidden p-component-padding hover:connect-blue-glow transition-all`
* **Glassmorphism Panel (`glass-card`)**: `background: linear-gradient(180deg, rgba(29,32,37,0.8) 0%, rgba(22,24,28,0.9) 100%); backdrop-filter: blur(12px); border: 1px solid rgba(38,41,47,0.5); rounded-xl p-6`

### C. Product Cards
* **Container**: `bg-graphite-2 rounded-xl border border-border-line overflow-hidden glow-hover transition-all group`
* **Image Backdrop**: `relative h-64 bg-surface-container p-4 flex items-center justify-center` with image hover transition `opacity-80 group-hover:opacity-100 transition-opacity`
* **Card Content**: `p-6 relative z-10 bg-graphite-2`
  * Title: `font-headline-md text-headline-md text-on-surface`
  * Description: `font-body-md text-body-md text-on-surface-variant mb-4`
  * Price Tag: `font-data-mono text-data-mono text-primary`
  * CTA: Secondary outline `Add to Cart` button

### D. Navigation
* **Desktop Header**: Sticky `top-0`, height `h-16`, background `bg-surface-container-low`, bottom border `border-b-2 border-primary`, blue glow shadow `shadow-[0_0_8px_rgba(180,197,255,0.3)]`
* **Mobile Header**: Compact `h-16` sticky top bar with hamburger menu, brand center logo, cart action
* **Mobile Bottom Bar**: `fixed bottom-0 left-0 w-full z-50 bg-surface-container rounded-t-xl border-t border-border-line px-4 py-2 flex justify-around`
* **Admin Sidebar**: `w-64 h-screen fixed left-0 top-0 bg-graphite-1 border-r border-border-line p-grid-gutter flex flex-col`

### E. Form Controls
* **Input Wrapper**: `flex flex-col gap-1`
* **Label**: `font-micro-mono text-micro-mono text-outline uppercase tracking-widest`
* **Text Input**: `bg-graphite-2 border border-border-line rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors`

---

## 6. Responsive Behavior & Breakpoints

* **Mobile Viewport (`< 768px`)**:
  * 1-column grid layout for product cards and checkout panels
  * Mobile header bar + fixed bottom navigation bar (`md:hidden`)
  * Full width margins with `px-4` padding
* **Tablet Viewport (`768px - 1024px`)**:
  * 2-column grid (`md:grid-cols-2`)
  * Desktop top navigation header becomes active (`md:flex`)
  * Page padding expands to `px-edge-margin` (32px)
* **Desktop Viewport (`> 1024px`)**:
  * 3 to 4 column product grid (`lg:grid-cols-3` / `lg:grid-cols-4`)
  * 12-column layout grid for Checkout (8 cols shipping/payment, 4 cols summary sticky panel)
  * Fixed left sidebar (`w-64`) active for Admin Dashboard viewports

---

## 7. Reusable UI Patterns & Micro-Animations

1. **The Trace Line (`.trace-line`)**:
   ```css
   .trace-line {
     height: 2px;
     background: linear-gradient(90deg, #b4c5ff 0%, transparent 100%);
     box-shadow: 0 0 8px #b4c5ff;
   }
   ```
2. **Connect Blue Hover Glow (`.glow-hover`)**:
   ```css
   .glow-hover:hover {
     box-shadow: inset 0 0 40px rgba(47, 111, 255, 0.08);
   }
   ```
3. **Status Pulse Animation (`.pulse-glow`)**:
   ```css
   @keyframes pulse-glow {
     0% { box-shadow: 0 0 0 0 rgba(47, 111, 255, 0.0); }
     100% { box-shadow: 0 0 20px 0 rgba(47, 111, 255, 0.15); }
   }
   ```
4. **Icon Containers**:
   ```html
   <div class="w-[34px] h-[34px] rounded-full bg-graphite-1 flex items-center justify-center">
     <span class="material-symbols-outlined text-primary text-sm">payments</span>
   </div>
   ```
