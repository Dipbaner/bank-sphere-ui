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

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Backend integration handoff

For the current API usage, frontend data seams, required contract coordination, and a suggested integration sequence, see the [backend integration guide](./docs/backend-integration-guide.md).
