# Wishlist API

This document describes the API endpoints for managing customer wishlists.

## Base URL

All endpoints use the base URL: `https://backend-production-f59a.up.railway.app`

## Authentication

All wishlist endpoints require:

- `x-publishable-api-key` header
- `Authorization: Bearer <token>` header (customer authentication token)

---

## Create Wishlist

Creates a new wishlist for the authenticated customer.

**Endpoint:** `POST /store/customers/me/wishlists`

**Headers:**

- `x-publishable-api-key: <your-api-key>`
- `Content-Type: application/json`
- `Authorization: Bearer <customer-token>`

**Request Body:**

```json
{}
```

**Response:**

```json
{
  "wishlist": {
    "id": "01KCK4PPJ9AYMP8TPCWNDN2068",
    "customer_id": "cus_01K21XRZ73QWXK2TA3M2QJENCK",
    "sales_channel_id": "sc_01JVS99JZ35KXH74XQZ2QYKZZH",
    "created_at": "2025-12-16T08:33:51.177Z",
    "updated_at": "2025-12-16T08:33:51.177Z",
    "deleted_at": null,
    "items": []
  }
}
```

**Example cURL:**

```bash
curl --location 'https://backend-production-f59a.up.railway.app/store/customers/me/wishlists' \
--header 'x-publishable-api-key: <your-api-key>' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <customer-token>' \
--data '{}'
```

---

## Add Item to Wishlist

Adds a product variant to the customer's wishlist.

**Endpoint:** `POST /store/customers/me/wishlists/items`

**Headers:**

- `x-publishable-api-key: <your-api-key>`
- `Content-Type: application/json`
- `Authorization: Bearer <customer-token>`

**Request Body:**

```json
{
  "variant_id": "variant_01JW3V17CPQH7KHW8NNEM5H1VJ"
}
```

**Response:**

```json
{
  "wishlist": {
    "id": "01KCK4PPJ9AYMP8TPCWNDN2068",
    "customer_id": "cus_01K21XRZ73QWXK2TA3M2QJENCK",
    "sales_channel_id": "sc_01JVS99JZ35KXH74XQZ2QYKZZH",
    "created_at": "2025-12-16T08:33:51.177Z",
    "updated_at": "2025-12-16T08:34:55.836Z",
    "deleted_at": null,
    "items": [
      {
        "id": "01KCK4RNPVMWP7ZHNPT5HB3BDP",
        "product_variant_id": "variant_01JW3V17CPQH7KHW8NNEM5H1VJ",
        "wishlist_id": "01KCK4PPJ9AYMP8TPCWNDN2068",
        "created_at": "2025-12-16T08:34:55.836Z",
        "updated_at": "2025-12-16T08:34:55.836Z",
        "deleted_at": null,
        "product_variant": {
          "id": "variant_01JW3V17CPQH7KHW8NNEM5H1VJ",
          "title": "Default variant",
          "product_id": "prod_01JW3V1795SK9EYH4DVPXX1N1W",
          "metadata": {
            "images": [
              {
                "url": "https://bucket-production-d8cb.up.railway.app/medusa-media/..."
              }
            ],
            "thumbnail": "https://bucket-production-d8cb.up.railway.app/medusa-media/..."
          },
          "prices": [
            {
              "id": "price_01JW3V17DSCFFMD2A4F7JCRNPA",
              "currency_code": "egp",
              "amount": 500
            }
          ]
        }
      }
    ]
  }
}
```

**Example cURL:**

```bash
curl --location 'https://backend-production-f59a.up.railway.app/store/customers/me/wishlists/items' \
--header 'x-publishable-api-key: <your-api-key>' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <customer-token>' \
--data '{
  "variant_id": "variant_01JW3V17CPQH7KHW8NNEM5H1VJ"
}'
```

---

## Get Wishlist

Retrieves the customer's wishlist with all items.

**Endpoint:** `GET /store/customers/me/wishlists`

**Headers:**

- `x-publishable-api-key: <your-api-key>`
- `Authorization: Bearer <customer-token>`

**Response:**

```json
{
  "wishlist": {
    "id": "01KCK4PPJ9AYMP8TPCWNDN2068",
    "customer_id": "cus_01K21XRZ73QWXK2TA3M2QJENCK",
    "sales_channel_id": "sc_01JVS99JZ35KXH74XQZ2QYKZZH",
    "created_at": "2025-12-16T08:33:51.177Z",
    "updated_at": "2025-12-16T08:34:55.836Z",
    "deleted_at": null,
    "items": [
      {
        "id": "01KCK4RNPVMWP7ZHNPT5HB3BDP",
        "product_variant_id": "variant_01JW3V17CPQH7KHW8NNEM5H1VJ",
        "wishlist_id": "01KCK4PPJ9AYMP8TPCWNDN2068",
        "product_variant": {
          "id": "variant_01JW3V17CPQH7KHW8NNEM5H1VJ",
          "title": "Default variant",
          "product_id": "prod_01JW3V1795SK9EYH4DVPXX1N1W",
          "metadata": {
            "thumbnail": "https://bucket-production-d8cb.up.railway.app/medusa-media/..."
          },
          "prices": [
            {
              "currency_code": "egp",
              "amount": 500
            }
          ]
        }
      }
    ]
  }
}
```

**Example cURL:**

```bash
curl --location 'https://backend-production-f59a.up.railway.app/store/customers/me/wishlists' \
--header 'x-publishable-api-key: <your-api-key>' \
--header 'Authorization: Bearer <customer-token>'
```

---

## Remove Item from Wishlist

Removes a specific item from the customer's wishlist.

**Endpoint:** `DELETE /store/customers/me/wishlists/items/{item_id}`

**Headers:**

- `x-publishable-api-key: <your-api-key>`
- `Authorization: Bearer <customer-token>`

**Path Parameters:**

- `item_id` - The ID of the wishlist item to remove

**Response:**

```json
{
  "wishlist": {
    "id": "01KCK4PPJ9AYMP8TPCWNDN2068",
    "customer_id": "cus_01K21XRZ73QWXK2TA3M2QJENCK",
    "sales_channel_id": "sc_01JVS99JZ35KXH74XQZ2QYKZZH",
    "created_at": "2025-12-16T08:33:51.177Z",
    "updated_at": "2025-12-16T08:34:55.836Z",
    "deleted_at": null,
    "items": []
  }
}
```

**Example cURL:**

```bash
curl --location --request DELETE 'https://backend-production-f59a.up.railway.app/store/customers/me/wishlists/items/01KBTQ6W5Q3DV05Z6G9AAW4Q2N' \
--header 'x-publishable-api-key: <your-api-key>' \
--header 'Authorization: Bearer <customer-token>'
```
