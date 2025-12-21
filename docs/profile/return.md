## Create Returnv2.8.0

Create a return for an order's items. The admin receives the return and process it from their side.

Workflow [createAndCompleteReturnOrderWorkflow](https://docs.medusajs.com/resources/references/medusa-workflows/createAndCompleteReturnOrderWorkflow) is used in this API route.

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

localestringoptional

The locale in BCP 47 format to retrieve localized content.

Related guide: [Learn more in the Serve Translations in Storefront guide.](https://docs.medusajs.com/resources/commerce-modules/translation/storefront)

Request Bodyapplication/json

order_idstring

The ID of the order this return is created for.

---

itemsArray of objects

The return's items.

---

return_shippingobject

The return's shipping details.

option_idstring

The ID of the shipping option to use.

---

pricenumberoptional

The shipping's price.

---

notestringoptional

A note with more details about the return.

---

receive_nowbooleanoptional

Whether to mark the return as received.

---

location_idstringoptional

The ID of the location that items are returned to.

### Responses

200 OKapplication/jsonSuccess

returnobject

The return's details.

400 Client Errorapplication/jsonError401 User is not authorized. Must log in firsttext/plainError404 Not Found Errorapplication/jsonError409 Invalid State Errorapplication/jsonError422 Invalid Request Errorapplication/jsonError500 Server Errorapplication/jsonError

Emitted EventsThe following events are emitted by the workflow used in this API route. You can listen to and handle these events using a [Subscriber](https://docs.medusajs.com/learn/fundamentals/events-and-subscribers)

order.return_requestedorder.return_received

Emitted when a return request is confirmed.

Copy event name

Copy subscriber for event

payloadobject

The payload emitted with the event

order_idstring

The ID of the order

---

return_idstring

The ID of the return

Post`/store/returns`

### Request samples

- cURL

![Ask AI](/api/_next/image?url=%2Fapi%2Fimages%2Fai-assistent-luminosity.png&w=32&q=75)[](https://github.com/medusajs/medusa/issues/new/choose)

    1curl -X POST '{backend_url}/store/returns' \2-H 'x-publishable-api-key: {your_publishable_api_key}' \3-H 'Content-Type: application/json' \4--data-raw '{5  "order_id": "order_123",6  "items": [7    {8      "id": "id_XbfptxUVo2io9EI",9      "quantity": 7916429753974784,10      "reason_id": "{value}",11      "note": "{value}"12    }13  ],14  "return_shipping": {15    "option_id": "{value}",16    "price": 106836408034918417  },18  "note": "{value}",19  "location_id": "{value}"20}'

### Response

200

Content type: application/json

Code

![Ask AI](/api/_next/image?url=%2Fapi%2Fimages%2Fai-assistent-luminosity.png&w=32&q=75)[](https://github.com/medusajs/medusa/issues/new/choose)

    1{2  "return": {3    "items": [4      {5        "id": "string",6        "quantity": 0,7        "received_quantity": 0,8        "damaged_quantity": 0,9        "item_id": "string",10        "return_id": "string"11      }12    ],13    "id": "string",14    "display_id": 0,15    "created_at": "2019-08-24T14:15:22Z",16    "order_id": "string",17    "canceled_at": "string",18    "received_at": "string"19  }20}
