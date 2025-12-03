# Cart & Payment Flow API Documentation

## Configuration

**Base URL:** `https://backend-production-f59a.up.railway.app`

**API Key Header:**

```
x-publishable-api-key: pk_a48bcdbf4f1f8197a35e99cde5374e470989ecd9e34d0b101a0cdbb908c83c3d
```

**Default Region ID:** `reg_01JVS99K21H4M6E2DN639Q9NXG`

---

## Cart Operations

These are all the operations that can be done on carts:

### Create Cart

#### Endpoint

```
POST /store/carts
```

Creates a cart with 0 items.

#### Request Body

No body required.

#### Response Example

```json
{
  "cart": {
    "id": "cart_01KBJ1Q29YDGJV3RSQ8HTZRHV3",
    "currency_code": "egp",
    "email": null,
    "region_id": "reg_01JVS99K21H4M6E2DN639Q9NXG",
    "total": 0,
    "subtotal": 0,
    "items": [],
    "shipping_methods": [],
    "shipping_address": {
      "id": "caaddr_01KBJ1Q29YGS074KCDJF3YEVJJ",
      "country_code": "eg"
    },
    "billing_address": null,
    "promotions": []
  }
}
```

> **Note:** You should store the cart ID in localStorage, session storage, or cookies, so you can later operate on it.

---

### Add Item to Cart

#### Endpoint

```
POST /store/carts/{cartId}/line-items
```

Adds an item to the cart and calculates the new total price.

#### Request Body

```json
{
  "variant_id": "variant_01JW3V17CPQH7KHW8NNEM5H1VJ",
  "quantity": 2
}
```

#### Response

Returns the updated cart with the new item and recalculated totals.

**Key fields in response:**

- `cart.items[]` - Array of cart items
- `cart.total` - Total amount after discounts
- `cart.subtotal` - Subtotal before discounts
- `cart.discount_total` - Total discount amount
- `cart.promotions[]` - Applied promotions (including automatic ones)

---

### Update Item Quantity

#### Endpoint

```
POST /store/carts/{cartId}/line-items/{lineItemId}
```

Allows you to update the quantity of an item in the cart.

#### Request Body

```json
{
  "quantity": 12
}
```

#### Response

Returns the updated cart with recalculated totals.

---

### Remove Item from Cart

#### Endpoint

```
DELETE /store/carts/{cartId}/line-items/{lineItemId}
```

Allows you to remove an item from the cart.

#### Response

Returns a deletion confirmation and the updated cart with recalculated totals.

---

### Add Discount Code

#### Endpoint

```
POST /store/carts/{cartId}/promotions
```

Allows you to apply a discount code on the cart.

#### Request Body

```json
{
  "promo_codes": ["bassam"]
}
```

#### Response

Returns the updated cart with the applied discount and updated totals.

**Key fields:**

- `cart.discount_total` - Total discount amount
- `cart.promotions[]` - All applied promotions (automatic + manual)
- `cart.items[].adjustments[]` - Discount adjustments per item

---

### Add Shipping & Billing Address

#### Endpoint

```
POST /store/carts/{cartId}
```

Allows you to add shipping and billing addresses to the cart.

#### Request Body

```json
{
  "shipping_address": {
    "first_name": "John",
    "last_name": "Doe",
    "address_1": "123 Main St",
    "address_2": "Apt 4B",
    "company": "Example Corp",
    "postal_code": "12345",
    "city": "Springfield",
    "country_code": "eg",
    "province": "IL",
    "phone": "01027050131"
  },
  "email": "john.doe@example.com",
  "billing_address": {
    "first_name": "Jane",
    "last_name": "Smith",
    "address_1": "456 Elm St",
    "address_2": "",
    "company": "Acme Inc",
    "postal_code": "67890",
    "city": "Shelbyville",
    "country_code": "eg",
    "province": "IN",
    "phone": "+9876543210"
  }
}
```

#### Response

Returns the updated cart with addresses and customer information.

**Key fields:**

- `cart.shipping_address` - Shipping address object
- `cart.billing_address` - Billing address object
- `cart.email` - Customer email
- `cart.customer_id` - Customer ID (created if email provided)

---

## Shipping

### Get Shipping Options

#### Endpoint

```
GET /store/shipping-options?cart_id={cartId}
```

Returns all available shipping methods for the cart.

#### Response Example

```json
{
  "shipping_options": [
    {
      "id": "so_01JXQ17A3B9YRGA3H2HA4H4CPT",
      "name": "standard",
      "price_type": "flat",
      "calculated_price": {
        "calculated_amount": 10,
        "currency_code": "egp"
      },
      "amount": 10,
      "is_tax_inclusive": true,
      "insufficient_inventory": false
    },
    {
      "id": "so_01JYEA7PFWQFZ2VFQEDK2D3V8Q",
      "name": "Default",
      "price_type": "flat",
      "calculated_price": {
        "calculated_amount": 10,
        "currency_code": "egp"
      },
      "amount": 10,
      "is_tax_inclusive": true,
      "insufficient_inventory": false
    }
  ]
}
```

> **Note:** Shipping options may have conditional pricing (e.g., free shipping for orders over a certain amount).

---

### Select Shipping Method

#### Endpoint

```
POST /store/carts/{cartId}/shipping-methods
```

Allows you to select a shipping method for the cart.

#### Request Body

```json
{
  "option_id": "so_01JXQ17A3B9YRGA3H2HA4H4CPT"
}
```

#### Response

Returns the updated cart with the selected shipping method and recalculated totals.

---

## Payments

### COD (Cash on Delivery)

This is the easier payment method as it doesn't involve dealing with third parties.

#### Step 1: Get Payment Options

##### Endpoint

```
GET /store/payment-providers?region_id={regionId}
```

Returns all available payment providers.

##### Response Example

```json
{
  "payment_providers": [
    {
      "id": "pp_system_default",
      "is_enabled": true
    },
    {
      "id": "pp_fawaterak_json",
      "is_enabled": true
    }
  ],
  "count": 2
}
```

> **Note:** COD (Cash on Delivery) uses the provider ID `pp_system_default`.

---

#### Step 2: Initiate Payment

##### 2.1 Create Payment Collection

##### Endpoint

```
POST /store/payment-collections
```

Creates a new payment collection for the cart.

##### Request Body

```json
{
  "cart_id": "cart_01KBJ1Q29YDGJV3RSQ8HTZRHV3"
}
```

##### Response Example

```json
{
  "payment_collection": {
    "id": "pay_col_01KBJ2FZBGAPTRFQTQBPE9HG2P",
    "currency_code": "egp",
    "amount": 935,
    "payment_sessions": []
  }
}
```

---

##### 2.2 Create Payment Session

##### Endpoint

```
POST /store/payment-collections/{paymentCollectionId}/payment-sessions
```

Creates a payment session with the selected payment provider.

##### Request Body

```json
{
  "provider_id": "pp_system_default",
  "data": {
    "cartId": "cart_01KBJ1Q29YDGJV3RSQ8HTZRHV3"
  }
}
```

##### Response Example

```json
{
  "payment_collection": {
    "id": "pay_col_01KBJ2FZBGAPTRFQTQBPE9HG2P",
    "currency_code": "egp",
    "amount": 935,
    "payment_sessions": [
      {
        "id": "payses_01KBJ2K8T128JAHQCVPZFADK63",
        "currency_code": "egp",
        "provider_id": "pp_system_default",
        "status": "pending",
        "amount": 935
      }
    ]
  }
}
```

---

#### Step 3: Complete Cart

##### Endpoint

```
POST /store/carts/{cartId}/complete
```

Completes the cart and creates an order. Returns the order ID.

##### Response Example

```json
{
  "type": "order",
  "order": {
    "id": "order_01KBJ2KPZ4197KNWTYFQA75YRA",
    "status": "pending",
    "display_id": 27,
    "currency_code": "egp",
    "email": "john.doe@example.com",
    "total": 935,
    "subtotal": 1010,
    "discount_total": 75,
    "item_total": 925,
    "shipping_total": 10,
    "items": [
      {
        "id": "ordli_01KBJ2KPZ5HVMNKKWWTSD99YX9",
        "title": "Default variant",
        "subtitle": "INAWLY Cartoon Graphic Thermal Lined Sweatshirt",
        "quantity": 2,
        "unit_price": 500,
        "total": 925,
        "subtotal": 1000
      }
    ],
    "shipping_address": {
      "first_name": "John",
      "last_name": "Doe",
      "address_1": "123 Main St",
      "city": "Springfield",
      "country_code": "eg",
      "phone": "01027050131"
    },
    "billing_address": {
      "first_name": "Jane",
      "last_name": "Smith",
      "address_1": "456 Elm St",
      "city": "Shelbyville",
      "country_code": "eg"
    },
    "shipping_methods": [
      {
        "id": "ordsm_01KBJ2KPZ47H9DM3N8SJ9G2W50",
        "name": "standard",
        "amount": 10
      }
    ],
    "payment_collections": [
      {
        "id": "pay_col_01KBJ2FZBGAPTRFQTQBPE9HG2P",
        "currency_code": "egp",
        "amount": 935,
        "status": "authorized"
      }
    ]
  }
}
```

---

### Fawaterak Payment

Fawaterak is an online payment gateway provider.

#### Step 1: Get Payment Options

##### Endpoint

```
GET /store/payment-providers?region_id={regionId}
```

Returns all available payment providers.

##### Response Example

```json
{
  "payment_providers": [
    {
      "id": "pp_system_default",
      "is_enabled": true
    },
    {
      "id": "pp_fawaterak_json",
      "is_enabled": true
    }
  ],
  "count": 2
}
```

> **Note:** Fawaterak uses the provider ID `pp_fawaterak_json`.

---

#### Step 2: Initiate Payment

##### 2.1 Create Payment Collection

##### Endpoint

```
POST /store/payment-collections
```

Creates a new payment collection for the cart.

##### Request Body

```json
{
  "cart_id": "cart_01KBJ3JJKS8PB7EYP10NFGKJEX"
}
```

##### Response Example

```json
{
  "payment_collection": {
    "id": "pay_col_01KBJ3KFKR93PKY077N925Z345",
    "currency_code": "egp",
    "amount": 985,
    "payment_sessions": []
  }
}
```

---

##### 2.2 Create Payment Session

##### Endpoint

```
POST /store/payment-collections/{paymentCollectionId}/payment-sessions
```

Creates a payment session with Fawaterak payment provider.

##### Request Body

```json
{
  "provider_id": "pp_fawaterak_json",
  "data": {
    "cartId": "cart_01KBJ3JJKS8PB7EYP10NFGKJEX",
    "returnUrl": "https://www.youtube.com/"
  }
}
```

> **Important:** When using Fawaterak, you **must** include a `returnUrl` in the payload. This is the URL where users will be redirected after completing their payment.

##### Response Example

```json
{
  "payment_collection": {
    "id": "pay_col_01KBJ3KFKR93PKY077N925Z345",
    "currency_code": "egp",
    "amount": 985,
    "payment_sessions": [
      {
        "id": "payses_01KBJ3KV7R2YK19H0BF9ZG6SDY",
        "currency_code": "egp",
        "provider_id": "pp_fawaterak_json",
        "data": {
          "cartId": "cart_01KBJ3JJKS8PB7EYP10NFGKJEX",
          "invoiceId": "6066001",
          "returnUrl": "https://www.youtube.com/",
          "invoiceKey": "oh07jvFy5bBTyUF",
          "checkoutUrl": "https://app.fawaterk.com/lk/3821484"
        },
        "status": "pending",
        "amount": 985
      }
    ]
  }
}
```

**Key fields in response:**

- `payment_sessions[].data.checkoutUrl` - **Redirect users to this URL** to complete payment on Fawaterak's payment page
- `payment_sessions[].data.invoiceId` - Invoice ID from Fawaterak
- `payment_sessions[].data.invoiceKey` - Invoice key for verification

---

#### Step 3: Redirect to Fawaterak

After receiving the payment session response, redirect the user to the `checkoutUrl` from the response:

```javascript
// Example: Redirect user to Fawaterak payment page
window.location.href = paymentSession.data.checkoutUrl;
```

---

#### Step 4: Handle Return URL

After the user completes payment (successful or failed), Fawaterak will redirect them back to your `returnUrl` with query parameters.

**Example return URL:**

```
https://www.youtube.com/?invoiceId=6066001&invoiceKey=oh07jvFy5bBTyUF&status=success
```

**Query Parameters:**

- `invoiceId` - The invoice ID
- `invoiceKey` - The invoice key for verification
- `status` - Payment status (`success` or `failed`)

You should verify the payment status and complete the cart accordingly.

---

#### Step 5: Complete Cart

After verifying the payment, complete the cart using the same endpoint as COD:

##### Endpoint

```
POST /store/carts/{cartId}/complete
```

This will create the order and finalize the purchase.

---

## Complete Flow Summary

### COD Flow

1. **Create Cart** → `POST /store/carts`
2. **Add Items** → `POST /store/carts/{cartId}/line-items`
3. **Add Addresses** → `POST /store/carts/{cartId}`
4. **Get Shipping Options** → `GET /store/shipping-options?cart_id={cartId}`
5. **Select Shipping Method** → `POST /store/carts/{cartId}/shipping-methods`
6. **Get Payment Providers** → `GET /store/payment-providers?region_id={regionId}`
7. **Create Payment Collection** → `POST /store/payment-collections`
8. **Create Payment Session** → `POST /store/payment-collections/{paymentCollectionId}/payment-sessions` (with `pp_system_default`)
9. **Complete Cart** → `POST /store/carts/{cartId}/complete`

### Fawaterak Flow

1. **Create Cart** → `POST /store/carts`
2. **Add Items** → `POST /store/carts/{cartId}/line-items`
3. **Add Addresses** → `POST /store/carts/{cartId}`
4. **Get Shipping Options** → `GET /store/shipping-options?cart_id={cartId}`
5. **Select Shipping Method** → `POST /store/carts/{cartId}/shipping-methods`
6. **Get Payment Providers** → `GET /store/payment-providers?region_id={regionId}`
7. **Create Payment Collection** → `POST /store/payment-collections`
8. **Create Payment Session** → `POST /store/payment-collections/{paymentCollectionId}/payment-sessions` (with `pp_fawaterak_json` and `returnUrl`)
9. **Redirect to Fawaterak** → Redirect user to `checkoutUrl` from response
10. **Handle Return** → Process return URL with payment status
11. **Complete Cart** → `POST /store/carts/{cartId}/complete`

---

## Common Endpoints

### Get Cart

```
GET /store/carts/{cartId}
```

### Update Cart

```
POST /store/carts/{cartId}
```

### Delete Cart

```
DELETE /store/carts/{cartId}
```
