# Category API Documentation

## Configuration

**Base URL:** `https://backend-production-f59a.up.railway.app`

**API Key Header:**

```
x-publishable-api-key: pk_a48bcdbf4f1f8197a35e99cde5374e470989ecd9e34d0b101a0cdbb908c83c3d
```

---

## Best Sellers

### Endpoint

```
GET /store/product-categories/{id}
```

Returns the category details including `best_sellers` tag ID in the metadata.

### Response Example

```json
{
  "product_category": {
    "id": "pcat_01JVS99K9BXAHGD3YGNYHPGBPW",
    "name": "Shirts",
    "description": "",
    "handle": "shirts",
    "rank": 4,
    "parent_category_id": "pcat_01K44NXDAKAJYA1RD5PGZZAQWH",
    "created_at": "2025-05-21T11:22:40.302Z",
    "updated_at": "2025-09-14T13:02:17.955Z",
    "metadata": {
      "thumbnail": "https://bucket-production-d8cb.up.railway.app/medusa-media/81CJvbnmqEL._AC_SX679_-01JYG4CHPGH6D4JV72JACBTHDE.jpg",
      "best_offers": "ptag_01JZAKRN4F6CM8190A9QE9NMHC",
      "best_sellers": "ptag_01JZAKRN4F6CM8190A9QE9NMHC",
      "category_slider_images": [
        {
          "url": "https://bucket-production-d8cb.up.railway.app/medusa-media/81GOzyv48+L._AC_SY879_-01K04ECCDFGY8ANN3A43AR68QH.jpg",
          "link": "https://backend-production-f59a.up.railway.app/app"
        },
        {
          "url": "https://bucket-production-d8cb.up.railway.app/medusa-media/81STtTyXbOL._AC_SY879_-01K04ECCDGM4H2XX7KS9FW16PW.jpg",
          "link": "https://backend-production-f59a.up.railway.app/app"
        },
        {
          "url": "https://bucket-production-d8cb.up.railway.app/medusa-media/81-qvhAfT2L._AC_SY879_-01K04ECCDGYJX1TKQ8JS39PRSF.jpg",
          "link": "https://backend-production-f59a.up.railway.app/app"
        }
      ],
      "category_slider_images_count": 3
    }
  }
}
```

### Get Products by Tag

Use the `best_sellers` tag ID from the category metadata to fetch products:

```
GET /store/products?fields=*variants.calculated_price,*sales&tag_id={best_sellers_tag_id}
```

---

## Category Discounts

### Endpoint

```
GET /store/promotions
```

Returns a list of all promotions with:

- `code`
- `application_method.value`
- `application_method.type` - Either `fixed` or `percentage`

### How to Find Promotions for a Specific Category

1. Get the category ID from the `/store/product-categories` endpoint
2. From the `/store/promotions` endpoint, filter all promotions that:
   - Have `application_method.target_rules[].attribute` that includes the word "categories"
   - Have `application_method.target_rules[].values[].value` equal to the category ID from step 1

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
        "target_rules": [
          {
            "id": "prorul_01KBJ1A1Y3Q2SXGKB7TDQ5ZN9A",
            "description": null,
            "attribute": "items.product.categories.id",
            "operator": "eq",
            "created_at": "2025-12-03T11:59:34.852Z",
            "updated_at": "2025-12-03T11:59:34.852Z",
            "deleted_at": null,
            "values": [
              {
                "value": "pcat_01JVS99K9BXAHGD3YGNYHPGBPW"
              },
              {
                "value": "pcat_01JVS99K9BZWZSCE7NC4X62QKV"
              },
              {
                "value": "pcat_01JVS99K9C0NBRB6T61490ABRC"
              }
            ]
          }
        ],
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

## Products & Filters

### Endpoint

```
GET /store/products?fields=*brand,*variants.calculated_price,+variants.inventory_quantity,*supplier,*categories,*collection.metadata,*reviews,*reviews.customer,*sales
```

Returns all products. Each product includes its category, brand, variants, and other related data.

### Example Request

```
GET https://backend-production-f59a.up.railway.app/store/products?fields=*brand,*variants.calculated_price,+variants.inventory_quantity,*supplier,*categories,*collection.metadata,*reviews,*reviews.customer,*sales
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
        },
        {
          "id": "ptag_01JZ9ZGMN9PRYS3J6FFS26PCCT",
          "value": "new-arrival",
          "metadata": null,
          "created_at": "2025-07-04T05:45:56.138Z",
          "updated_at": "2025-07-04T05:45:56.138Z",
          "deleted_at": null
        },
        {
          "id": "ptag_01JZ9ZMGXQ1420E3NAQETQ3BKG",
          "value": "all-you-want",
          "metadata": {
            "thumbnail": "https://bucket-production-d8cb.up.railway.app/medusa-media/16768839216415d981fd23866839aa9f7ee64ad601_thumbnail_900x_1-01K6YXJKWYQVWSPJVHH8XYAR0N.webp"
          },
          "created_at": "2025-07-04T05:48:03.383Z",
          "updated_at": "2025-10-07T08:45:59.879Z",
          "deleted_at": null
        },
        {
          "id": "ptag_01JZ9ZKJ6V0ZZQ5MH33CKAC089",
          "value": "new-year",
          "metadata": {
            "thumbnail": "https://bucket-production-d8cb.up.railway.app/medusa-media/5cbd5fccafbaeeb4a13ca332a7253d8a51c0521d-01K6YZZG5Q8RGM4JPJTM362QKJ.png"
          },
          "created_at": "2025-07-04T05:47:31.931Z",
          "updated_at": "2025-10-07T09:27:59.227Z",
          "deleted_at": null
        },
        {
          "id": "ptag_01JZ9ZN14P02W5FPMGRB33ZKDV",
          "value": "recommended",
          "metadata": {
            "thumbnail": "https://bucket-production-d8cb.up.railway.app/medusa-media/16768839216415d981fd23866839aa9f7ee64ad601_thumbnail_900x_1-01K6YXHND1CRK9SZX9R2QTK4G4.webp"
          },
          "created_at": "2025-07-04T05:48:19.990Z",
          "updated_at": "2025-10-07T08:45:28.708Z",
          "deleted_at": null
        },
        {
          "id": "ptag_01JZ9ZNQKKPAHJ2FKNBM5A493E",
          "value": "flash-sale",
          "metadata": {
            "thumbnail": "https://bucket-production-d8cb.up.railway.app/medusa-media/SHEGLAMLipDazzlerGlitterKit_3-01K6YXG7CKSQTFFEPY2BPYY8BR.webp"
          },
          "created_at": "2025-07-04T05:48:42.995Z",
          "updated_at": "2025-10-07T08:44:41.590Z",
          "deleted_at": null
        },
        {
          "id": "ptag_01JZAKRN4F6CM8190A9QE9NMHC",
          "value": "makeup-best-seller",
          "metadata": {
            "thumbnail": "https://bucket-production-d8cb.up.railway.app/medusa-media/SHEGLAMLipDazzlerGlitterKit_3-01K6YWMQV7TPQ2PB4RQ07HYXRH.webp"
          },
          "created_at": "2025-07-04T11:39:50.287Z",
          "updated_at": "2025-10-07T08:29:40.879Z",
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
      "categories": [
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
          "parent_category": {
            "id": "pcat_01K44NXDAKAJYA1RD5PGZZAQWH",
            "name": "Men Clothes",
            "description": "",
            "handle": "men-clothes",
            "mpath": "pcat_01K44NXDAKAJYA1RD5PGZZAQWH",
            "is_active": true,
            "is_internal": false,
            "rank": 4,
            "metadata": {
              "category_slider_images": [
                {
                  "url": "https://bucket-production-d8cb.up.railway.app/medusa-media/3148b553ada2b854f126d248782adb460fad4b42 (1)-01K6Z0JA3EQTM2VE79QW6A57BQ.png",
                  "link": ""
                }
              ],
              "category_slider_images_count": 1
            },
            "parent_category_id": null,
            "created_at": "2025-09-02T07:40:25.811Z",
            "updated_at": "2025-10-07T09:38:15.583Z",
            "deleted_at": null
          },
          "created_at": "2025-05-21T11:22:40.303Z",
          "updated_at": "2025-10-07T09:39:36.144Z",
          "deleted_at": null
        },
        {
          "id": "pcat_01K0P4RN4BHRHS98NZP9M4V4D3",
          "name": "lip stick",
          "description": "",
          "handle": "lip-stick",
          "mpath": "pcat_01JW5XVBK6D2QATGYKRJ4A9E1R.pcat_01K0P4RN4BHRHS98NZP9M4V4D3",
          "is_active": true,
          "is_internal": false,
          "rank": 1,
          "metadata": {
            "thumbnail": "https://bucket-production-d8cb.up.railway.app/medusa-media/SHEGLAMPeelTalkLipTint_3-01K477KTRQ6WQA65CD4Q6458E2.webp",
            "category_slider_images": [
              {
                "url": "https://bucket-production-d8cb.up.railway.app/medusa-media/3148b553ada2b854f126d248782adb460fad4b42 (1)-01K6Z0CF9TXV7VTMXMZ5PADN28.png",
                "link": ""
              }
            ],
            "category_slider_images_count": 1
          },
          "parent_category_id": "pcat_01JW5XVBK6D2QATGYKRJ4A9E1R",
          "parent_category": {
            "id": "pcat_01JW5XVBK6D2QATGYKRJ4A9E1R",
            "name": "Makeup",
            "description": "",
            "handle": "makeup",
            "mpath": "pcat_01JW5XVBK6D2QATGYKRJ4A9E1R",
            "is_active": true,
            "is_internal": false,
            "rank": 6,
            "metadata": {
              "thumbnail": "https://bucket-production-d8cb.up.railway.app/medusa-media/MKT-1124-13-AC-26-2_2050x-01JYG4EBTTJPVBC5H6ET5A0EE7.webp",
              "category_slider_images": [
                {
                  "url": "https://bucket-production-d8cb.up.railway.app/medusa-media/3148b553ada2b854f126d248782adb460fad4b42 (1)-01K6Z09VJ51QQ6K2G0EYSEHY6E.png",
                  "link": ""
                },
                {
                  "url": "https://bucket-production-d8cb.up.railway.app/medusa-media/ad327eedc59c1c12dc53c7f3677d4b6569c79925-01K6Z09VJ58HCHSE2X88PXJHKW.png",
                  "link": ""
                }
              ],
              "category_slider_images_count": 2
            },
            "parent_category_id": null,
            "created_at": "2025-05-26T09:12:46.951Z",
            "updated_at": "2025-10-07T09:33:38.583Z",
            "deleted_at": null
          },
          "created_at": "2025-07-21T09:24:16.651Z",
          "updated_at": "2025-10-07T09:35:04.338Z",
          "deleted_at": null
        },
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
            "id": "pcat_01JW5XVBK6D2QATGYKRJ4A9E1R",
            "name": "Makeup",
            "description": "",
            "handle": "makeup",
            "mpath": "pcat_01JW5XVBK6D2QATGYKRJ4A9E1R",
            "is_active": true,
            "is_internal": false,
            "rank": 6,
            "metadata": {
              "thumbnail": "https://bucket-production-d8cb.up.railway.app/medusa-media/MKT-1124-13-AC-26-2_2050x-01JYG4EBTTJPVBC5H6ET5A0EE7.webp",
              "category_slider_images": [
                {
                  "url": "https://bucket-production-d8cb.up.railway.app/medusa-media/3148b553ada2b854f126d248782adb460fad4b42 (1)-01K6Z09VJ51QQ6K2G0EYSEHY6E.png",
                  "link": ""
                },
                {
                  "url": "https://bucket-production-d8cb.up.railway.app/medusa-media/ad327eedc59c1c12dc53c7f3677d4b6569c79925-01K6Z09VJ58HCHSE2X88PXJHKW.png",
                  "link": ""
                }
              ],
              "category_slider_images_count": 2
            },
            "parent_category_id": null,
            "created_at": "2025-05-26T09:12:46.951Z",
            "updated_at": "2025-10-07T09:33:38.583Z",
            "deleted_at": null
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
      "reviews": [],
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

## Common Endpoints

### Get Category Details

```
GET /store/product-categories/{id}
```

### Get All Categories

```
GET /store/product-categories
```

### Get Products by Category

```
GET /store/products?category_id={category_id}&fields=*brand,*variants.calculated_price,+variants.inventory_quantity,*supplier,*categories,*collection.metadata,*reviews,*reviews.customer,*sales
```
