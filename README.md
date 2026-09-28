# TalentBridge — Role-Based Authorization & Protected Features

Standalone NeuroFive Solutions authorization task. This repository layers backend-enforced RBAC and ownership authorization over authentication.

## Access-control matrix

| Resource/action | Student | Company | Admin |
|---|---|---|---|
| View active internships | Allow | Allow | Allow |
| Create internship | Deny | Own company | Allow |
| Update internship | Deny | Own company | Allow |
| Delete/deactivate internship | Deny | Own company | Allow |
| View applications | Own only | Own postings | All |
| Withdraw application | Own only | Deny | Allow |
| Update application status | Deny | Own postings | Allow |
| List users | Deny | Deny | Allow |
| Deactivate user | Deny | Deny | Allow |
| Deactivate listing | Deny | Deny | Allow |

## Backend enforcement

Sensitive routes compose requireAuth -> requireFreshUser -> requireRole -> ownership check.

- JWTs identify the principal, but sensitive actions re-query PostgreSQL by user ID.
- companyId owns internships; studentId owns applications.
- A client cannot prove ownership by sending another user's ID.
- Every PATCH/DELETE route checks permission before mutation.
- Admin routes are protected independently on the server.
- 401 is authentication failure; 403 is authenticated but forbidden.

## Protected resources

- Internships: company ownership for update/delete.
- Applications: student ownership for withdrawal; company ownership of the internship for status updates.
- Admin resources: users and internships are accessible only to admins.
- Student/company list endpoints are filtered server-side by identity and relationship.

## Frontend

The React UI conditionally renders Student, Company, and Admin workspaces for usability. This is not treated as security. A dedicated forbidden view handles unauthorized navigation instead of crashing.

## Tests

Run:

    cd backend
    npm install
    npm run test:authz

The authorization test suite explicitly checks cross-owner denial for companies and students.

## Local setup

    docker compose up -d
    cd backend
    cp .env.example .env
    npm install
    npx prisma generate
    npx prisma migrate deploy
    npm run prisma:seed
    npm run dev

Then run the frontend:

    cd frontend
    npm install
    npm run dev

Demo accounts after seeding:
- admin@example.com
- company@example.com
- student@example.com
- password: DemoPass1! (local demonstration only)

## Research

RBAC is used for coarse-grained role permissions, while ownership checks provide resource-level control. This combination fits TalentBridge because a company may manage internships generally, but must not manage another company's specific posting.

OWASP Broken Access Control guidance stresses server-side enforcement and deny-by-default behavior. OWASP's material includes real-world examples involving insecure direct object access/data exposure and the Panera Bread API exposure.

References:
- https://owasp.org/Top10/A01_2021-Broken_Access_Control/
- https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html

## Verification note

Repository structure and authorization code have been statically inspected. Live PostgreSQL/npm execution is environment-dependent and is not claimed as completed in this environment.
