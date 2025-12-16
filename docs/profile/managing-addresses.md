# Managing Addresses API

This document describes the API endpoints for managing customer addresses.

## Base URL

All endpoints use the base URL: `https://backend-production-f59a.up.railway.app`

## Authentication

All address endpoints require:

- `x-publishable-api-key` header
- `Authorization: Bearer <token>` header (customer authentication token)

---

## Create Address

Creates a new address for the authenticated customer.

**Endpoint:** `POST /store/customers/me/addresses`

**Headers:**

- `x-publishable-api-key: <your-api-key>`
- `Content-Type: application/json`
- `Authorization: Bearer <customer-token>`

**Request Body:**

```json
{
  "first_name": "Eng",
  "last_name": "Bassam",
  "phone": "+201027050131",
  "company": "Shopyneer",
  "address_1": "Maadi, Cairo",
  "address_2": "23th street, building b2, apt 6",
  "city": "Maadi",
  "country_code": "EG",
  "province": "eg-c",
  "postal_code": "00000",
  "metadata": {}
}
```

**Response:**

```json
{
  "customer": {
    "id": "cus_01KCJZETTP92ZA9929Y8TW9TH2",
    "email": "admin2@gmail.com",
    "first_name": "admin",
    "last_name": "admin",
    "phone": "+201027050131",
    "addresses": [
      {
        "id": "cuaddr_01KCK0RRC0QSF3612Q12ZYKWVA",
        "address_name": null,
        "is_default_shipping": false,
        "is_default_billing": false,
        "company": "Shopyneer",
        "first_name": "Eng",
        "last_name": "Bassam",
        "address_1": "Maadi, Cairo",
        "address_2": "23th street, building b2, apt 6",
        "city": "Maadi",
        "country_code": "EG",
        "province": "eg-c",
        "postal_code": "00000",
        "phone": "+201027050131",
        "metadata": {},
        "customer_id": "cus_01KCJZETTP92ZA9929Y8TW9TH2",
        "created_at": "2025-12-16T07:25:04.257Z",
        "updated_at": "2025-12-16T07:25:04.257Z",
        "deleted_at": null
      }
    ]
  }
}
```

**Example cURL:**

```bash
curl --location 'https://backend-production-f59a.up.railway.app/store/customers/me/addresses' \
--header 'x-publishable-api-key: <your-api-key>' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <customer-token>' \
--data '{
  "metadata": {},
  "first_name": "Eng",
  "last_name": "Bassam",
  "phone": "+201027050131",
  "company": "Shopyneer",
  "address_1": "Maadi, Cairo",
  "address_2": "23th street, building b2, apt 6",
  "city": "Maadi",
  "country_code": "EG",
  "province": "eg-c",
  "postal_code": "00000"
}'
```

---

## Update Address

Updates an existing address. You can update any of the address fields, including setting default shipping or billing addresses.

**Endpoint:** `PUT /store/customers/me/addresses/{address_id}`

**Headers:**

- `x-publishable-api-key: <your-api-key>`
- `Content-Type: application/json`
- `Authorization: Bearer <customer-token>`

**Path Parameters:**

- `address_id` - The ID of the address to update

**Request Body:**

```json
{
  "is_default_shipping": true
}
```

You can update any combination of fields:

- `first_name`
- `last_name`
- `phone`
- `company`
- `address_1`
- `address_2`
- `city`
- `country_code`
- `province`
- `postal_code`
- `is_default_shipping`
- `is_default_billing`
- `metadata`

**Response:**

```json
{
  "customer": {
    "id": "cus_01KCJZETTP92ZA9929Y8TW9TH2",
    "email": "admin2@gmail.com",
    "first_name": "admin",
    "last_name": "admin",
    "phone": "+201027050131",
    "addresses": [
      {
        "id": "cuaddr_01KCK0RRC0QSF3612Q12ZYKWVA",
        "address_name": null,
        "is_default_shipping": true,
        "is_default_billing": false,
        "company": "Shopyneer",
        "first_name": "Eng",
        "last_name": "Bassam",
        "address_1": "Maadi, Cairo",
        "address_2": "23th street, building b2, apt 6",
        "city": "Maadi",
        "country_code": "EG",
        "province": "eg-c",
        "postal_code": "00000",
        "phone": "+201027050131",
        "metadata": {},
        "customer_id": "cus_01KCJZETTP92ZA9929Y8TW9TH2",
        "created_at": "2025-12-16T07:25:04.257Z",
        "updated_at": "2025-12-16T07:28:51.981Z",
        "deleted_at": null
      }
    ]
  }
}
```

**Example cURL:**

```bash
curl --location 'https://backend-production-f59a.up.railway.app/store/customers/me/addresses/cuaddr_01K1PSDA9A2XGJMVQYZW1G03F1' \
--header 'x-publishable-api-key: <your-api-key>' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <customer-token>' \
--data '{
  "is_default_shipping": true
}'
```

---

## Delete Address

Deletes an address from the customer's account.

**Endpoint:** `DELETE /store/customers/me/addresses/{address_id}`

**Headers:**

- `x-publishable-api-key: <your-api-key>`
- `Authorization: Bearer <customer-token>`

**Path Parameters:**

- `address_id` - The ID of the address to delete

**Response:**

```json
{
  "id": "cus_01KCJZETTP92ZA9929Y8TW9TH2",
  "object": "address",
  "deleted": true,
  "parent": {
    "id": "cus_01KCJZETTP92ZA9929Y8TW9TH2",
    "first_name": "admin",
    "last_name": "admin",
    "phone": "+201027050131",
    "created_at": "2025-12-16T07:02:10.518Z",
    "updated_at": "2025-12-16T07:02:10.518Z"
  }
}
```

**Example cURL:**

```bash
curl --location --request DELETE 'https://backend-production-f59a.up.railway.app/store/customers/me/addresses/cuaddr_01K1PR93N3T9DE1APPCGHA2RAT' \
--header 'x-publishable-api-key: <your-api-key>' \
--header 'Authorization: Bearer <customer-token>'
```

---

## List Addresses

Retrieves all addresses for the authenticated customer.

**Endpoint:** `GET /store/customers/me/addresses`

**Headers:**

- `x-publishable-api-key: <your-api-key>`
- `Authorization: Bearer <customer-token>`

**Query Parameters:**

- `limit` (optional) - Number of addresses to return (default: 50)
- `offset` (optional) - Number of addresses to skip (default: 0)

**Response:**

```json
{
  "addresses": [
    {
      "id": "cuaddr_01KCK1QNMXT2XA2SWCYFZDRP18",
      "company": "Shopyneer",
      "customer_id": "cus_01KCJZETTP92ZA9929Y8TW9TH2",
      "first_name": "Eng",
      "last_name": "Bassam",
      "address_1": "Maadi, Cairo",
      "address_2": "23th street, building b2, apt 6",
      "city": "Maadi",
      "province": "eg-c",
      "postal_code": "00000",
      "country_code": "EG",
      "phone": "+201027050131",
      "metadata": {},
      "is_default_shipping": false,
      "is_default_billing": false,
      "created_at": "2025-12-16T07:41:57.279Z",
      "updated_at": "2025-12-16T07:41:57.279Z"
    }
  ],
  "count": 1,
  "offset": 0,
  "limit": 50
}
```

**Example cURL:**

```bash
curl --location 'https://backend-production-f59a.up.railway.app/store/customers/me/addresses' \
--header 'x-publishable-api-key: <your-api-key>' \
--header 'Authorization: Bearer <customer-token>'
```
