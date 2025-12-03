# Shopyneer Store API Documentation

## Configuration

**Base URL:** `https://backend-production-f59a.up.railway.app`

**API Key Header:**

```
x-publishable-api-key: pk_a48bcdbf4f1f8197a35e99cde5374e470989ecd9e34d0b101a0cdbb908c83c3d
```

---

## Free Shipping Threshold

### Endpoint

```
GET /store/free-shipping-threshold
```

### Response

```json
{
  "threshold": "1000"
}
```

> **Note:** If threshold is `null`, it means no admin has set it in the dashboard, and we shouldn't display this bar.

---

## Collections

### Endpoint

```
GET /store/product-tags?fields=value,metadata
```

### Response

```json
{
  "product_tags": [
    {
      "value": "best-sellers",
      "metadata": {
        "thumbnail": "https://bucket-production-d8cb.up.railway.app/medusa-media/f2d084dd18d3a1f075c54b5b28a249a3de03d94f (1)-01K6YZWERARGV7FSZPDNHNAPT4.png"
      },
      "id": "ptag_01JZ9ZF3F17ZJP0CXF1TAE0T61"
    },
    {
      "value": "high-rated",
      "metadata": {
        "thumbnail": "https://bucket-production-d8cb.up.railway.app/medusa-media/0f867a9a3380a1d8a8cba469fe2bed202d1e4c22-01K6YZX6VEVWGW0PG0GAPKV9TT.png"
      },
      "id": "ptag_01JZ9ZFXW4AN4DNY00FZKDTC0K"
    },
    {
      "value": "new-arrival",
      "metadata": null,
      "id": "ptag_01JZ9ZGMN9PRYS3J6FFS26PCCT"
    },
    {
      "value": "new-year",
      "metadata": {
        "thumbnail": "https://bucket-production-d8cb.up.railway.app/medusa-media/5cbd5fccafbaeeb4a13ca332a7253d8a51c0521d-01K6YZZG5Q8RGM4JPJTM362QKJ.png"
      },
      "id": "ptag_01JZ9ZKJ6V0ZZQ5MH33CKAC089"
    },
    {
      "value": "all-you-want",
      "metadata": {
        "thumbnail": "https://bucket-production-d8cb.up.railway.app/medusa-media/16768839216415d981fd23866839aa9f7ee64ad601_thumbnail_900x_1-01K6YXJKWYQVWSPJVHH8XYAR0N.webp"
      },
      "id": "ptag_01JZ9ZMGXQ1420E3NAQETQ3BKG"
    },
    {
      "value": "recommended",
      "metadata": {
        "thumbnail": "https://bucket-production-d8cb.up.railway.app/medusa-media/16768839216415d981fd23866839aa9f7ee64ad601_thumbnail_900x_1-01K6YXHND1CRK9SZX9R2QTK4G4.webp"
      },
      "id": "ptag_01JZ9ZN14P02W5FPMGRB33ZKDV"
    },
    {
      "value": "flash-sale",
      "metadata": {
        "thumbnail": "https://bucket-production-d8cb.up.railway.app/medusa-media/SHEGLAMLipDazzlerGlitterKit_3-01K6YXG7CKSQTFFEPY2BPYY8BR.webp"
      },
      "id": "ptag_01JZ9ZNQKKPAHJ2FKNBM5A493E"
    },
    {
      "value": "makeup-best-seller",
      "metadata": {
        "thumbnail": "https://bucket-production-d8cb.up.railway.app/medusa-media/SHEGLAMLipDazzlerGlitterKit_3-01K6YWMQV7TPQ2PB4RQ07HYXRH.webp"
      },
      "id": "ptag_01JZAKRN4F6CM8190A9QE9NMHC"
    }
  ],
  "count": 8,
  "offset": 0,
  "limit": 50
}
```

> **Note:** If one of the tags is clicked, you can use its ID to fetch products with `/store/products` endpoint.

---

## Tags and Collections

### Endpoints

1. **Get all tags with images:**

   ```
   GET /store/product-tags?fields=value,metadata
   ```

2. **Get store settings (tags boxes):**

   ```
   GET /store/settings
   ```

   This endpoint returns 3 boxes/containers of tags. Each box has a title and tag IDs. You should then get these tag IDs from the previous endpoint to get all the details.

### Response Example

```json
{
  "id": "store_01JVS99JZKF9CCDT6VNVVZGCGY",
  "metadata": {
    "tags_boxes": {
      "box1": {
        "title": "اشتري أكثر وبالك مرتاح",
        "tagIds": [
          "ptag_01JZ9ZF3F17ZJP0CXF1TAE0T61",
          "ptag_01JZ9ZKJ6V0ZZQ5MH33CKAC089",
          "ptag_01JZ9ZN14P02W5FPMGRB33ZKDV",
          "ptag_01JZ9ZMGXQ1420E3NAQETQ3BKG"
        ]
      },
      "box2": {
        "title": "عروض الميجا",
        "tagIds": [
          "ptag_01JZ9ZF3F17ZJP0CXF1TAE0T61",
          "ptag_01JZ9ZKJ6V0ZZQ5MH33CKAC089",
          "ptag_01JZ9ZNQKKPAHJ2FKNBM5A493E",
          "ptag_01JZ9ZMGXQ1420E3NAQETQ3BKG"
        ]
      },
      "box3": {
        "title": "شوف كل الخصومات",
        "tagIds": [
          "ptag_01JZ9ZF3F17ZJP0CXF1TAE0T61",
          "ptag_01JZ9ZNQKKPAHJ2FKNBM5A493E",
          "ptag_01JZ9ZN14P02W5FPMGRB33ZKDV",
          "ptag_01JZ9ZMGXQ1420E3NAQETQ3BKG"
        ]
      }
    },
    "local_tag_id": "",
    "powder_tag_id": "",
    "slider_images": [
      {
        "url": "https://bucket-production-d8cb.up.railway.app/medusa-media/3148b553ada2b854f126d248782adb460fad4b42-01K6YW8SCSJ7CWB98DV7P2N8T5.png",
        "link": ""
      }
    ],
    "winter_tag_id": "",
    "sheglam_tag_id": "",
    "sync_fb_catalog": false,
    "sheglam_brand_id": "01JZA0WYGN79QSG3G610PRW7X4",
    "flash_sale_tag_id": "ptag_01JZ9ZNQKKPAHJ2FKNBM5A493E",
    "high_rated_tag_id": "ptag_01JZ9ZFXW4AN4DNY00FZKDTC0K",
    "best_seller_tag_id": "ptag_01JZ9ZF3F17ZJP0CXF1TAE0T61",
    "new_arrival_tag_id": "ptag_01JZ9ZGMN9PRYS3J6FFS26PCCT",
    "recommended_tag_id": "ptag_01JZ9ZN14P02W5FPMGRB33ZKDV",
    "all_you_want_tag_id": "ptag_01JZ9ZMGXQ1420E3NAQETQ3BKG",
    "make_up_category_id": "pcat_01JW5XVBK6D2QATGYKRJ4A9E1R",
    "slider_images_count": 1,
    "new_year_offers_tag_id": "ptag_01JZ9ZKJ6V0ZZQ5MH33CKAC089",
    "secondary_slider_images": [
      {
        "url": "https://bucket-production-d8cb.up.railway.app/medusa-media/02_11-01K318JWX7ZA2T02K3FAXQ4Q0C.webp",
        "link": ""
      },
      {
        "url": "https://bucket-production-d8cb.up.railway.app/medusa-media/cd3b76dc33e79fc76e8c0fe1311ddb48-01K318JWX7K19DAHRCGKB7WVMH.webp",
        "link": ""
      },
      {
        "url": "https://bucket-production-d8cb.up.railway.app/medusa-media/01-2_1-01K318JWX76JRZYEC3FQZE21Q7.webp",
        "link": ""
      }
    ],
    "beauty_essentials_tag_id": "",
    "makeup_best_seller_tag_id": "ptag_01JZAKRN4F6CM8190A9QE9NMHC",
    "secondary_slider_images_count": 3
  }
}
```

---

## Recommended Products

### Endpoint

```
GET /store/settings
```

Returns `recommended_tag_id` in the metadata.

### Get Products

```
GET /store/products?fields=*variants.calculated_price,*sales&tag_id={recommended_tag_id}
```

### Example Request

```
GET https://backend-production-f59a.up.railway.app/store/products?fields=*variants.calculated_price,*sales&tag_id=ptag_01JZ9ZF3F17ZJP0CXF1TAE0T61
```

### Response Example

```json
{
  "products": [
    {
      "id": "prod_01JW3V1795SK9EYH4DVPXX1N1W",
      "title": "INAWLY Cartoon Graphic Thermal Lined Sweatshirt",
      "subtitle": "",
      "description": "Neckline:Round Neck\nSleeve Type:Drop Shoulder\nHem Shaped:Regular\nPattern Type:Cartoon, Letter\nColor:Mauve Purple\nDetails:Rib-Knit\nStyle:Casual\nType:Pullovers\nOccasion:Beach\nSleeve Length:Long Sleeve\nLength:Regular\nFit Type:Regular Fit\nFabric:Slight Stretch\nMaterial:Fabric\nComposition:100% Polyester",
      "handle": "inawly-cartoon-graphic-thermal-lined-sweatshirt",
      "is_giftcard": false,
      "discountable": true,
      "thumbnail": "https://bucket-production-d8cb.up.railway.app/medusa-media/166979477264f0809c06f704d8203f9815afb9f0a1_thumbnail_720x_c50ecd6b-9391-402e-a58d-837cf291c914-01JW3V16WFDBC4XJAXBHB4YS99.jpg",
      "collection_id": "pcol_01K0P3Z0JSYA6RTV4VV8PWKEJ5",
      "type_id": null,
      "weight": null,
      "length": null,
      "height": null,
      "width": null,
      "hs_code": null,
      "origin_country": null,
      "mid_code": null,
      "material": null,
      "created_at": "2025-05-25T13:45:04.550Z",
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
          "id": "opt_01JW3V1796A1SH4FZBD4C978HP",
          "title": "Default option",
          "metadata": null,
          "product_id": "prod_01JW3V1795SK9EYH4DVPXX1N1W",
          "created_at": "2025-05-25T13:45:04.551Z",
          "updated_at": "2025-05-25T13:45:04.551Z",
          "deleted_at": null,
          "values": [
            {
              "id": "optval_01JW3V1796D022H6G770RA93F9",
              "value": "Default option value",
              "metadata": null,
              "option_id": "opt_01JW3V1796A1SH4FZBD4C978HP",
              "created_at": "2025-05-25T13:45:04.551Z",
              "updated_at": "2025-05-25T13:45:04.551Z",
              "deleted_at": null
            }
          ]
        }
      ],
      "tags": [
        {
          "id": "ptag_01JZ9ZF3F17ZJP0CXF1TAE0T61",
          "value": "best-sellers",
          "metadata": {
            "thumbnail": "https://bucket-production-d8cb.up.railway.app/medusa-media/f2d084dd18d3a1f075c54b5b28a249a3de03d94f (1)-01K6YZWERARGV7FSZPDNHNAPT4.png"
          },
          "created_at": "2025-07-04T05:45:05.762Z",
          "updated_at": "2025-10-07T09:26:19.484Z",
          "deleted_at": null
        }
      ],
      "images": [
        {
          "id": "img_01JW3V1KW2DGY7B8259PD2M6V9",
          "url": "https://bucket-production-d8cb.up.railway.app/medusa-media/166979477264f0809c06f704d8203f9815afb9f0a1_thumbnail_720x_c50ecd6b-9391-402e-a58d-837cf291c914-01JW3V16WFDBC4XJAXBHB4YS99.jpg",
          "metadata": null,
          "rank": 0,
          "product_id": "prod_01JW3V1795SK9EYH4DVPXX1N1W",
          "created_at": "2025-05-25T13:45:17.428Z",
          "updated_at": "2025-05-25T13:45:17.428Z",
          "deleted_at": null
        }
      ],
      "variants": [
        {
          "id": "variant_01JW3V17CPQH7KHW8NNEM5H1VJ",
          "title": "Default variant",
          "sku": null,
          "barcode": null,
          "ean": null,
          "upc": null,
          "allow_backorder": false,
          "manage_inventory": false,
          "hs_code": null,
          "origin_country": null,
          "mid_code": null,
          "material": null,
          "weight": null,
          "length": null,
          "height": null,
          "width": null,
          "metadata": null,
          "variant_rank": 0,
          "product_id": "prod_01JW3V1795SK9EYH4DVPXX1N1W",
          "created_at": "2025-05-25T13:45:04.663Z",
          "updated_at": "2025-05-25T13:45:04.663Z",
          "deleted_at": null,
          "options": [
            {
              "id": "optval_01JW3V1796D022H6G770RA93F9",
              "value": "Default option value",
              "metadata": null,
              "option_id": "opt_01JW3V1796A1SH4FZBD4C978HP",
              "option": {
                "id": "opt_01JW3V1796A1SH4FZBD4C978HP",
                "title": "Default option",
                "metadata": null,
                "product_id": "prod_01JW3V1795SK9EYH4DVPXX1N1W",
                "created_at": "2025-05-25T13:45:04.551Z",
                "updated_at": "2025-05-25T13:45:04.551Z",
                "deleted_at": null
              },
              "created_at": "2025-05-25T13:45:04.551Z",
              "updated_at": "2025-05-25T13:45:04.551Z",
              "deleted_at": null
            }
          ],
          "calculated_price": {
            "id": "pset_01JW3V17DS6S442NJ6W1EG3PWD",
            "is_calculated_price_price_list": false,
            "is_calculated_price_tax_inclusive": true,
            "calculated_amount": 500,
            "raw_calculated_amount": {
              "value": "500",
              "precision": 20
            },
            "is_original_price_price_list": false,
            "is_original_price_tax_inclusive": true,
            "original_amount": 500,
            "raw_original_amount": {
              "value": "500",
              "precision": 20
            },
            "currency_code": "egp",
            "calculated_price": {
              "id": "price_01JW3V17DSGVKVY16ME8E0GWE0",
              "price_list_id": null,
              "price_list_type": null,
              "min_quantity": null,
              "max_quantity": null
            },
            "original_price": {
              "id": "price_01JW3V17DSGVKVY16ME8E0GWE0",
              "price_list_id": null,
              "price_list_type": null,
              "min_quantity": null,
              "max_quantity": null
            }
          }
        }
      ],
      "sales": {
        "id": "b40f4af3-722d-4065-978a-2fd938fae365",
        "sales": 5,
        "created_at": "2025-08-03T07:17:15.296Z",
        "updated_at": "2025-08-03T07:17:15.296Z",
        "deleted_at": null
      }
    }
  ]
}
```

---

## Best Offers

### Endpoint

```
GET /store/settings
```

Returns `best_seller_tag_id` in the metadata.

### Get Products

```
GET /store/products?fields=*variants.calculated_price,*sales&tag_id={best_seller_tag_id}
```

---

## New Arrivals

### Endpoint

```
GET /store/settings
```

Returns `new_arrival_tag_id` in the metadata.

### Get Products

```
GET /store/products?fields=*variants.calculated_price,*sales&tag_id={new_arrival_tag_id}
```

---

## Products on Sale

### Endpoint

```
GET /store/settings
```

Returns `flash_sale_tag_id` and `flash_sale_end_time` in the metadata.

### Get Products

```
GET /store/products?fields=*variants.calculated_price,*sales&tag_id={flash_sale_tag_id}
```

---

## Promotions

### Endpoint

```
GET /store/promotions
```

Returns a list of all promotions with:

- `code`
- `application_method.value`
- `application_method.type` - Either `fixed` or `percentage`

### Response Example

```json
{
  "promotions": [
    {
      "id": "promo_01JXQ109T66P396QA304ECC67T",
      "code": "bassam",
      "is_automatic": false,
      "type": "standard",
      "status": "active",
      "created_at": "2025-06-14T10:50:41.865Z",
      "updated_at": "2025-06-14T10:50:41.865Z",
      "deleted_at": null,
      "campaign_id": null,
      "application_method": {
        "id": "proappmet_01JXQ109T8R5J7KPVNVXS8TCF8",
        "currency_code": "egp",
        "max_quantity": null,
        "apply_to_quantity": null,
        "buy_rules_min_quantity": null,
        "type": "fixed",
        "target_type": "order",
        "allocation": "across",
        "raw_value": {
          "value": "10",
          "precision": 20
        },
        "created_at": "2025-06-14T10:50:41.865Z",
        "updated_at": "2025-06-14T10:50:41.865Z",
        "deleted_at": null,
        "promotion_id": "promo_01JXQ109T66P396QA304ECC67T",
        "target_rules": [],
        "buy_rules": [],
        "value": 10
      },
      "rules": [],
      "campaign": null
    }
  ]
}
```

---

## Sliders

### Endpoint

```
GET /store/sliders/secondary
```

### Response Example

```json
{
  "images": [
    {
      "url": "https://bucket-production-d8cb.up.railway.app/medusa-media/02_11-01K318JWX7ZA2T02K3FAXQ4Q0C.webp",
      "link": ""
    },
    {
      "url": "https://bucket-production-d8cb.up.railway.app/medusa-media/cd3b76dc33e79fc76e8c0fe1311ddb48-01K318JWX7K19DAHRCGKB7WVMH.webp",
      "link": ""
    },
    {
      "url": "https://bucket-production-d8cb.up.railway.app/medusa-media/01-2_1-01K318JWX76JRZYEC3FQZE21Q7.webp",
      "link": ""
    }
  ],
  "count": 3
}
```

---

## Brands

### Endpoint

```
GET /store/brands
```

Returns all brands' details along with all the products that belong to each one.

### Response Example

```json
{
  "brands": [
    {
      "id": "01JWBE3YXD19ATJNXJTAG9QNWH",
      "name": "Shopyneer",
      "description": "testing",
      "image": "https://bucket-production-d8cb.up.railway.app/medusa-media/7055877b9f0647f763f9c0748b531340afc953ed-01K6Z6603ND7C2YRRN7120SBZX.jpg",
      "products": [
        {
          "id": "prod_01KBCCATWXMA86Q6RKNE04WNZ3",
          "title": "منتج1",
          "handle": "jacket",
          "subtitle": "شتوى",
          "description": "منتج جميل",
          "is_giftcard": false,
          "status": "published",
          "thumbnail": null,
          "weight": null,
          "length": null,
          "height": null,
          "width": null,
          "origin_country": null,
          "hs_code": null,
          "mid_code": null,
          "material": "خامه ممتازه اللون جميل ",
          "discountable": true,
          "external_id": null,
          "metadata": null,
          "type_id": null,
          "type": null,
          "collection_id": "pcol_01JYK1FFBTM0GMB28TKHVXJSTN",
          "collection": {
            "id": "pcol_01JYK1FFBTM0GMB28TKHVXJSTN"
          },
          "created_at": "2025-12-01T07:16:48.158Z",
          "updated_at": "2025-12-01T07:16:48.158Z",
          "deleted_at": null
        }
      ]
    },
    {
      "id": "01JWBEZJEKCZB563N6KH4DTE1H",
      "name": "Benisuef Warehouse",
      "description": "testing",
      "image": "https://bucket-production-d8cb.up.railway.app/medusa-media/fba405768465fd32838cfde6f333dc85587ef05b-01K6Z66DJ21ERVJNMV82WK2ZST.jpg",
      "products": []
    }
  ]
}
```

---

## Makeup Subcategories

### Endpoint

```
GET /store/settings
```

Returns `make_up_category_id` in the metadata.

### Get Category Details

```
GET /store/product-categories/{id}
```

Returns the category details with all its subcategories.

### Response Example

```json
{
  "product_category": {
    "id": "pcat_01K44NXDAKAJYA1RD5PGZZAQWH",
    "name": "Men Clothes",
    "description": "",
    "handle": "men-clothes",
    "rank": 4,
    "parent_category_id": null,
    "created_at": "2025-09-02T07:40:25.811Z",
    "updated_at": "2025-10-07T09:38:15.583Z",
    "metadata": {
      "category_slider_images": [
        {
          "url": "https://bucket-production-d8cb.up.railway.app/medusa-media/3148b553ada2b854f126d248782adb460fad4b42 (1)-01K6Z0JA3EQTM2VE79QW6A57BQ.png",
          "link": ""
        }
      ],
      "category_slider_images_count": 1
    },
    "parent_category": null,
    "category_children": [
      {
        "id": "pcat_01JVS99K9BZWZSCE7NC4X62QKV",
        "name": "Sweatshirts",
        "description": "",
        "handle": "sweatshirts",
        "mpath": "pcat_01K44NXDAKAJYA1RD5PGZZAQWH.pcat_01JVS99K9BZWZSCE7NC4X62QKV",
        "is_active": true,
        "is_internal": false,
        "rank": 2,
        "metadata": {
          "thumbnail": "https://bucket-production-d8cb.up.railway.app/medusa-media/MKT-1124-13-AC-26-4_2050x-01JYG4D2KF41MQ7EDS13Z2J46P.webp",
          "category_slider_images": [
            {
              "url": "https://bucket-production-d8cb.up.railway.app/medusa-media/3148b553ada2b854f126d248782adb460fad4b42 (1)-01K6Z0MRS7RJMFDH1EBQEYVRTH.png",
              "link": ""
            }
          ],
          "category_slider_images_count": 1
        },
        "parent_category_id": "pcat_01K44NXDAKAJYA1RD5PGZZAQWH",
        "created_at": "2025-05-21T11:22:40.303Z",
        "updated_at": "2025-10-07T09:39:36.144Z",
        "deleted_at": null
      }
    ]
  }
}
```

---

## Best Sellers in Makeup

### Endpoint

```
GET /store/settings
```

Returns `makeup_best_seller_tag_id` in the metadata.

### Get Products

```
GET /store/products?fields=*variants.calculated_price,*sales&tag_id={makeup_best_seller_tag_id}
```

---

## Sheglam Offers

### Endpoint

```
GET /store/settings
```

Returns `sheglam_brand_id` in the metadata.

### Get Products

```
GET /store/list-products-by-brand?brand_id={sheglam_brand_id}
```

---

## Common Endpoints

### Get Products by Tag

```
GET /store/products?fields=*variants.calculated_price,*sales&tag_id={tag_id}
```

### Get Store Settings

```
GET /store/settings
```

Returns all store configuration including tag IDs, brand IDs, category IDs, and slider images.
