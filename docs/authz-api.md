# Authorization API

All protected endpoints require `Authorization: Bearer <access-token>`.

## Error envelope

401 and 403 are intentionally distinct:

```json
{"error":{"code":"UNAUTHENTICATED","message":"Authentication is required"}}
```

```json
{"error":{"code":"FORBIDDEN","message":"You are not authorized for this resource"}}
```

## Route matrix

| Method | Route | Required role | Ownership |
|---|---|---|---|
| GET | /api/internships | Any authenticated | None |
| POST | /api/internships | Company/Admin | Company profile for company role |
| PATCH | /api/internships/:id | Company/Admin | Company owns internship |
| DELETE | /api/internships/:id | Company/Admin | Company owns internship |
| GET | /api/applications | Any authenticated | Student/Company filtered server-side |
| POST | /api/applications | Student | Student identity comes from session |
| PATCH | /api/applications/:id/withdraw | Student/Admin | Student owns application |
| PATCH | /api/applications/:id/status | Company/Admin | Company owns posting |
| GET | /api/admin/users | Admin | Admin only |
| PATCH | /api/admin/users/:id/deactivate | Admin | Admin only |
| PATCH | /api/admin/internships/:id/deactivate | Admin | Admin only |
