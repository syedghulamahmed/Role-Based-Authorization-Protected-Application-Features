# Authorization verification report

## Static verification

- [x] Third role `ADMIN` is constrained by Prisma enum.
- [x] Company internship mutations re-check company ownership.
- [x] Student application withdrawal re-checks student ownership.
- [x] Company application status changes re-check posting ownership.
- [x] Admin routes require `ADMIN`.
- [x] Sensitive routes run `requireFreshUser`, replacing stale JWT role state with the database role and active state.
- [x] 401 and 403 use separate error codes/statuses.
- [x] Access-control matrix documents actual protected routes.
- [x] Automated tests cover cross-company internship mutation and cross-student application access.
- [x] Frontend has role-aware views and a forbidden-state route.

## Runtime limitation

Live PostgreSQL queries, npm installation, and HTTP integration tests are environment-dependent. This environment does not have a configured review database, so this report does not claim live API execution.
