# Shopyneer Frontend Integration Guide

Welcome! 👋 This guide will help you integrate the backend API into your Angular application. The API is built on Medusa.js with custom extensions. This demo shows all the endpoints in action - use it as a reference for your integration.

---

## Table of Contents

1. [Configuration](#configuration)
2. [Authentication](#authentication)
3. [Product Catalog](#product-catalog)
4. [Cart & Checkout](#cart--checkout)
5. [Customer Account](#customer-account)
6. [Store Settings & Features](#store-settings--features)
7. [Follow-up Requirements](#follow-up-requirements)

---

## Configuration

### Environment Variables

```bash
NEXT_PUBLIC_API_BASE_URL=https://backend-production-f59a.up.railway.app
NEXT_PUBLIC_API_KEY=pk_a48bcdbf4f1f8197a35e99cde5374e470989ecd9e34d0b101a0cdbb908c83c3d
NEXT_PUBLIC_DEFAULT_REGION_ID=reg_01JVS99K21H4M6E2DN639Q9NXG
```

### API Headers

All requests must include these headers:

```typescript
{
  "x-publishable-api-key": "YOUR_API_KEY",
  "Content-Type": "application/json"
}
```

For authenticated requests, also include:

```typescript
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Base URL

All endpoints in this guide are relative to the base URL: `https://backend-production-f59a.up.railway.app`

---

## Authentication

### Email/Password Registration

**Flow:**

1. Register the user (returns initial token)
2. Create customer profile with the token
3. Login to get the final session token

#### Step 1: Register

```http
POST /auth/customer/emailpass/register
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Step 2: Create Customer Profile

```http
POST /store/customers
Authorization: Bearer {initial_token}
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+201234567890"
}
```

**Response:**

```json
{
  "customer": {
    "id": "cus_01abc...",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+201234567890",
    "has_account": true,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Step 3: Login

```http
POST /auth/customer/emailpass
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Store this token in localStorage for authenticated requests.

---

### Email/Password Login

```http
POST /auth/customer/emailpass
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Then fetch customer data:

```http
GET /store/customers/me
Authorization: Bearer {token}
```

---

### Google OAuth Login

Google authentication is a multi-step process:

#### Step 1: Initiate Google Login

```http
POST /auth/customer/google
```

**Request Body:** `{}`

**Response:**

```json
{
  "location": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

Redirect the user to the `location` URL. Google will redirect back to your callback URL with query parameters.

#### Step 2: Handle Callback

When Google redirects back to `/auth/google/callback?code=...&state=...`, capture all query parameters and send them:

```http
POST /auth/customer/google/callback?code=...&state=...
```

**Request Body:** `{}`

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Step 3: Check if Customer Exists

Decode the JWT token. The payload contains:

- `actor_id`: If empty/null, the customer needs to be created (new user)
- `user_metadata`: Contains `email`, `given_name`, `family_name` from Google

**For new users (empty `actor_id`):**

```http
POST /store/customers
Authorization: Bearer {callback_token}
```

**Request Body:**

```json
{
  "email": "user@gmail.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

Then refresh the token:

```http
POST /auth/token/refresh
Authorization: Bearer {callback_token}
```

**For existing users:**
Just use the callback token directly to fetch customer data.

---

### Password Reset

#### Request Reset Email

```http
POST /auth/customer/emailpass/reset-password
```

**Request Body:**

```json
{
  "identifier": "user@example.com"
}
```

The user receives an email with a reset link containing a token.

#### Update Password

```http
POST /auth/customer/emailpass/update
Authorization: Bearer {reset_token_from_email}
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "newSecurePassword123"
}
```

---

## Product Catalog

### Get Store Settings

Contains important IDs for home page sections (flash sale, best sellers, etc.):

```http
GET /store/settings
```

**Response:**

```json
{
  "id": "store_01abc...",
  "metadata": {
    "flash_sale_tag_id": "ptag_01abc...",
    "flash_sale_end_time": "2024-12-31T23:59:59.000Z",
    "best_seller_tag_id": "ptag_02def...",
    "new_arrival_tag_id": "ptag_03ghi...",
    "recommended_tag_id": "ptag_04jkl...",
    "slider_images": [{ "url": "https://...", "link": "/category/skincare" }],
    "secondary_slider_images": [
      { "url": "https://...", "link": "/search?tag=..." }
    ],
    "tags_boxes": {
      "box1": { "title": "Skincare", "tagIds": ["ptag_01...", "ptag_02..."] },
      "box2": { "title": "Makeup", "tagIds": ["ptag_03..."] },
      "box3": { "title": "Hair Care", "tagIds": ["ptag_04..."] }
    }
  }
}
```

---

### List Products

```http
GET /store/products?fields=*variants.calculated_price,*sales
```

**Query Parameters:**
| Parameter | Description |
|-----------|-------------|
| `fields` | Comma-separated fields to include. Use `*variants.calculated_price` for pricing |
| `tag_id` | Filter by product tag ID |
| `category_id` | Filter by category ID |
| `q` | Search query string |
| `limit` | Number of results (default: 20) |
| `offset` | Pagination offset |

**Response:**

```json
{
  "products": [
    {
      "id": "prod_01abc...",
      "title": "Hydrating Face Cream",
      "subtitle": "For all skin types",
      "description": "A moisturizing face cream...",
      "handle": "hydrating-face-cream",
      "thumbnail": "https://...",
      "tags": [{ "id": "ptag_01...", "value": "best-seller" }],
      "categories": [
        { "id": "pcat_01...", "name": "Skincare", "handle": "skincare" }
      ],
      "brand": {
        "id": "brand_01...",
        "name": "BrandName",
        "image": "https://..."
      },
      "variants": [
        {
          "id": "variant_01abc...",
          "title": "50ml",
          "sku": "HFC-50",
          "inventory_quantity": 25,
          "manage_inventory": true,
          "allow_backorder": false,
          "options": [
            { "id": "optval_01...", "value": "50ml", "option_id": "opt_01..." }
          ],
          "metadata": {
            "thumbnail": "https://...",
            "images": [{ "url": "https://..." }]
          },
          "calculated_price": {
            "calculated_amount": 299,
            "original_amount": 399,
            "currency_code": "egp",
            "calculated_price": { "price_list_type": "sale" }
          }
        }
      ],
      "options": [
        {
          "id": "opt_01...",
          "title": "Size",
          "values": [
            { "id": "optval_01...", "value": "50ml" },
            { "id": "optval_02...", "value": "100ml" }
          ]
        }
      ],
      "images": [{ "id": "img_01...", "url": "https://...", "rank": 0 }],
      "reviews": [
        {
          "id": "rev_01...",
          "rating": 5,
          "title": "Great product!",
          "description": "Love it!",
          "customer": { "first_name": "Jane" }
        }
      ],
      "sales": { "id": "sales_01...", "sales": 150 }
    }
  ],
  "count": 100,
  "offset": 0,
  "limit": 20
}
```

---

### Get Single Product

```http
GET /store/products/{product_id}?fields=*brand,*variants.calculated_price,+variants.inventory_quantity,*categories,*reviews,*reviews.customer,*sales
```

Returns the same structure as above but for a single product.

---

### Frequently Bought Together

```http
GET /store/together/{product_id}
```

**Response:**

```json
{
  "products": [
    {
      /* product objects */
    }
  ]
}
```

---

### List Categories

```http
GET /store/product-categories
```

**Response:**

```json
{
  "product_categories": [
    {
      "id": "pcat_01abc...",
      "name": "Skincare",
      "description": "All skincare products",
      "handle": "skincare",
      "rank": 0,
      "parent_category_id": null,
      "parent_category": null,
      "category_children": [
        {
          "id": "pcat_02def...",
          "name": "Moisturizers",
          "handle": "moisturizers"
        }
      ],
      "metadata": {
        "thumbnail": "https://...",
        "category_slider_images": [
          { "url": "https://...", "link": "/search?..." }
        ]
      }
    }
  ],
  "count": 15
}
```

---

### Get Single Category

```http
GET /store/product-categories/{category_id}
```

---

### List Brands

```http
GET /store/brands
```

**Response:**

```json
{
  "brands": [
    {
      "id": "brand_01abc...",
      "name": "Brand Name",
      "description": "Brand description",
      "image": "https://...",
      "tag_id": "ptag_01..."
    }
  ]
}
```

---

### Get Single Brand

```http
GET /store/brands/{brand_id}
```

---

### List Product Tags

```http
GET /store/product-tags?fields=value,metadata
```

**Response:**

```json
{
  "product_tags": [
    {
      "id": "ptag_01abc...",
      "value": "flash-sale",
      "metadata": { "thumbnail": "https://..." }
    }
  ],
  "count": 10
}
```

---

### Secondary Slider Images

```http
GET /store/sliders/secondary
```

**Response:**

```json
{
  "images": [{ "url": "https://...", "link": "/category/skincare" }],
  "count": 5
}
```

---

### Free Shipping Threshold

```http
GET /store/free-shipping-threshold
```

**Response:**

```json
{
  "threshold": "500"
}
```

(Null if no free shipping threshold is set)

---

## Cart & Checkout

### Create Cart

```http
POST /store/carts
```

**Request Body:** `{}`

**Response:**

```json
{
  "cart": {
    "id": "cart_01abc...",
    "region_id": "reg_01...",
    "currency_code": "egp",
    "email": null,
    "items": [],
    "total": 0,
    "subtotal": 0,
    "shipping_total": 0,
    "discount_total": 0,
    "shipping_address": null,
    "billing_address": null,
    "shipping_methods": [],
    "promotions": []
  }
}
```

**Important:** Store the `cart.id` in localStorage to persist the cart across sessions.

---

### Get Cart

```http
GET /store/carts/{cart_id}
```

---

### Add Item to Cart

```http
POST /store/carts/{cart_id}/line-items
```

**Request Body:**

```json
{
  "variant_id": "variant_01abc...",
  "quantity": 2
}
```

**Response:** Returns updated cart object

---

### Update Cart Item Quantity

```http
POST /store/carts/{cart_id}/line-items/{line_item_id}
```

**Request Body:**

```json
{
  "quantity": 3
}
```

---

### Remove Cart Item

```http
DELETE /store/carts/{cart_id}/line-items/{line_item_id}
```

---

### Apply Promo Code

```http
POST /store/carts/{cart_id}/promotions
```

**Request Body:**

```json
{
  "promo_codes": ["SAVE20"]
}
```

---

### Update Cart with Customer Info

```http
POST /store/carts/{cart_id}
```

**Request Body:**

```json
{
  "email": "customer@example.com",
  "shipping_address": {
    "first_name": "John",
    "last_name": "Doe",
    "address_1": "123 Main St",
    "address_2": "Apt 4B",
    "city": "Cairo",
    "country_code": "eg",
    "postal_code": "12345",
    "phone": "+201234567890"
  },
  "billing_address": {
    "first_name": "John",
    "last_name": "Doe",
    "address_1": "123 Main St",
    "city": "Cairo",
    "country_code": "eg",
    "phone": "+201234567890"
  }
}
```

---

### Get Shipping Options

```http
GET /store/shipping-options?cart_id={cart_id}
```

**Response:**

```json
{
  "shipping_options": [
    {
      "id": "so_01abc...",
      "name": "Standard Shipping",
      "price_type": "flat_rate",
      "amount": 50,
      "is_tax_inclusive": true,
      "insufficient_inventory": false,
      "calculated_price": {
        "calculated_amount": 50,
        "currency_code": "egp"
      }
    },
    {
      "id": "so_02def...",
      "name": "Express Shipping",
      "amount": 100,
      "calculated_price": {
        "calculated_amount": 100,
        "currency_code": "egp"
      }
    }
  ]
}
```

---

### Select Shipping Method

```http
POST /store/carts/{cart_id}/shipping-methods
```

**Request Body:**

```json
{
  "option_id": "so_01abc..."
}
```

---

### Get Payment Providers

```http
GET /store/payment-providers?region_id={region_id}
```

**Response:**

```json
{
  "payment_providers": [
    { "id": "pp_system_default", "is_enabled": true },
    { "id": "pp_fawaterak_json", "is_enabled": true }
  ],
  "count": 2
}
```

**Payment Provider IDs:**

- `pp_system_default`: Cash on Delivery (COD)
- `pp_fawaterak_json`: Online Payment (Fawaterak gateway)

---

### Create Payment Collection

```http
POST /store/payment-collections
```

**Request Body:**

```json
{
  "cart_id": "cart_01abc..."
}
```

**Response:**

```json
{
  "payment_collection": {
    "id": "paycol_01abc...",
    "currency_code": "egp",
    "amount": 500,
    "payment_sessions": []
  }
}
```

---

### Create Payment Session

```http
POST /store/payment-collections/{payment_collection_id}/payment-sessions
```

**Request Body:**

```json
{
  "provider_id": "pp_fawaterak_json",
  "data": {
    "cartId": "cart_01abc...",
    "returnUrl": "https://yoursite.com/order/confirmation"
  }
}
```

**Response (for Fawaterak):**

```json
{
  "payment_collection": {
    "id": "paycol_01abc...",
    "payment_sessions": [
      {
        "id": "payses_01abc...",
        "provider_id": "pp_fawaterak_json",
        "status": "pending",
        "amount": 500,
        "data": {
          "checkoutUrl": "https://checkout.fawaterak.com/..."
        }
      }
    ]
  }
}
```

For online payments, redirect the user to `checkoutUrl`. After payment, they'll be redirected back to your `returnUrl`.

---

### Complete Cart (Place Order)

```http
POST /store/carts/{cart_id}/complete
```

**Response:**

```json
{
  "type": "order",
  "order": {
    "id": "order_01abc...",
    "display_id": 1001,
    "status": "pending",
    "email": "customer@example.com",
    "currency_code": "egp",
    "total": 549,
    "subtotal": 499,
    "shipping_total": 50,
    "discount_total": 0,
    "items": [...],
    "shipping_address": {...},
    "billing_address": {...},
    "shipping_methods": [...],
    "payment_collections": [...]
  }
}
```

**Important:** Clear the stored cart ID after successful order completion.

---

## Customer Account

All endpoints in this section require authentication (`Authorization: Bearer {token}`).

### Get Current Customer

```http
GET /store/customers/me
```

---

### Update Customer Profile

```http
POST /store/customers/me
```

**Request Body:**

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+201234567890"
}
```

---

### Customer Addresses

#### List Addresses

```http
GET /store/customers/me/addresses
```

**Response:**

```json
{
  "addresses": [
    {
      "id": "addr_01abc...",
      "first_name": "John",
      "last_name": "Doe",
      "address_1": "123 Main St",
      "address_2": null,
      "city": "Cairo",
      "country_code": "eg",
      "postal_code": "12345",
      "phone": "+201234567890",
      "is_default_shipping": true,
      "is_default_billing": true
    }
  ],
  "count": 1
}
```

#### Create Address

```http
POST /store/customers/me/addresses
```

**Request Body:**

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "address_1": "123 Main St",
  "address_2": "Apt 4B",
  "city": "Cairo",
  "country_code": "eg",
  "postal_code": "12345",
  "phone": "+201234567890",
  "is_default_shipping": true,
  "is_default_billing": false
}
```

#### Update Address

```http
POST /store/customers/me/addresses/{address_id}
```

**Request Body:** Same structure as create, with only fields you want to update.

#### Delete Address

```http
DELETE /store/customers/me/addresses/{address_id}
```

---

### Customer Orders

#### List Orders

```http
GET /store/orders
```

**Response:**

```json
{
  "orders": [
    {
      "id": "order_01abc...",
      "display_id": 1001,
      "status": "pending",
      "payment_status": "captured",
      "fulfillment_status": "not_fulfilled",
      "currency_code": "egp",
      "total": 549,
      "subtotal": 499,
      "shipping_total": 50,
      "created_at": "2024-01-15T10:30:00.000Z",
      "items": [
        {
          "id": "item_01...",
          "title": "Product Name",
          "thumbnail": "https://...",
          "quantity": 2,
          "unit_price": 250,
          "total": 500,
          "variant": {
            "id": "variant_01...",
            "title": "50ml"
          }
        }
      ],
      "shipping_address": {...},
      "shipping_methods": [...]
    }
  ],
  "count": 5,
  "offset": 0,
  "limit": 10
}
```

#### Get Single Order

```http
GET /store/orders/{order_id}?fields=+cart.id
```

#### Cancel Order

```http
POST /store/orders/{order_id}/cancel
```

**Request Body:**

```json
{
  "no_notification": false
}
```

---

### Wishlist

#### Get Wishlist

```http
GET /store/customers/me/wishlists
```

**Response:**

```json
{
  "wishlist": {
    "id": "wish_01abc...",
    "customer_id": "cus_01...",
    "items": [
      {
        "id": "wishitem_01abc...",
        "product_variant_id": "variant_01...",
        "product_variant": {
          "id": "variant_01...",
          "title": "50ml",
          "product_id": "prod_01...",
          "metadata": { "thumbnail": "https://..." },
          "product": {
            "id": "prod_01...",
            "title": "Product Name",
            "handle": "product-name"
          }
        }
      }
    ]
  }
}
```

#### Create Wishlist

```http
POST /store/customers/me/wishlists
```

**Request Body:** `{}`

(Wishlist is auto-created when adding first item, but you can create it manually)

#### Add Item to Wishlist

```http
POST /store/customers/me/wishlists/items
```

**Request Body:**

```json
{
  "variant_id": "variant_01abc..."
}
```

#### Remove Item from Wishlist

```http
DELETE /store/customers/me/wishlists/items/{wishlist_item_id}
```

---

### Returns

#### Get Return Reasons

```http
GET /store/return-reasons
```

**Response:**

```json
{
  "return_reasons": [
    {
      "id": "rr_01abc...",
      "value": "defective",
      "label": "Product is defective"
    },
    {
      "id": "rr_02def...",
      "value": "wrong_item",
      "label": "Wrong item received"
    },
    {
      "id": "rr_03ghi...",
      "value": "not_as_described",
      "label": "Not as described"
    }
  ],
  "count": 3
}
```

#### Create Return Request

```http
POST /store/returns
Authorization: Bearer {token}
```

**Request Body:**

```json
{
  "order_id": "order_01abc...",
  "items": [
    {
      "id": "item_01abc...",
      "quantity": 1,
      "reason_id": "rr_01abc...",
      "note": "Item arrived damaged"
    }
  ],
  "return_shipping": {
    "option_id": "so_return_01...",
    "price": 0
  },
  "note": "Please process my return",
  "location_id": "loc_01..."
}
```

---

## Store Settings & Features

### Pricing Display

Prices use the `calculated_price` object on variants:

```typescript
interface CalculatedPrice {
  calculated_amount: number; // Current/sale price
  original_amount: number; // Original price
  currency_code: string; // e.g., "egp"
  calculated_price: {
    price_list_type: string | null; // "sale" if on sale, null otherwise
  };
}

// Check if product is on sale
const isOnSale = price.calculated_price?.price_list_type === "sale";

// Calculate discount percentage
const discountPercent = Math.round(
  ((price.original_amount - price.calculated_amount) / price.original_amount) *
    100
);
```

### Inventory Handling

```typescript
const variant = product.variants[0];

// Check if out of stock
const isOutOfStock =
  variant.manage_inventory &&
  !variant.allow_backorder &&
  (variant.inventory_quantity ?? 0) <= 0;

// Limit quantity selection to available stock
const maxQuantity = variant.manage_inventory
  ? variant.inventory_quantity
  : Infinity;
```

### Variant Selection

Products can have options (like Size, Color). Each combination maps to a variant:

```typescript
// Example: Find variant by selected option values
function findVariant(
  variants: ProductVariant[],
  selectedOptions: Record<string, string> // { "Size": "50ml", "Color": "Red" }
): ProductVariant | null {
  return variants.find((variant) =>
    variant.options.every(
      (opt) => selectedOptions[opt.option?.title ?? ""] === opt.value
    )
  );
}
```

### Variant Images

Variants can have their own images. Check `variant.metadata.thumbnail` and `variant.metadata.images` first, then fall back to `product.images`:

```typescript
function getVariantImages(variant: ProductVariant, product: Product) {
  if (variant.metadata?.thumbnail || variant.metadata?.images?.length) {
    const images = [];
    if (variant.metadata.thumbnail) {
      images.push({ url: variant.metadata.thumbnail });
    }
    if (variant.metadata.images) {
      images.push(...variant.metadata.images);
    }
    return images;
  }
  return product.images.map((img) => ({ url: img.url }));
}
```

---

## Follow-up Requirements

After you've completed the frontend integration, please provide me with the following information:

### 1. Google OAuth Configuration ⚠️ **Required**

I need your frontend URL to configure Google OAuth:

- **Production callback URL**: `https://your-domain.com/auth/google/callback`
- **Development callback URL**: `http://localhost:4200/auth/google/callback`

Please send me these URLs and I'll add them to the Google Console authorized redirect URIs.

### 2. Fawaterak Payment Gateway

If using online payments:

- **Return URL pattern**: The URL where users are redirected after payment (e.g., `https://your-domain.com/order/confirmation`)

### 3. Password Reset Email Template

The password reset email contains a link with a token. The link format is:

```
https://your-domain.com/reset-password?token={reset_token}&email={user_email}
```

Please confirm your reset password page URL so I can configure the email template.

### 4. CORS Configuration

Let me know your frontend domain(s) so I can add them to the API's CORS whitelist:

- Production: `https://your-domain.com`
- Staging: `https://staging.your-domain.com`
- Development: `http://localhost:4200`

---

## Tips for Angular Integration

### HTTP Interceptor for Auth

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem("shopyneer_auth_token");
    const apiKey = environment.apiKey;

    let headers = req.headers
      .set("x-publishable-api-key", apiKey)
      .set("Content-Type", "application/json");

    if (token) {
      headers = headers.set("Authorization", `Bearer ${token}`);
    }

    return next.handle(req.clone({ headers }));
  }
}
```

### Cart Persistence

Store the cart ID in localStorage:

```typescript
@Injectable({ providedIn: "root" })
export class CartService {
  private cartIdKey = "shopyneer_cart_id";

  getCartId(): string | null {
    return localStorage.getItem(this.cartIdKey);
  }

  setCartId(id: string): void {
    localStorage.setItem(this.cartIdKey, id);
  }

  clearCart(): void {
    localStorage.removeItem(this.cartIdKey);
  }
}
```

### Error Handling

API errors follow this structure:

```json
{
  "type": "invalid_data",
  "message": "Error message here"
}
```

Common HTTP status codes:

- `400`: Bad request / validation error
- `401`: Unauthorized (token expired or invalid)
- `404`: Resource not found
- `500`: Server error

---

## Questions?

Feel free to reach out if you have any questions about the API or need clarification on any endpoint. Good luck with the integration! 🚀
