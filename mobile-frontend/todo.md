# PayNext Mobile Frontend Enhancement Todo

## Phase 1: Setup & Analysis (Steps 1-4)

- [x] 1. Extract project files from `PayNext.zip`.
- [x] 2. Analyze project structure and identify `mobile-frontend` directory.
- [x] 3. Install dependencies (`pnpm install`) and run the dev server (`pnpm dev`).
- [x] 4. Identify and fix errors (No major errors found, placeholder API confirmed).

## Phase 2: UI Modernization (Step 5)

- [x] 5.1. Create `todo.md` (this file).
- [x] 5.2. Update `src/app/layout.tsx` (e.g., add ThemeProvider, improve structure).
- [x] 5.3. Enhance `src/app/page.tsx` (Homepage):
  - [x] Use styled `Card` components (`src/components/ui/card.tsx`).
  - [x] Improve overall layout and spacing.
  - [x] Add `lucide-react` icons to buttons, sections.
  - [x] Refine "Quick Actions" section appearance.
  - [x] Enhance "Recent Transactions" list display.
  - [x] Improve styling of the "Current Balance" card.
- [x] 5.4. Style `src/components/BottomNav.tsx`.
- [x] 5.5. Review and potentially update `globals.css` and Tailwind config.

## Phase 3: Implement Complete Functionalities (Steps 6-9)

- [x] 6. Implement complete Send Money functionality (`/send`).
  - [x] Create Send Money form using `react-hook-form` and `zod`.
  - [x] Use `shadcn/ui` components (Input, Button, Form).
  - [x] Simulate form submission with success/error toast.
- [x] 7. Implement complete Request Money functionality (`/request`).
  - [x] Create Request Money form (e.g., amount, memo).
  - [x] Generate a mock QR code or payment link.
  - [x] Use `shadcn/ui` components.
- [x] 8. Implement complete Profile functionality (`/profile`).
  - [x] Add form for editing profile details.
  - [x] Implement mock logout functionality.
  - [x] Use `shadcn/ui` components.
- [x] 9. Implement QR Scan functionality.
  - [x] Add a library for QR code scanning (e.g., `html5-qrcode`).
  - [x] Create a dedicated QR scan page or modal.
  - [x] Simulate handling the scanned data.

## Phase 4: Testing & Delivery (Steps 10-11)

- [x] 10. Test updated application (UI, complete functionality, navigation).
- [ ] 11. Create zip archive of `mobile-frontend` (excluding `node_modules`) and deliver.
