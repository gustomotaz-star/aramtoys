# Aram Toys React App

This folder is the replacement application being built before the legacy static HTML project is removed.

## Run locally

```bash
cd react-app
npm install
npm run dev
```

Vite is configured to use port `5500`.

## Central architecture

- `src/styles/tokens.css` — single source of truth for colors, backgrounds, spacing, radii, typography, shadows and layout sizes.
- `src/styles/global.css` — shared primitives: buttons, cards, forms, tables, grids, badges and utilities.
- `src/styles/storefront.css` — shared storefront components only.
- `src/styles/admin.css` — management/dashboard styling only.
- `src/config/app.js` — business/UI constants such as shipping, currency, low-stock threshold and order statuses.
- `src/lib/supabase.js` — one Supabase client for the entire application.
- `src/context/` — global auth, cart and language state.
- `src/services/` — centralized Supabase data access and mutations.
- `src/components/` — reusable visual/route components.
- `src/pages/` — route-level screens only; pages should not redefine theme tokens.

## Maintenance rule

Do not hardcode project colors, radii, shadows, spacing systems, shipping values, order status labels or Supabase configuration inside pages. Update the central source instead.

## Routes

- `/`
- `/category/:slug`
- `/cart`
- `/login`
- `/reset-password`
- `/checkout`
- `/order-confirmation/:orderId`
- `/account`
- `/admin/login`
- `/admin`

The legacy root HTML application must remain untouched until this React version has been run and verified. After verification, this app can be promoted to the repository root and the legacy HTML/JS files can be deleted.
