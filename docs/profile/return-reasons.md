## List Return Reasons

Retrieve a list of return reasons. The return reasons can be sorted or paginated.

Did this API Route run successfully?

It was helpfulIt wasn't helpfulReport Issue[](https://github.com/medusajs/medusa/issues/new/choose)

### Header Parameters

x-publishable-api-keystring

Publishable API Key created in the Medusa Admin.

Related guide: [Read More](https://docs.medusajs.com/api/store#publishable-api-key)

---

Content-Languagestringoptional

The locale in BCP 47 format to retrieve localized content.

Related guide: [Learn more in the Serve Translations in Storefront guide.](https://docs.medusajs.com/resources/commerce-modules/translation/storefront)

### Query Parameters

fieldsstringoptional

Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default fields. without prefix it will replace the entire default fields.

Related guide: [Read More](#select-fields-and-relations)

---

offsetnumberoptional

The number of items to skip when retrieving a list.

Related guide: [Read More](#pagination)

---

limitnumberoptional

Limit the number of items returned in the list.

Related guide: [Read More](#pagination)

---

orderstringoptional

The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.

---

with_deletedbooleanoptional

Whether to include deleted records in the result.

---

localestringoptional

The locale in BCP 47 format to retrieve localized content.

Related guide: [Learn more in the Serve Translations in Storefront guide.](https://docs.medusajs.com/resources/commerce-modules/translation/storefront)

### Responses

200 OKapplication/jsonSuccess

limitnumber

The maximum number of items returned.

---

offsetnumber

The number of items skipped before retrieving the returned items.

---

countnumber

The total number of items.

---

return_reasonsArray of objects

The list of return reasons.

400 Client Errorapplication/jsonError401 User is not authorized. Must log in firsttext/plainError404 Not Found Errorapplication/jsonError409 Invalid State Errorapplication/jsonError422 Invalid Request Errorapplication/jsonError500 Server Errorapplication/jsonError

Get`/store/return-reasons`

### Request samples

- cURL

![Ask AI](/api/_next/image?url=%2Fapi%2Fimages%2Fai-assistent-luminosity.png&w=32&q=75)[](https://github.com/medusajs/medusa/issues/new/choose)

    1curl '{backend_url}/store/return-reasons' \2-H 'x-publishable-api-key: {your_publishable_api_key}'

### Response

200

Content type: application/json

Code

![Ask AI](/api/_next/image?url=%2Fapi%2Fimages%2Fai-assistent-luminosity.png&w=32&q=75)[](https://github.com/medusajs/medusa/issues/new/choose)

    1{2  "limit": 0,3  "offset": 0,4  "count": 0,5  "return_reasons": [6    {7      "id": "string",8      "value": "string",9      "label": "string",10      "created_at": "2019-08-24T14:15:22Z",11      "updated_at": "2019-08-24T14:15:22Z"12    }13  ]14}
