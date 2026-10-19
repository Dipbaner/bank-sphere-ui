# BankSphere frontend/backend integration guide

This guide describes where the frontend currently gets its data and what the backend team needs to agree with the frontend team before replacing the demo behavior. It does not prescribe new backend endpoints: use the routes, DTOs, and security rules implemented by the backend as the source of truth.

## Current frontend state

- The customer preview and protected customer portal share the same React pages and `CustomerBankingProvider`. The provider currently owns in-memory sample accounts, beneficiaries, and transactions.
- Employee and admin preview portals use local sample state in `PreviewRolePortal.jsx`. Preview actions do not make API calls.
- The protected `/employee` and `/admin` routes use separate dashboard components. They are not yet the same full workflows as the employee/admin previews.
- Authentication pages already call the auth endpoints listed below. Confirm their request/response contracts against the backend before changing them.
- The Vite development server proxies `/api` to `http://localhost:8080`. The Google OAuth redirect uses `VITE_API_ORIGIN`.

## Existing API usage

The Axios client is `src/api/client.js`, exported as `api`. It uses `withCredentials: true`, holds the access token in memory, attaches it to API requests, and attempts a refresh after a 401 response whose error code is `UNAUTHORIZED`. It serializes concurrent refreshes so only one refresh request runs at a time.

The frontend currently expects these authentication contracts:

| Operation | Frontend request | Response data used by the UI |
|---|---|---|
| Register | `POST /api/auth/register` with `{ name, email, phone, password }` | Success means verification instructions can be shown |
| Login | `POST /api/auth/login` with `{ email, password }` | `{ preAuthToken, enrollmentRequired, expiresInSeconds }` |
| Verify OTP | `POST /api/auth/otp/verify` with `{ otp }` and the pre-auth bearer token | A completed login response containing `accessToken` |
| Enroll OTP | `POST /api/auth/otp/enroll`, then `/api/auth/otp/enroll/confirm` with `{ otp }` and the pre-auth bearer token | Enrollment data, followed by a completed login response containing `accessToken` |
| Backup code | `POST /api/auth/otp/backup` with `{ code }` and the pre-auth bearer token | A completed login response containing `accessToken` |
| Refresh session | `POST /api/auth/refresh` with the refresh cookie | `{ accessToken }`; token claims are used to read `email` and `role` |
| Logout | `POST /api/auth/logout` | Response body is not used |
| Logout all | `POST /api/auth/logout-all` | Response body is not used |
| Resend verification | `POST /api/auth/resend-verification` with `{ email }` | `{ message }` |
| Verify email | `GET /api/auth/verify-email?token=...` | Success/failure drives the verification screen |
| Forgot password | `POST /api/auth/forgot-password` with `{ email }` | Response body is not used |
| Reset password | `POST /api/auth/reset-password` with `{ token, newPassword }` | Success/failure drives the reset screen |
| Change password | `POST /api/auth/change-password` with `{ currentPassword, newPassword, otp }` | Success/failure drives the change-password screen |

Error handling reads `message`, optional `code`, and optional field-level `details` from the response body. In particular, login recognizes `EMAIL_NOT_VERIFIED`, and the shared client only refreshes on `401` with code `UNAUTHORIZED`. Preserve these semantics or update the client and tests together if the backend contract differs.

## Customer data integration seam

The customer screens use `useCustomerBanking()` from `src/customer/useCustomerBanking.js`. The provider in `src/customer/CustomerBankingProvider.jsx` exposes:

- `accounts`: `id`, `name`, `type`, masked `number`, `balance`, `available`, `currency`, `status`, `opened`, `branch`, and display `color`.
- `beneficiaries`: `id`, `name`, `bank`, masked `account`, `accountNumber`, `ifsc`, and `added`.
- `transactions`: `id`, `date`, `title`, `category`, `accountId`, display `account`, `reference`, signed numeric `amount`, and `status`.
- `addBeneficiary(beneficiary)`, `updateBeneficiary(id, updates)`, `removeBeneficiary(id)`, and `transfer({ fromAccountId, beneficiaryId, amount, note })`.

The UI expects transfer amounts to be negative for debits and positive for credits. Keep backend DTOs separate from these display models and map API results in a service/adapter or provider; do not make screens depend directly on undocumented server field names.

Suggested integration sequence:

1. Agree the backend endpoints, methods, query parameters, request DTOs, response DTOs, pagination shape, and error format with the backend owners. Cover accounts, profile/KYC, beneficiaries, transfers, transaction history, statements, and notifications.
2. Add API service functions that use the shared `api` client. Keep URL and DTO handling out of presentational components.
3. Replace the sample arrays/state in `CustomerBankingProvider` with loading and error-aware data loading and mutation methods. Keep the context interface stable where possible, or update all its consumers in the same change.
4. For money movement, treat the server response as authoritative. Show a completed receipt only after a successful server response; display server validation/limit errors without presenting a success state.
5. Map backend pagination and filters to the transaction page controls. The current UI filters its in-memory transaction list and does not yet establish a server pagination contract.
6. Generate statements from the backend when PDF output is supported. The current statement export is a local CSV of sample transactions.

## Employee and admin integration

Employee preview actions currently update local state for KYC decisions, transaction review status, and service-request status. Admin preview actions update local state for users, account freeze status, system limits, notifications, and audit events. Replace each action with the corresponding backend API only after its contract and authorization policy are confirmed. Reload or reconcile displayed data from the server after mutations.

The protected admin dashboard already requests `GET /api/admin/audit-logs` with `{ page, size }`. It expects a paginated response with `content` and a total page count (`totalPages` or `page.totalPages`); each record is read using `id`, `eventTime`, `action`, `status`, `identifier`, `ip`, and `details`. Confirm this matches the backend implementation.

For production integration, make the protected role routes use the complete role workflows, not the `/preview/...` route components. Keep preview routes isolated from API requests and visibly marked as sample-only.

## Local development and verification

1. Start the backend at port `8080`, or update the Vite `/api` proxy target in `vite.config.js` to the agreed local address.
2. Set `VITE_API_ORIGIN` to the backend origin needed for Google OAuth. Do not put credentials or private keys in Vite variables.
3. Run `npm run dev` and test login, OTP enrollment/verification, refresh, logout, and role redirects with backend-provided test accounts.
4. Test each customer, employee, and admin operation against success, validation failure, unauthorized, forbidden, empty, and server-error responses.
5. Run `npm run lint` and `npm run build`. Also verify API calls through browser network tools and confirm preview routes still make no backend requests.

## Handoff checklist

- [ ] Backend owners provide the API contract or OpenAPI document and test accounts.
- [ ] Frontend and backend agree on auth token/cookie behavior, CORS, error format, and role names.
- [ ] API service functions and DTO-to-view-model mapping are added.
- [ ] Loading, error, empty, and success states are handled for each live request.
- [ ] Money movement and sensitive staff/admin actions display only server-confirmed outcomes.
- [ ] Preview routes remain mock-only; protected routes use authenticated backend data.
- [ ] Build, lint, and role-based manual testing pass.
