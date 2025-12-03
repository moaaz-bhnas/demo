# Product API Documentation

## Configuration

**Base URL:** `https://backend-production-f59a.up.railway.app`

**API Key Header:**

```
x-publishable-api-key: pk_a48bcdbf4f1f8197a35e99cde5374e470989ecd9e34d0b101a0cdbb908c83c3d
```

---

## Product Overview

### Endpoint

```
GET /store/products/{productId}?fields=*brand,*variants.calculated_price,+variants.inventory_quantity,*supplier,*categories,*collection.metadata,*reviews,*reviews.customer,*sales
```

### Example Request

```
GET {{BASE_URL}}/store/products/prod_01JW3V1795SK9EYH4DVPXX1N1W?fields=*brand,*variants.calculated_price,+variants.inventory_quantity,*supplier,*categories,*collection.metadata,*reviews,*reviews.customer,*sales
```

### Response Example

```json
{
  "product": {
    "id": "prod_01JXW91RSJZHJTSGMDQT6NSYFE",
    "title": "Winter Jacket",
    "subtitle": "Warm and cozy",
    "description": "A warm and cozy jacket",
    "handle": "winter-jacket",
    "is_giftcard": false,
    "discountable": true,
    "thumbnail": "https://bucket-production-d8cb.up.railway.app/medusa-media/81TY1oOC8CL._AC_SX679_-01JXW91QNB765A9997HP5NWDYV.jpg",
    "collection_id": "pcol_01K0P3Z0JSYA6RTV4VV8PWKEJ5",
    "type_id": null,
    "weight": "100",
    "length": "100",
    "height": "100",
    "width": "100",
    "hs_code": "100",
    "origin_country": "eg",
    "mid_code": "100",
    "material": null,
    "created_at": "2025-06-16T11:47:30.741Z",
    "updated_at": "2025-07-21T09:10:27.233Z",
    "type": null,
    "collection": {
      "id": "pcol_01K0P3Z0JSYA6RTV4VV8PWKEJ5",
      "title": "Makeup",
      "handle": "makeup",
      "metadata": null,
      "created_at": "2025-07-21T09:10:16.400Z",
      "updated_at": "2025-07-21T09:10:16.400Z",
      "deleted_at": null
    },
    "options": [
      {
        "id": "opt_01JXW91RSK216NY0JKMJ2Y5B0G",
        "title": "Color",
        "metadata": null,
        "product_id": "prod_01JXW91RSJZHJTSGMDQT6NSYFE",
        "created_at": "2025-06-16T11:47:30.742Z",
        "updated_at": "2025-06-16T11:47:30.742Z",
        "deleted_at": null,
        "values": [
          {
            "id": "optval_01JXW91RSK1T321BSGRMGMPGMT",
            "value": "Blue",
            "metadata": null,
            "option_id": "opt_01JXW91RSK216NY0JKMJ2Y5B0G",
            "created_at": "2025-06-16T11:47:30.742Z",
            "updated_at": "2025-06-16T11:47:30.742Z",
            "deleted_at": null
          },
          {
            "id": "optval_01JXW91RSKT5R4YPTTS1DT9D8B",
            "value": "Green",
            "metadata": null,
            "option_id": "opt_01JXW91RSK216NY0JKMJ2Y5B0G",
            "created_at": "2025-06-16T11:47:30.742Z",
            "updated_at": "2025-06-16T11:47:30.742Z",
            "deleted_at": null
          },
          {
            "id": "optval_01JXW91RSKQH0GTE63T8TZD5CD",
            "value": "Black",
            "metadata": null,
            "option_id": "opt_01JXW91RSK216NY0JKMJ2Y5B0G",
            "created_at": "2025-06-16T11:47:30.742Z",
            "updated_at": "2025-06-16T11:47:30.742Z",
            "deleted_at": null
          }
        ]
      },
      {
        "id": "opt_01JXW91RSMTVRY1R9KMWPWDBZN",
        "title": "Size",
        "metadata": null,
        "product_id": "prod_01JXW91RSJZHJTSGMDQT6NSYFE",
        "created_at": "2025-06-16T11:47:30.742Z",
        "updated_at": "2025-06-16T11:47:30.742Z",
        "deleted_at": null,
        "values": [
          {
            "id": "optval_01JXW91RSK47RE9Y1ENAMBPDKH",
            "value": "S",
            "metadata": null,
            "option_id": "opt_01JXW91RSMTVRY1R9KMWPWDBZN",
            "created_at": "2025-06-16T11:47:30.742Z",
            "updated_at": "2025-06-16T11:47:30.742Z",
            "deleted_at": null
          },
          {
            "id": "optval_01JXW91RSKZ3XK6R7D21H8T7AQ",
            "value": "L",
            "metadata": null,
            "option_id": "opt_01JXW91RSMTVRY1R9KMWPWDBZN",
            "created_at": "2025-06-16T11:47:30.742Z",
            "updated_at": "2025-06-16T11:47:30.742Z",
            "deleted_at": null
          },
          {
            "id": "optval_01JXW91RSKZ0M00G0V7YDYSS2F",
            "value": "M",
            "metadata": null,
            "option_id": "opt_01JXW91RSMTVRY1R9KMWPWDBZN",
            "created_at": "2025-06-16T11:47:30.742Z",
            "updated_at": "2025-06-16T11:47:30.742Z",
            "deleted_at": null
          }
        ]
      }
    ],
    "tags": [
      {
        "id": "ptag_01JZ9ZGMN9PRYS3J6FFS26PCCT",
        "value": "new-arrival",
        "metadata": null,
        "created_at": "2025-07-04T05:45:56.138Z",
        "updated_at": "2025-07-04T05:45:56.138Z",
        "deleted_at": null
      },
      {
        "id": "ptag_01JZ9ZFXW4AN4DNY00FZKDTC0K",
        "value": "high-rated",
        "metadata": {
          "thumbnail": "https://bucket-production-d8cb.up.railway.app/medusa-media/0f867a9a3380a1d8a8cba469fe2bed202d1e4c22-01K6YZX6VEVWGW0PG0GAPKV9TT.png"
        },
        "created_at": "2025-07-04T05:45:32.804Z",
        "updated_at": "2025-10-07T09:26:44.147Z",
        "deleted_at": null
      }
    ],
    "images": [
      {
        "id": "img_01JXWCPDANRAN8QPW7TGGPGKKR",
        "url": "https://bucket-production-d8cb.up.railway.app/medusa-media/81TY1oOC8CL._AC_SX679_-01JXW91QNB765A9997HP5NWDYV.jpg",
        "metadata": null,
        "rank": 0,
        "product_id": "prod_01JXW91RSJZHJTSGMDQT6NSYFE",
        "created_at": "2025-06-16T12:51:12.821Z",
        "updated_at": "2025-06-16T12:51:12.821Z",
        "deleted_at": null
      }
    ],
    "variants": [
      {
        "id": "variant_01JXW91V1YZP7CM1V4P03A60CB",
        "title": "Black / S",
        "sku": "JLS",
        "barcode": null,
        "ean": null,
        "upc": null,
        "allow_backorder": false,
        "manage_inventory": true,
        "variant_rank": 6,
        "product_id": "prod_01JXW91RSJZHJTSGMDQT6NSYFE",
        "created_at": "2025-06-16T11:47:33.055Z",
        "updated_at": "2025-06-16T11:47:33.055Z",
        "deleted_at": null,
        "metadata": {
          "images": [
            {
              "url": "https://bucket-production-d8cb.up.railway.app/medusa-media/815ZaAr-tnL._AC_SX679_-01JXW91QNBKYPV5NXEX9ZM2CV7.jpg"
            }
          ],
          "thumbnail": "https://bucket-production-d8cb.up.railway.app/medusa-media/81TY1oOC8CL._AC_SX679_-01JXW91QNB765A9997HP5NWDYV.jpg"
        },
        "options": [
          {
            "id": "optval_01JXW91RSKQH0GTE63T8TZD5CD",
            "value": "Black",
            "option": {
              "id": "opt_01JXW91RSK216NY0JKMJ2Y5B0G",
              "title": "Color"
            }
          },
          {
            "id": "optval_01JXW91RSK47RE9Y1ENAMBPDKH",
            "value": "S",
            "option": {
              "id": "opt_01JXW91RSMTVRY1R9KMWPWDBZN",
              "title": "Size"
            }
          }
        ],
        "calculated_price": {
          "id": "pset_01JXW91V7WYE0ZWBNWDYR2TJ7G",
          "is_calculated_price_price_list": true,
          "is_calculated_price_tax_inclusive": true,
          "calculated_amount": 80,
          "raw_calculated_amount": {
            "value": "80",
            "precision": 20
          },
          "is_original_price_price_list": false,
          "is_original_price_tax_inclusive": true,
          "original_amount": 100,
          "raw_original_amount": {
            "value": "100",
            "precision": 20
          },
          "currency_code": "egp",
          "calculated_price": {
            "id": "price_01JYGECHWGC9JYMN1ZFJ0VTZRD",
            "price_list_id": "plist_01JYGECHWHEM7MJ9J3GW7FNBJC",
            "price_list_type": "sale",
            "min_quantity": null,
            "max_quantity": null
          },
          "original_price": {
            "id": "price_01JXW91V7WTA5JDBFQZVGHQ9Z5",
            "price_list_id": null,
            "price_list_type": null,
            "min_quantity": null,
            "max_quantity": null
          }
        },
        "inventory_quantity": 100
      }
    ],
    "categories": [
      {
        "id": "pcat_01K478TFW80GF7WVAM7WGSCTEB",
        "name": "concealer",
        "description": "",
        "handle": "concealer",
        "mpath": "pcat_01JW5XVBK6D2QATGYKRJ4A9E1R.pcat_01K478TFW80GF7WVAM7WGSCTEB",
        "is_active": true,
        "is_internal": false,
        "rank": 3,
        "metadata": {
          "thumbnail": "https://bucket-production-d8cb.up.railway.app/medusa-media/SHEGLAMComplexionBoostConcealer_2-01K478VRF03QKSMZDAX3VPM7A0.webp",
          "category_slider_images": [
            {
              "url": "https://bucket-production-d8cb.up.railway.app/medusa-media/3148b553ada2b854f126d248782adb460fad4b42 (1)-01K6Z0FAHXMRGVJJ0X8MQA53C0.png",
              "link": ""
            }
          ],
          "category_slider_images_count": 1
        },
        "parent_category_id": "pcat_01JW5XVBK6D2QATGYKRJ4A9E1R",
        "parent_category": {
          "id": "pcat_01JW5XVBK6D2QATGYKRJ4A9E1R"
        },
        "created_at": "2025-09-03T07:49:21.928Z",
        "updated_at": "2025-10-07T09:36:37.773Z",
        "deleted_at": null
      }
    ],
    "brand": {
      "id": "01JZA0WYGN79QSG3G610PRW7X4",
      "name": "Sheglam",
      "description": "",
      "image": "https://bucket-production-d8cb.up.railway.app/medusa-media/fba405768465fd32838cfde6f333dc85587ef05b-01K6Z68JTCP7XDNTJQP17PC5HX.jpg",
      "created_at": "2025-07-04T06:10:08.021Z",
      "updated_at": "2025-10-07T11:17:48.277Z",
      "deleted_at": null
    },
    "reviews": [
      {
        "id": "review_01JXWDQ262JNBWJNPVETW45YJM",
        "rating": 5,
        "title": "Very cozy",
        "description": "Very warm and cozy",
        "image": "https://avatar.iran.liara.run/public/5",
        "approved_at": "2025-10-20T11:29:17.878Z",
        "response": null,
        "created_at": "2025-06-16T13:09:02.786Z",
        "updated_at": "2025-10-20T11:29:17.883Z",
        "deleted_at": null
      }
    ]
  }
}
```

---

## Product Display Fields

The product page should display the following information:

- **Title**: `product.title`
- **Price**: Use the cheapest variant's price from `variant.calculated_price.calculated_amount`
- **Sale Price**: See [Sale Price](#sale-price) section below
- **Rating**:
  - Each product has a `reviews` field, which is an array of objects
  - Each object has a `rating` field
  - Calculate the average of all ratings
  - If the array is empty (no reviews), don't display the stars
- **تفاصيل المنتج** (Product Details): The options of the selected variant
- **Description**: `product.description`
- **How to use**: `product.metadata.how_to_use`
- **Category**: `product.categories[0]` (a product can be in multiple categories)
- **اسم الموديل** (Model Name): `product.handle`
- **Brand**: `product.brand.name`
- **كود المنتج** (Product Code): `selectedVariant.sku`

> **Note:** There must always be a selected variant by default.

---

## Sale Price

To check if a product variant's price is a sale price:

```javascript
const isSale = variant.calculated_price.calculated_price.price_list_type === "sale";
```

The original variant's price is at:

```javascript
const originalPrice = variant.calculated_price.original_amount;
```

---

## Images

Images should be displayed based on the selected variant:

- **Main variant's image**: `variant.metadata.thumbnail`
- **All other images**: `variant.metadata.images` (array of image objects)
- **Fallback**: If the variant has no images, default to the product's images from `product.images`

---

## Bought Together

### Endpoint

```
GET /store/together/{product_id}
```

Returns an array of products that are most bought with this product.

> **Note:** The array will be empty if the product is never ordered with other items.

---

## Reviews

### Create Review

#### Endpoint

```
POST /store/reviews
```

#### Request Body

```json
{
  "product_id": "prod_01JW3V1795SK9EYH4DVPXX1N1W",
  "customer_id": "cus_01JXW91RSJZHJTSGMDQT6NSYFE",
  "rating": 5,
  "title": "Great product!",
  "description": "Very satisfied with this purchase."
}
```

> **Note:** The customer must be signed in to write a review.

### Get Reviews

Reviews are included in the product response at `product.reviews`, which is an array of review objects with the same fields as above.

You can use the same endpoint from the [Product Overview](#product-overview) section to get reviews along with the product data.

---

## Brand's Products

### Endpoint

```
GET /store/brands/{brandId}
```

Returns all the brand's details along with all the products that belong to it.
