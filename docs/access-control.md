# Access-control design

## Role vs permission vs ownership

- **Role**: Student, Company, or Admin. It is a coarse-grained grouping.
- **Permission**: An action such as `internship:update` or `application:status`.
- **Ownership**: The authenticated principal's relationship to a concrete row.

The application uses RBAC for coarse permissions and ownership checks for resource-level boundaries. This combination fits the domain because all companies may manage internships, but only the company owning a particular internship may change it.

## Defense in depth

The UI conditionally renders views for each role, but that is explicitly UX. The API repeats authentication, current-user verification, role checks, and ownership checks on sensitive requests.

## Least privilege

- Students can submit and withdraw their own applications.
- Companies can manage their own internships and applications belonging to their own postings.
- Admins can moderate all users, internships, and applications.

## Fresh role verification

The JWT role is not trusted for sensitive operations. `requireFreshUser` queries PostgreSQL by `req.user.id` and replaces the request principal with the current database role and active state before protected resource handlers execute.

## Boundary semantics

| Situation | Response |
|---|---|
| Missing/invalid/expired access token | 401 |
| Valid token, inactive user | 401 |
| Valid user, wrong role | 403 |
| Valid role, different owner | 403 |
| Resource does not exist | 404 |

## OWASP notes

OWASP's Broken Access Control guidance recommends deny-by-default and server-side checks on every request. Two examples documented in OWASP's Top 10 material are insecure direct object reference/data exposure incidents and the Panera Bread API exposure. The implementation responds by never accepting a client-supplied owner identity as proof of ownership and by checking the authenticated principal against database relationships.

References:
- https://owasp.org/Top10/A01_2021-Broken_Access_Control/
- https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
