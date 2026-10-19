# BankSphere UI

BankSphere UI is a React frontend for the BankSphere banking application. It includes authentication flows and role-protected portals for customer, employee, and admin users.

## Run locally

Requirements: Node.js and npm.

```sh
npm install
npm run dev
```

The Vite development server runs on port `5173`. The root page opens the frontend preview and does not require a backend. Authentication pages and protected app routes remain available separately. The development server proxies `/api` requests to `http://localhost:8080`; Google sign-in uses the `VITE_API_ORIGIN` environment variable.

Available scripts:

- `npm run dev` — start the development server
- `npm run build` — create a production build in `dist`
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint

## Frontend preview

Run `npm run dev` and open `http://localhost:5173/`. Select a portal to browse its screens without signing in:

- `/preview/customer` — customer dashboard, accounts, transfers, beneficiaries, transactions, and statements
- `/preview/employee` — employee overview, customers, KYC review, transaction monitoring, and service requests
- `/preview/admin` — admin analytics, users, accounts, transactions, audit trail, and system settings
- `/login` — the regular authentication flow

Preview pages use sample data and make no backend requests. Employee previews support local customer search and mock KYC, transaction-review, and service-request status actions; changes are only held in browser memory. Transfer and account-management actions do not move real money or change server data. The customer portal's demo state resets when you leave the preview.

## Customer portal

Customer routes are protected by the `CUSTOMER` role:

- `/customer` — overview, balances, quick actions, and recent activity
- `/customer/accounts` — account details and recent activity
- `/customer/transfer` — demo transfer flow
- `/customer/beneficiaries` — add, edit, and remove beneficiaries
- `/customer/transactions` — searchable, filterable transaction history with CSV export
- `/customer/statements` — date-range statement preview and CSV download

The customer banking screens currently use clearly labelled in-memory demo data. Adding a beneficiary or making a demo transfer updates the portal state for the current page session only; these actions do not call banking APIs or move real money. Replace the data provider in `src/customer/CustomerBankingProvider.jsx` with backend integration when the customer API contracts are available. CSV exports are local; PDF statements, account opening/closure, account verification, and backend beneficiary validation require server support.
