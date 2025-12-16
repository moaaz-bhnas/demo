# Customer Authentication API

This document describes the API endpoints for customer registration and authentication.

## Base URL

All endpoints use the base URL: `https://backend-production-f59a.up.railway.app`

---

## Registration Flow

Customer registration is a three-step process:

1. **Register** - Get an initial token
2. **Create Customer** - Create the customer profile using the token
3. **Login** - Get the final authentication token for future requests

---

## Step 1: Register Account

Registers a new customer account and returns an initial token.

**Endpoint:** `POST /auth/customer/emailpass/register`

**Headers:**

- `Content-Type: application/json`

**Request Body:**

```json
{
  "email": "admin2@gmail.com",
  "password": "admin2"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rvcl9pZCI6IiIsImFjdG9yX3R5cGUiOiJjdXN0b21lciIsImF1dGhfaWRlbnRpdHlfaWQiOiJhdXRoaWRfMDFLQ0paRDRSVFRKSlE4Qjg3NFhNODRCWjUiLCJhcHBfbWV0YWRhdGEiOnt9LCJpYXQiOjE3NjU4Njg0NzUsImV4cCI6MTc2NTk1NDg3NX0.t31KMD4cd-FcI6Kz0jLCyOtoj9geynwiU_bJaXi2h6U"
}
```

**Example cURL:**

```bash
curl --location 'https://backend-production-f59a.up.railway.app/auth/customer/emailpass/register' \
--header 'Content-Type: application/json' \
--data '{
  "email": "admin2@gmail.com",
  "password": "admin2"
}'
```

**Note:** Save the returned token - you'll need it for the next step.

---

## Step 2: Create Customer Profile

Creates the customer profile using the token from Step 1.

**Endpoint:** `POST /store/customers`

**Headers:**

- `Content-Type: application/json`
- `Authorization: Bearer <token-from-step-1>`

**Request Body:**

```json
{
  "email": "admin2@gmail.com",
  "first_name": "admin",
  "last_name": "admin",
  "phone": "+201027050131"
}
```

**Response:**

```json
{
  "customer": {
    "id": "cus_01KCJZETTP92ZA9929Y8TW9TH2",
    "email": "admin2@gmail.com",
    "company_name": null,
    "first_name": "admin",
    "last_name": "admin",
    "phone": "+201027050131",
    "metadata": null,
    "has_account": true,
    "deleted_at": null,
    "created_at": "2025-12-16T07:02:10.518Z",
    "updated_at": "2025-12-16T07:02:10.518Z",
    "addresses": []
  }
}
```

**Example cURL:**

```bash
curl --location 'https://backend-production-f59a.up.railway.app/store/customers' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <token-from-step-1>' \
--data '{
  "email": "admin2@gmail.com",
  "first_name": "admin",
  "last_name": "admin",
  "phone": "+201027050131"
}'
```

**Note:** The email must match the email used in Step 1.

---

## Step 3: Login

Authenticates the customer and returns a token for future API requests.

**Endpoint:** `POST /auth/customer/emailpass`

**Headers:**

- `Content-Type: application/json`

**Request Body:**

```json
{
  "email": "admin2@gmail.com",
  "password": "admin2"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rvcl9pZCI6ImN1c18wMUtDSlpFVFRQOTJaQTk5MjlZOFRXOVRIMiIsImFjdG9yX3R5cGUiOiJjdXN0b21lciIsImF1dGhfaWRlbnRpdHlfaWQiOiJhdXRoaWRfMDFLQ0paRDRSVFRKSlE4Qjg3NFhNODRCWjUiLCJhcHBfbWV0YWRhdGEiOnt9LCJpYXQiOjE3NjU4Njg0NzUsImV4cCI6MTc2NTk1NDg3NX0.t31KMD4cd-FcI6Kz0jLCyOtoj9geynwiU_bJaXi2h6U"
}
```

**Example cURL:**

```bash
curl --location 'https://backend-production-f59a.up.railway.app/auth/customer/emailpass' \
--header 'Content-Type: application/json' \
--data '{
  "email": "admin2@gmail.com",
  "password": "admin2"
}'
```

**Note:**

- This token should be stored and used for all authenticated customer API requests
- Include it in the `Authorization: Bearer <token>` header for protected endpoints
- The token will expire after a certain period (check the `exp` claim in the JWT)

---

## Using the Authentication Token

After completing the registration flow, use the token from Step 3 in all authenticated requests:

```bash
curl --location 'https://backend-production-f59a.up.railway.app/store/customers/me/addresses' \
--header 'x-publishable-api-key: <your-api-key>' \
--header 'Authorization: Bearer <token-from-step-3>'
```

The token is required for accessing:

- Customer profile endpoints
- Wishlist endpoints
- Order endpoints
- Address management endpoints
- And other customer-specific resources
