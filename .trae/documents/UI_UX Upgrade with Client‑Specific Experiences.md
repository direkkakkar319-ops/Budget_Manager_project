## Overview
- Elevate the overall UI and UX of the React + Vite app using Tailwind, Framer Motion, and Lucide icons already in use.
- Preserve role‑specific experiences for `salary`, `self_employed`, and `client_mgmt` while introducing a shared design system for consistency.

## Current Stack Observations
- Routing and role gating: `client/src/App.jsx` with `ProtectedRoute` and layouts per role.
- Tailwind v4 configured: `client/tailwind.config.js`; utility classes used across pages.
- Design styles already diverge by role:
  - Auth glassmorphism: `client/src/layouts/AuthLayout.jsx:5`.
  - Salary dark sidebar: `client/src/layouts/SalaryLayout.jsx:17`.
  - Enterprise light top nav: `client/src/layouts/EnterpriseLayout.jsx:17`.
  - Self‑Employed stone theme: `client/src/layouts/SelfEmployedLayout.jsx:15`.
- Feature pages: dashboards, tables, modals for CRUD across salary and enterprise sections.

## Goals
- Consistent components, spacing, and states across the app.
- Faster navigation and clearer information hierarchy per role.
- Accessible forms, modals, tables; better keyboard/focus behavior.
- Responsive navigation (mobile/desktop) and micro‑interactions.

## Design System (Shared UI Components)
Create a minimal UI kit under `client/src/components/ui` and refactor pages to use it:
- `Button`, `Input`, `Select`, `Badge`, `Card`: base components with size/variant props; use `clsx` + `tailwind-merge`.
- `Modal`: focus trap, ESC to close, ARIA labeling; reused by transactions/invoices/clients modals.
- `Table`: header, row, empty state, loading skeleton; sortable columns hooks where useful.
- `Tabs`: used in self‑employed Business/Finances; unify styling.
- `Sidebar`, `Topbar`, `NavLink`: shared navigation primitives for layouts.
- `Skeleton`: shimmer placeholders for cards, charts, tables while data loads.
- `Toast` + context: success/error feedback for CRUD actions.

## Theming & Client‑Specific UX
Introduce per‑role theme tokens via CSS variables applied at layout root; wire into Tailwind token mapping (already prepared in `tailwind.config.js`):
- Salary: cyan/blue accent on slate‑dark background; glass surfaces, strong contrast.
- Enterprise: blue/gray on white; emphasis on clarity, data density, and actions.
- Self‑Employed: amber/stone neutrals; friendly tone, hybrid personal + business cues.
Implementation:
- Add role theme providers or set `data-theme` on layout root (`<div>` wrappers) to switch CSS vars.
- Expose `useTheme()` helper in `client/src/lib/theme.js` for runtime changes if needed.

## Navigation & Layout Improvements
- Mobile: collapsible sidebar (Salary, Self‑Employed) and responsive top nav (Enterprise) with overflow menu.
- Active state and keyboard navigation unified via `NavLink` component.
- Sticky action bars on list pages (filters/search/add) to reduce scroll friction.

## Data Views
- Enterprise Clients (`client/src/pages/enterprise/Clients.jsx`): add search/filter, pagination, empty state, inline validations; surface GSTIN badges; edit in modal with form.
- Enterprise Invoices (`client/src/pages/enterprise/Invoices.jsx`): improve items grid UX, subtotal preview, status badges, export/download action bar.
- Salary Transactions (`client/src/pages/salary/Transactions.jsx`): better filters, category chips with icons, income/expense color coding, keyboard shortcuts.
- Salary Budgets (`client/src/pages/salary/Budgets.jsx`): clearer progress, timeframe badges, empty informative state.
- Dashboards: consistent `Card` tiles; chart container with skeleton loading and tooltip formatting.

## Forms & Validation
- Login/Register: client‑side validation, show/hide password, error messages inline, disabled states; consistent `Input` component.
- CRUD modals: form validation with helper text; numeric inputs with formatting and min/max.

## Loading, Empty, Error States
- Replace "Loading..." text with `Skeleton` variants in dashboards and tables.
- Empty states with descriptive icon and CTA ("Add Client", "Create Invoice", "Add Budget").
- Error banners with retry patterns when API calls fail.

## Motion & Micro‑Interactions
- Subtle hover/press animations on `Button`/`Card` using Framer Motion.
- Modal open/close transitions; sidebar expand/collapse.

## Accessibility
- Focus outlines and `aria` attributes on interactive elements.
- `Modal` focus trap and `aria-modal`, `role="dialog"`.
- Keyboard support: ESC to close modals, arrow keys for tabs, Enter to submit.

## Implementation Steps
1. Scaffold UI kit: add `client/src/components/ui/{Button,Card,Input,Select,Badge,Modal,Table,Tabs,Sidebar,Topbar,NavLink,Skeleton}`.
2. Theme tokens: define role CSS variables in a small CSS file and apply via layout wrappers; ensure Tailwind picks up tokens already mapped in `tailwind.config.js`.
3. Refactor layouts to use shared `Sidebar/Topbar/NavLink`; add responsive toggles.
4. Replace ad‑hoc modals in Transactions/Invoices/Clients with `Modal`; hook to `Toast` on success/error.
5. Enhance tables: adopt `Table` component; add empty/skeleton states.
6. Update forms (Login/Register + CRUD) to use `Input/Select/Button`; add validation.
7. Dashboards: unify `Card` metrics and add chart skeletons.
8. Accessibility pass: labels, roles, focus management.
9. Micro‑interactions: introduce motion where appropriate.

## Verification Plan
- Run app locally and navigate each role:
  - Auth flow: `Login`/`Register` pages.
  - Salary: dashboard, transactions, budgets.
  - Enterprise: clients, invoices, reports.
  - Self‑Employed: Business and Finances tabs.
- Validate mobile/desktop breakpoints and keyboard navigation.
- Exercise CRUD flows; confirm toasts and error handling.

## Deliverables
- Shared UI kit components and theme utilities.
- Refactored layouts and pages with improved UX.
- Client‑specific styling and behavior preserved and refined.

If you approve, I will implement these components, refactor the pages incrementally, and verify the flows end‑to‑end.