# Orders API

This document describes the API endpoints for managing customer orders.

## Base URL

All endpoints use the base URL: `https://backend-production-f59a.up.railway.app`

## Authentication

All order endpoints require:

- `x-publishable-api-key` header
- `Authorization: Bearer <token>` header (customer authentication token)

---

## List Orders

Retrieves a list of orders for the authenticated customer.

**Endpoint:** `GET /store/orders`

**Headers:**

- `Accept: application/json`
- `x-publishable-api-key: <your-api-key>`
- `Authorization: Bearer <customer-token>`

**Query Parameters:**

- `limit` (optional) - Number of orders to return (default: 50)
- `offset` (optional) - Number of orders to skip (default: 0)

**Response:**

```json
{
  "orders": [
    {
      "id": "order_01KCK207ZHEAHKFMM0HF025C24",
      "status": "pending",
      "display_id": 36,
      "total": 985,
      "currency_code": "egp",
      "payment_status": "authorized",
      "fulfillment_status": "not_fulfilled",
      "created_at": "2025-12-16T07:46:38.196Z",
      "updated_at": "2025-12-16T07:46:38.196Z",
      "items": [
        {
          "id": "ordli_01KCK207ZJC55NCX77QR72SK0P",
          "title": "Default variant",
          "subtitle": "INAWLY Cartoon Graphic Thermal Lined Sweatshirt",
          "thumbnail": "https://bucket-production-d8cb.up.railway.app/medusa-media/...",
          "variant_id": "variant_01JW3V17CPQH7KHW8NNEM5H1VJ",
          "product_id": "prod_01JW3V1795SK9EYH4DVPXX1N1W",
          "product_title": "INAWLY Cartoon Graphic Thermal Lined Sweatshirt",
          "product_handle": "inawly-cartoon-graphic-thermal-lined-sweatshirt",
          "unit_price": 500,
          "quantity": 2,
          "subtotal": 1000,
          "total": 975,
          "original_total": 1000,
          "discount_total": 25,
          "adjustments": [
            {
              "id": "ordliadj_01KCK207ZJ46PBWHDY5V1ZSSN2",
              "code": "Shopyneer25",
              "amount": 25,
              "subtotal": 25,
              "total": 25
            }
          ]
        }
      ],
      "summary": {
        "paid_total": 0,
        "refunded_total": 0,
        "accounting_total": 985,
        "current_order_total": 985,
        "original_order_total": 985
      }
    }
  ],
  "count": 1,
  "offset": 0,
  "limit": 50
}
```

**Example cURL:**

```bash
curl --location 'https://backend-production-f59a.up.railway.app/store/orders' \
--header 'Accept: application/json' \
--header 'x-publishable-api-key: <your-api-key>' \
--header 'Authorization: Bearer <customer-token>'
```

---

## Get Single Order

Retrieves detailed information about a specific order.

**Endpoint:** `GET /store/orders/{order_id}`

**Headers:**

- `x-publishable-api-key: <your-api-key>`
- `Authorization: Bearer <customer-token>`

**Path Parameters:**

- `order_id` - The ID of the order to retrieve

**Response:**

```json
{
  "order": {
    "id": "order_01KCK207ZHEAHKFMM0HF025C24",
    "status": "pending",
    "display_id": 36,
    "currency_code": "egp",
    "email": "john.doe@example.com",
    "total": 985,
    "subtotal": 1010,
    "tax_total": 0,
    "discount_total": 25,
    "shipping_total": 10,
    "item_total": 975,
    "payment_status": "authorized",
    "fulfillment_status": "not_fulfilled",
    "created_at": "2025-12-16T07:46:38.196Z",
    "updated_at": "2025-12-16T07:46:38.196Z",
    "items": [
      {
        "id": "ordli_01KCK207ZJC55NCX77QR72SK0P",
        "title": "Default variant",
        "subtitle": "INAWLY Cartoon Graphic Thermal Lined Sweatshirt",
        "thumbnail": "https://bucket-production-d8cb.up.railway.app/medusa-media/...",
        "variant_id": "variant_01JW3V17CPQH7KHW8NNEM5H1VJ",
        "product_id": "prod_01JW3V1795SK9EYH4DVPXX1N1W",
        "product_title": "INAWLY Cartoon Graphic Thermal Lined Sweatshirt",
        "product_handle": "inawly-cartoon-graphic-thermal-lined-sweatshirt",
        "unit_price": 500,
        "quantity": 2,
        "subtotal": 1000,
        "total": 975,
        "original_total": 1000,
        "discount_total": 25,
        "adjustments": [
          {
            "code": "Shopyneer25",
            "amount": 25
          }
        ],
        "variant": {
          "id": "variant_01JW3V17CPQH7KHW8NNEM5H1VJ",
          "title": "Default variant",
          "product": {
            "id": "prod_01JW3V1795SK9EYH4DVPXX1N1W",
            "title": "INAWLY Cartoon Graphic Thermal Lined Sweatshirt",
            "handle": "inawly-cartoon-graphic-thermal-lined-sweatshirt"
          }
        }
      }
    ],
    "shipping_address": {
      "id": "caaddr_01KCK1WVAKR8SZXRR1VY9XSV13",
      "first_name": "John",
      "last_name": "Doe",
      "company": "Example Corp",
      "address_1": "123 Main St",
      "address_2": "Apt 4B",
      "city": "Springfield",
      "country_code": "eg",
      "province": "IL",
      "postal_code": "12345",
      "phone": "01027050131"
    },
    "billing_address": {
      "id": "caaddr_01KCK1WVAHWJW2DCJ7R06E3XQG",
      "first_name": "Jane",
      "last_name": "Smith",
      "company": "Acme Inc",
      "address_1": "456 Elm St",
      "city": "Shelbyville",
      "country_code": "eg",
      "province": "IN",
      "postal_code": "67890",
      "phone": "+9876543210"
    },
    "shipping_methods": [
      {
        "id": "ordsm_01KCK207ZGJD3GKVW7X6BZCW5D",
        "name": "standard",
        "amount": 10,
        "subtotal": 10,
        "total": 10
      }
    ],
    "payment_collections": [
      {
        "id": "pay_col_01KCK1YJ54SQ92GZ3556XE1A4T",
        "currency_code": "egp",
        "status": "authorized",
        "amount": 985,
        "authorized_amount": 985,
        "captured_amount": 0,
        "refunded_amount": 0
      }
    ],
    "fulfillments": []
  }
}
```

**Example cURL:**

```bash
curl --location 'https://backend-production-f59a.up.railway.app/store/orders/order_01KCK207ZHEAHKFMM0HF025C24' \
--header 'x-publishable-api-key: <your-api-key>' \
--header 'Authorization: Bearer <customer-token>'
```

---

## Cancel Order

Cancels an order. Only allowed if the order is not yet fulfilled.

**Endpoint:** `POST /store/orders/{order_id}/cancel`

**Headers:**

- `Content-Type: application/json`
- `x-publishable-api-key: <your-api-key>`
- `Authorization: Bearer <customer-token>`

**Path Parameters:**

- `order_id` - The ID of the order to cancel

**Request Body:**

```json
{
  "no_notification": false
}
```

**Response:**

```json
{
  "message": "Order and fulfillments canceled successfully",
  "canceledFulfillments": 0
}
```

**Example cURL:**

```bash
curl --location 'https://backend-production-f59a.up.railway.app/store/orders/order_01KCK4G240HZ259X3B3FAQQ3FF/cancel' \
--header 'Content-Type: application/json' \
--header 'x-publishable-api-key: <your-api-key>' \
--header 'Authorization: Bearer <customer-token>' \
--data '{
  "no_notification": false
}'
```

**Note:** The `no_notification` parameter controls whether cancellation notifications should be sent. Set to `true` to suppress notifications.
