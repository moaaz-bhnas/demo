# Reset Password API

This document describes the API endpoints for resetting customer passwords.

## Base URL

All endpoints use the base URL: `https://backend-production-f59a.up.railway.app`

---

## Request Password Reset

Sends a password reset email to the customer.

**Endpoint:** `POST /auth/customer/emailpass/reset-password`

**Headers:**

- `Content-Type: application/json`

**Request Body:**

```json
{
  "identifier": "shopyneer.operations@gmail.com"
}
```

**Response:**

- Status Code: `201 Created`
- No response body

**Example cURL:**

```bash
curl --location 'https://backend-production-f59a.up.railway.app/auth/customer/emailpass/reset-password' \
--header 'Content-Type: application/json' \
--data '{
  "identifier": "shopyneer.operations@gmail.com"
}'
```

**Note:** The `identifier` field should be the customer's email address. A password reset email will be sent to this address.

---

## Update Password

Updates the customer's password using a reset token.

**Endpoint:** `POST /auth/customer/emailpass/update`

**Headers:**

- `Content-Type: application/json`
- `Authorization: Bearer <reset-token>`

**Request Body:**

```json
{
  "email": "shopyneer.operations@gmail.com",
  "password": "operations"
}
```

**Response:**

```json
{
  "success": true
}
```

**Example cURL:**

```bash
curl --location 'https://backend-production-f59a.up.railway.app/auth/customer/emailpass/update' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <reset-token>' \
--data '{
  "email": "shopyneer.operations@gmail.com",
  "password": "operations"
}'
```

**Note:**

- The reset token is typically provided in the password reset email link
- The token should be included in the `Authorization` header as a Bearer token
- The `email` field must match the email address that requested the password reset
- The `password` field should contain the new password
