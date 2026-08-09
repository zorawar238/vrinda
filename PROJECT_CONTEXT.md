# PROJECT_CONTEXT.md

> **Purpose:** Single source of truth for AI coding agents. Read before work. Confirmed decisions are constraints; **TBD** items require owner approval. Do not invent or change major decisions.

## Project

### Confirmed

- Full-stack, responsive, mobile-first womens clothing e-commerce website.
- Bold, playful, colourful, expressive, slightly chaotic/chatpata Gen-Z fashion brand.
- Portfolio-quality learning MVP.
- Accessible, commerce-friendly brutalism/neo-brutalism: assertive, graphic and fun; never corporate, quiet-luxury, or generic.

### TBD — approval required

Brand name/logo/tagline/domain; country/currency; tax/shipping/returns; payment/inventory realism; catalogue/prices/images; legal/support content. Use marked placeholders or fictional fixtures until approved.

## Goals and audience

Support browse, search, filters, variants, cart, checkout, accounts, wishlist, orders, and admin management. Success means real-store quality, reliable mobile/desktop critical flows, and no unavailable or unselected variants in cart. Primary customers are Gen-Z women roughly 18–28: fashion-aware, price-conscious, social-media-native phone shoppers who compare sizing. Secondary: bold-fashion and gift shoppers.

Brand voice is bold, playful, feminine, confident, youthful, inclusive, and body-positive. Copy is short and lively; actions remain clear. Never shame, manipulate, use false urgency, or rely on confusing slang.

## Brutalist design system

- High-contrast colour blocks, oversized type, thick near-black borders, hard offset shadows, sticker badges, intentional asymmetry and editorial grid breaks.
- Product photos remain the hero. Cart, product option selection, forms, account, and checkout remain calmer and highly legible.
- Respect reduced-motion, meet contrast requirements, and never indicate status only with colour.
- Suggested palette: hot pink, electric lime, cobalt, orange/red, cream, near-black; final palette/fonts are TBD.
- Create semantic design tokens for colour/type/space/border/radius/shadow/breakpoint/motion.
- Reuse Button, Input, Select, Badge, Card, Modal, Drawer, Toast, ProductCard, Price, QuantitySelector, SizeSelector, EmptyState with hover/focus/active/disabled/loading/error states.

## UX and sitemap

Mobile first: touch-sized controls, filter/navigation drawers, persistent cart access, clear loading/empty/error states, progressive disclosure for fit/fabric/care/shipping, and visible checkout totals.

Customer pages: home; shop with search/sort/filter and documented paging approach; category/collection; product; search; wishlist; cart; checkout; confirmation; account/profile/addresses/orders; login/register/password reset; size guide; shipping/returns; FAQ/contact/privacy/terms; 404.

Admin: dashboard; products create/edit; variants/inventory; categories/collections; orders/statuses; customer lookup; optional promotions.

Future: lookbook, outfits, quiz, reviews/Q&A, restock alerts, loyalty, UGC, AI stylist, recommendations, locales/currencies, advanced returns, analytics and email.

## Core flows

Purchase: home/collection → browse/search/filter → product → inspect media/price/fit/size/stock/delivery → select all options + quantity → cart confirmation → checkout address/delivery/payment/review → confirmation and order status.

Account: sign in/register → wishlist → profile/addresses → orders. Admin: authorized sign-in → create product/media → add variants → publish → manage stock/orders.

## Catalogue and clothing requirements

Published products require name, unique slug, descriptions, category/collection, tags, draft/published/archived status, base/optional sale price, ordered media with alt text/primary image, fabric/care/origin where relevant, and structured fit data.

Fit data includes fitted/relaxed/oversized/cropped label, length, stretch, lining/transparency where relevant, model measurements/worn size, size guide and/or product measurements.

- Options normally use **size** and **colour**; length/style only if relevant.
- Each sellable combination is a variant: unique SKU, options, stock, availability, optional price override/media.
- Prohibit duplicate SKU/option combinations. Require all selection before cart; disable and label unavailable combinations.
- Server validates inventory on cart update, checkout, and order creation. Browser data is never authoritative.
- Support XS–XXL, numeric, and brand labels. Preferred canonical measurement unit: cm (TBD approval).
- Global guide explains bust/chest, waist, hips, inseam, length. Product sizing/fit must be accessible text, never images only.

## E-commerce rules

Currency/tax/zones/returns/provider are TBD; never hard-code regional rules. Server calculates price, discounts, shipping, tax, totals, and stock. Preserve immutable order snapshot: item/SKU/options/price/image/address/tax/shipping/totals. Quantity is positive integer within stock. Minimum statuses: pending_payment, paid, processing, shipped, delivered, cancelled, refunded. Use hosted/tokenized payments only; raw card data never enters the app. Define reservation policy before real checkout.

## Recommended stack — change only with approval

React + TypeScript + Vite; Tailwind with CSS variables/tokens; React Router + TanStack Query; Node + Express + TypeScript; MongoDB Atlas + Mongoose; JWT secure HTTP-only cookies plus bcrypt/Argon2; Zod; Cloudinary/equivalent media TBD; Stripe/locally appropriate hosted payment TBD; Vitest/RTL/Supertest/Playwright; Vercel/Netlify frontend and Render/Railway/Fly.io API, final hosting TBD.

## Architecture, database, APIs

Separate web/API apps (preferred eventual apps/web, apps/api, packages/shared; simpler learner layout allowed). API layers: routes/controllers → services/business rules → models/data access. Feature-oriented frontend. Server owns business/security rules. Secrets only in env/secret store. APIs use versioning, predictable JSON, resource routes, validation, RBAC, pagination, safe errors.

Entities: User, Address, Product, ProductVariant, Category/Collection, Cart, Wishlist, Order, Payment, Promotion, InventoryAdjustment. Store User identity/role/addresses; Product content/prices/media/fit/options; Variant SKU/options/stock; Cart variant lines; Order immutable snapshot; Payment provider IDs/status only—never card data.

Start API at /api/v1. Customer APIs cover catalogue/categories/product/search/auth/cart/checkout/profile/wishlist/orders. Admin APIs protect CRUD for products/variants/categories/inventory/orders/promotions. Validate filter/sort/page query. Use safe consistent errors and idempotency for real payments/orders.

## Security, quality, and SEO

Use slow password hashes, secure HTTP-only same-site cookies/CSRF protection where applicable, server validation/sanitization, server RBAC, rate limits, narrow CORS, HTTPS/security headers, and mitigations for XSS/injection/access-control/mass assignment. Never commit secrets or log passwords/tokens/payment data/unneeded PII.

Use responsive lazy-loaded images, reserved image dimensions, route splitting, deferred non-critical scripts, deliberate caching, and fresh stock/price checks at purchase. Target WCAG 2.2 AA: semantic HTML, labels, headings, visible focus, keyboard controls, status/error announcements, alt text, contrast/non-colour cues, keyboard and screen-reader QA. Use unique titles/descriptions, canonical slugs, sitemap/robots, noindex sensitive routes, Open Graph, and structured Product/Offer/Breadcrumb/Organization data after content is real.

Test units for price/variant/cart/discount/inventory/auth; components for options/forms/states; integration for validation/protected routes/orders; E2E for purchase, login, wishlist, and admin creation. Before merge: format, lint, type check, tests, build.

## Git and AI rules

1. Read this file and inspect current code before edits.
2. State a small plan before non-trivial work; ship coherent incremental slices.
3. Preserve unrelated work. Never delete/reset/overwrite unrelated files or commit secrets.
4. Never invent branding, policy, legal copy, credentials, integrations, or facts; use placeholders/TBD and ask.
5. Never change stack, data model, auth, payments, scope, or aesthetic without approval.
6. Reuse existing components/tokens/patterns; report files changed, behaviour, checks, and remaining TBDs.
7. Update this file only for owner-approved changes.

Use strict TypeScript, no any, domain schemas/types, small accessible components, camelCase functions/variables, PascalCase components/types, no hard-coded production policies, and complete loading/empty/error states. Use focused/reversible commits, e.g. feat(shop): add variant selector.

## Placeholders and current status

Use [BRAND_NAME], [TAGLINE], [LOGO_ASSET], [PRIMARY_FONT], [DISPLAY_FONT], [CURRENCY], [COUNTRY_OR_REGION], [SHIPPING_POLICY], [RETURN_POLICY], [SUPPORT_EMAIL], [PRODUCT_IMAGE_01], [CAMPAIGN_IMAGE_01], [CATEGORY_IMAGE_01]. Fixtures are realistic fictional non-production data; images must be licensed/owned and include useful alt text.

Confirmed: concept, audience, brutalist direction, MERN-style TypeScript learning approach. Not started/TBD: brand assets; scaffold; final visual tokens; catalogue; policies; providers; market/currency; real checkout; schemas/API/tests; launch plan.

## Final agent instruction

If a choice materially affects brand, cost, security, compliance, architecture, data model, or customer experience beyond its assigned task, pause and request concise approval options. Keep the app usable after every change.

