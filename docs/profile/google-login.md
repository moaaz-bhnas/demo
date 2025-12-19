[Documentation](https://docs.medusajs.com)[Storefront Development](/resources/storefront-development){ "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": \[ { "@type": "ListItem", "position": 1, "name": "Documentation", "item": "https://docs.medusajs.com" }, { "@type": "ListItem", "position": 2, "name": "Storefront Development", "item": "https://docs.medusajs.com/resources/storefront-development" } \] }

# Third-Party or Social Login in Storefront

In this guide, you'll learn how to implement third-party or social login in your storefront. You'll implement the flow using Google as an example.

## Summary[#](#summary)

By following the steps in this guide, you'll learn how to:

- Create a login page with a button that starts the third-party login process. This redirects customers to the third-party service for authentication.
- Create a callback page that the third-party service redirects to after authentication. This page receives query parameters from the third-party service and uses them to validate the authentication in Medusa.

These are the pages you need in your storefront to allow customers to log in or create an account using a third-party service.

![Diagram with a summary of the third-party login flow in the storefront.](https://res.cloudinary.com/dza7lstvk/image/upload/fl_lossy/f_auto/r_16/ar_16:9,c_pad/third-party-storefront-summary_z1h5hx.jpg?_a=DATAalTIZAA0)

Prerequisites3

[Google OAuth credentials configured. This is required for using the Google Auth Module Provider.](#)[Install the Google Auth Module Provider in your Medusa application, or the provider you're using.↗](/resources/commerce-modules/auth/auth-providers/google)[JS SDK installed and configured in your storefront, with the authentication method you're using (JWT or session) configured.↗](/resources/storefront-development/customers/login#login-customer-methods)

## Step 1: Login Button in Storefront[#](#step-1-login-button-in-storefront)

In your storefront, you'll have a login page with different login options. One of those options will be a button that starts the third-party login process. For example, a "Login with Google" button.

When the customer clicks the "Login with Google" button, send a request to the [Authenticate Customer API route](https://docs.medusajs.com/api/store#auth_postactor_typeauth_provider). This returns the URL to redirect the customer to Google for authentication.

For example:

Tip: Learn how to install and configure the JS SDK in the [JS SDK documentation](/resources/js-sdk).

- React
- JS SDK

![Ask AI](/resources/_next/image?url=%2Fresources%2Fimages%2Fai-assistent-luminosity.png&w=32&q=75)[](https://github.com/medusajs/medusa/issues/new/choose)

    1"use client" // include with Next.js 13+2
    3import { sdk } from "@/lib/sdk"4
    5export default function Login() {6  const loginWithGoogle = async () => {7    const result = await sdk.auth.login("customer", "google", {})8
    9    if (typeof result === "object" && result.location) {10      // redirect to Google for authentication11      window.location.href = result.location12
    13      return14    }15    16    if (typeof result !== "string") {17      // result failed, show an error18      alert("Authentication failed")19      return20    }21
    22    // Customer was previously authenticated, and its token is now stored in the JS SDK.23    // all subsequent requests are authenticated24    const { customer } = await sdk.store.customer.retrieve()25
    26    console.log(customer)27  }28
    29  return (30    <div>31      <button onClick={loginWithGoogle}>Login with Google</button>32    </div>33  )34}

You define a `loginWithGoogle` function that:

- Sends a request to the `/auth/customer/google` API route using the JS SDK's `auth.login` method.

  - If you're using a provider other than Google, replace `google` in the `login` method with your provider ID.

- If the response is an object with a `location` property, redirect to the returned page for authentication with the third-party service.
- If the response is not an object or a string, the authentication has failed.
- If the response is a string, it's the customer's authentication token. This means the customer has been authenticated before.

  - All subsequent requests by the JS SDK are now authenticated. As an example, you can retrieve the customer's details using the `store.customer.retrieve` method.

Tip: The JS SDK sets and passes authentication headers or session cookies automatically based on your [configured authentication method](/resources/js-sdk/auth/overview). If you're not using the JS SDK, make sure to pass the necessary headers in your request as explained in the [API reference](https://docs.medusajs.com/api/store#authentication).

---

## Step 2: Callback Page in Storefront[#](#step-2-callback-page-in-storefront)

After the customer clicks the "Login with Google" button, they're redirected to Google to authenticate. Once they authenticate with Google, they're redirected back to your storefront to the callback page. You set this page's URL in Google's OAuth credentials configurations.

![Google OAuth credentials settings showing the Redirect URI field](https://res.cloudinary.com/dza7lstvk/image/upload/fl_lossy/f_auto/r_16/ar_16:9,c_pad/CleanShot_2025-09-17_at_13.55.18_2x_baalfu.png?_a=DATAalTIZAA0)

In this step, you'll create the callback page that handles the response from Google and creates or retrieves the customer account. You'll implement the page step-by-step to explain the different parts of the flow. You can copy the full page code from the [Full Code Example for Third-Party Login Callback Page](#full-code-example-for-third-party-login-callback-page) section.

### a. Install the React-JWT Library[#](#a-install-the-react-jwt-library)

First, install the [react-jwt library](https://www.npmjs.com/package/react-jwt) in your storefront:

- npm
- yarn
- pnpm

![Ask AI](/resources/_next/image?url=%2Fresources%2Fimages%2Fai-assistent-luminosity.png&w=32&q=75)[](https://github.com/medusajs/medusa/issues/new/choose)

    ❯pnpm add react-jwt

You'll use it to decode the token that Medusa returns after validating the authentication callback.

### b. Implement the Callback Page[#](#b-implement-the-callback-page)

Then, create a new page in your storefront that will be used as the callback/redirect URI destination:

- React
- JS SDK

![Ask AI](/resources/_next/image?url=%2Fresources%2Fimages%2Fai-assistent-luminosity.png&w=32&q=75)[](https://github.com/medusajs/medusa/issues/new/choose)

    1"use client" // include with Next.js 13+2
    3import { HttpTypes } from "@medusajs/types"4import { useEffect, useMemo, useState } from "react"5import { decodeToken } from "react-jwt"6import { sdk } from "@/lib/sdk"7
    8export default function GoogleCallback() {9  const [loading, setLoading] = useState(true)10  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer>()11  // for other than Next.js12  const queryParams = useMemo(() => {13    const searchParams = new URLSearchParams(window.location.search)14    return Object.fromEntries(searchParams.entries())15  }, [])16
    17  const sendCallback = async () => {18    let token = ""19
    20    try {21      token = await sdk.auth.callback(22        "customer", 23        "google", 24        // pass all query parameters received from the25        // third party provider26        queryParams27      )28    } catch (error) {29      alert("Authentication Failed")30      31      throw error32    }33
    34    return token35  }36
    37  // TODO add more functions38
    39  return (40    <div>41      {loading && <span>Loading...</span>}42      {customer && <span>Created customer {customer.email} with Google.</span>}43    </div>44  )45}

You add a new page. In the page's component, you define the `sendCallback` function that sends a request to the [Validate Callback API route](https://docs.medusajs.com/api/store#auth_postactor_typeauth_providercallback), passing it all query parameters received from Google. These include the `code` and `state` parameters.

Tip: The JS SDK stores the JWT token returned by the Validate Callback API route automatically. It attaches this token to subsequent requests. If you're building this authentication flow without the JS SDK, you need to pass it manually to the next requests.

### c. Create Customer Function[#](#c-create-customer-function)

Next, you'll add to the page a function that creates a customer. You'll use this function if the customer is authenticating with the third-party service for the first time.

Replace the `TODO` after the `sendCallback` function with the following:

JS SDK / React Applicable

![Ask AI](/resources/_next/image?url=%2Fresources%2Fimages%2Fai-assistent-luminosity.png&w=32&q=75)[](https://github.com/medusajs/medusa/issues/new/choose)

    1const createCustomer = async (email: string) => {2  // create customer3  await sdk.store.customer.create({4    email,5  })6}7
    8// TODO add more functions...

You add the function `createCustomer` which creates a customer when this is the first time the customer is authenticating with the third-party service.

Tip: This method assumes that the token received from the [Validate Callback API route](https://docs.medusajs.com/api/store#auth_postactor_typeauth_providercallback) is already set in the JS SDK. So, if you're implementing this flow without using the JS SDK, make sure to pass the token received from the [Validate Callback API route](https://docs.medusajs.com/api/store#auth_postactor_typeauth_providercallback) in the [authorization Bearer header](https://docs.medusajs.com/api/store#authentication).

### d. Refresh Token Function[#](#d-refresh-token-function)

Next, you'll add to the page a function that refreshes the authentication token after creating the customer. This is necessary to ensure that the token includes the created customer's details.

Replace the new `TODO` with the following:

JS SDK / React Applicable

![Ask AI](/resources/_next/image?url=%2Fresources%2Fimages%2Fai-assistent-luminosity.png&w=32&q=75)[](https://github.com/medusajs/medusa/issues/new/choose)

    1const refreshToken = async () => {2  // refresh the token3  const result = await sdk.auth.refresh()4}5
    6// TODO add more functions...

You add the function `refreshToken` that sends a request to the [Refresh Token API route](https://docs.medusajs.com/api/store#auth_postadminauthtokenrefresh) to retrieve a new token for the created customer.

The `refreshToken` method also updates the token stored by the JS SDK, ensuring that subsequent requests use that token.

Tip: This method assumes that the token received from the [Validate Callback API route](https://docs.medusajs.com/api/store#auth_postactor_typeauth_providercallback) is already set in the JS SDK. So, if you're implementing this flow without using the JS SDK, make sure to pass the token in the [authorization Bearer header](https://docs.medusajs.com/api/store#authentication). Make sure to also update the token stored in your application after refreshing it.

### e. Validate Callback Function[#](#e-validate-callback-function)

Finally, you'll add to the page a function that validates the authentication callback in Medusa and creates or retrieves the customer account. It will use the functions added earlier.

Add in the place of the new `TODO` the `validateCallback` function that runs when the page first loads to validate the authentication:

Code

![Ask AI](/resources/_next/image?url=%2Fresources%2Fimages%2Fai-assistent-luminosity.png&w=32&q=75)[](https://github.com/medusajs/medusa/issues/new/choose)

    1const validateCallback = async () => {2  const token = await sendCallback()3
    4  const decodedToken = decodeToken(token) as { actor_id: string, user_metadata: Record<string, unknown> }5
    6  const shouldCreateCustomer = decodedToken.actor_id === ""7
    8  if (shouldCreateCustomer) {9    await createCustomer(decodedToken.user_metadata.email as string)10
    11    await refreshToken()12  }13
    14  // use token to send authenticated requests15  const { customer: customerData } =  await sdk.store.customer.retrieve()16
    17  setCustomer(customerData)18  setLoading(false)19}20
    21// TODO run validateCallback when the page loads

The `validateCallback` function uses the functions added earlier to implement the following flow:

1.  Send a request to the [Validate Callback API route](https://docs.medusajs.com/api/store#auth_postactor_typeauth_providercallback). This returns an authentication token.

    - The `sendCallback` function also sets the token in the JS SDK. This passes the token in subsequent requests.

2.  Decode the token to check if it has an `actor_id` property.

- If the property exists, the customer is already registered. The authentication token can be used for subsequent authenticated requests.
- If the property doesn't exist, this is the first time the customer is authenticating with the third-party service. So:

  1.  Create a customer. The `user_metadata` in the decoded token will hold the customer's information in the third-party provider, such as their `email`. You can use this value as the customer's email in Medusa.
  2.  Refetch the customer's authentication token.
  3.  Use the token for subsequent authenticated requests.

3.  Retrieve the customer's details as an example of testing authentication.

### f. Run the Callback Validation on Page Load[#](#f-run-the-callback-validation-on-page-load)

Finally, you need to run the `validateCallback` function when the page first loads. In React, you can do that using the `useEffect` hook.

For example, replace the last `TODO` with the following:

Code

![Ask AI](/resources/_next/image?url=%2Fresources%2Fimages%2Fai-assistent-luminosity.png&w=32&q=75)[](https://github.com/medusajs/medusa/issues/new/choose)

    1useEffect(() => {2  if (!loading) {3    return4  }5
    6  validateCallback()7}, [loading])

This runs the `validateCallback` function when the page first loads. If the validation is successful, the customer is authenticated.

You can show a success message or redirect the customer to another page. For example, use another `useEffect` hook to redirect the customer to the homepage after successful authentication:

Code

![Ask AI](/resources/_next/image?url=%2Fresources%2Fimages%2Fai-assistent-luminosity.png&w=32&q=75)[](https://github.com/medusajs/medusa/issues/new/choose)

    1useEffect(() => {2  if (!customer) {3    return4  }5
    6  // redirect to homepage after successful authentication7  window.location.href = "/"8}, [customer])

### Full Code Example for Third-Party Login Callback Page[#](#full-code-example-for-third-party-login-callback-page)

- React
- JS SDK

![Ask AI](/resources/_next/image?url=%2Fresources%2Fimages%2Fai-assistent-luminosity.png&w=32&q=75)[](https://github.com/medusajs/medusa/issues/new/choose)

    1"use client" // include with Next.js 13+2
    3import { HttpTypes } from "@medusajs/types"4import { useEffect, useMemo, useState } from "react"5import { decodeToken } from "react-jwt"6import { sdk } from "@/lib/sdk"7
    8export default function GoogleCallback() {9  const [loading, setLoading] = useState(true)10  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer>()11  // for other than Next.js12  const queryParams = useMemo(() => {13    const searchParams = new URLSearchParams(window.location.search)14    return Object.fromEntries(searchParams.entries())15  }, [])16
    17  const sendCallback = async () => {18    let token = ""19
    20    try {21      token = await sdk.auth.callback(22        "customer", 23        "google", 24        // pass all query parameters received from the25        // third party provider26        queryParams27      )28    } catch (error) {29      alert("Authentication Failed")30      31      throw error32    }33
    34    return token35  }36
    37  const createCustomer = async () => {38    // create customer39    await sdk.store.customer.create({40      email: "example@medusajs.com",41    })42  }43
    44  const refreshToken = async () => {45    // refresh the token46    const result = await sdk.auth.refresh()47  }48
    49  const validateCallback = async () => {50    const token = await sendCallback()51
    52    const decodedToken = decodeToken(token) as { actor_id: string, user_metadata: Record<string, unknown> }53
    54    const shouldCreateCustomer = decodedToken.actor_id === ""55
    56    if (shouldCreateCustomer) {57      await createCustomer(decodedToken.user_metadata.email as string)58
    59      await refreshToken()60    }61
    62    // use token to send authenticated requests63    const { customer: customerData } =  await sdk.store.customer.retrieve()64
    65    setCustomer(customerData)66    setLoading(false)67  }68
    69  useEffect(() => {70    if (!loading) {71      return72    }73
    74    validateCallback()75  }, [loading])76
    77  useEffect(() => {78    if (!customer) {79      return80    }81
    82    // TODO redirect to homepage after successful authentication83  }, [customer])84
    85  return (86    <div>87      {loading && <span>Loading...</span>}88      {customer && <span>Created customer {customer.email} with Google.</span>}89    </div>90  )91}

---

## Deep Dive: Third-Party Login Flow in Storefront[#](#deep-dive-third-party-login-flow-in-storefront)

In this section, you'll find a general overview of the third-party login flow in the storefront. This is useful if you're not using the JS SDK or want to understand the flow better.

If you already set up the [Auth Module Provider](/resources/commerce-modules/auth/auth-providers) in your Medusa application, you can log in a customer with a third-party service, such as Google or GitHub, using the following flow:

![Diagram illustrating the authentication flow between the storefront, Medusa application, and the third-party service.](https://res.cloudinary.com/dza7lstvk/image/upload/fl_lossy/f_auto/r_16/ar_16:9,c_pad/v1/Medusa%20Resources/Social_Media_Graphics_third-party-auth-customer_kfn3k3.jpg?_a=DATAalTIZAA0)

1.  Authenticate the customer with the [Authenticate Customer API route](https://docs.medusajs.com/api/store#auth_postactor_typeauth_provider). It may return:

    - A URL in a `location` property to authenticate with a third-party service, such as Google. When you receive this property, redirect to the returned location.
    - A token in a `token` property. In this case, the customer was previously logged in with the third-party service. No additional actions are required. You can use the token to send subsequent authenticated requests.

2.  Once authentication with the third-party service finishes, it redirects back to the storefront with query parameters such as `code` and `state`. Make sure your third-party service is configured to redirect to your storefront's callback page after successful authentication.
3.  In the storefront's callback page, send a request to the [Validate Authentication Callback API route](https://docs.medusajs.com/api/store#auth_postactor_typeauth_providercallback). Pass the query parameters (`code`, `state`, etc.) received from the third-party service.

    - Medusa validates the authentication with the third-party service.

4.  If the callback validation is successful, you'll receive the authentication token. Decode the received token in the storefront using tools like [react-jwt](https://www.npmjs.com/package/react-jwt).

    - If the decoded data has an `actor_id` property, the customer is already registered. Use this token for subsequent authenticated requests.
    - If not, follow the rest of the steps.

5.  The customer is not registered yet. Use the received token from the Validate Authentication Callback API route to create the customer using the [Create Customer API route](https://docs.medusajs.com/api/store#customers_postcustomers).
6.  Send a request to the [Refresh Token Route](https://docs.medusajs.com/api/store#auth_postadminauthtokenrefresh) to retrieve a new token for the customer. Pass the token from the Validate Authentication Callback API in the header.
7.  Use the token for subsequent authenticated requests, such as retrieving the customer's details using the [Retrieve Customer API route](https://docs.medusajs.com/api/store#getactor_typecustomersme).

Was this page helpful?

It was helpfulIt wasn't helpfulReport Issue[](https://github.com/medusajs/medusa/issues/new/choose)

Edited Nov 26·[Edit this page](https://github.com/medusajs/medusa/edit/develop/www/apps/resources/app/storefront-development/customers/third-party-login/page.mdx)

# Actual Endpoints:

- /auth/customer/google
- /auth/customer/google/callback
- /store/customers
- /auth/token/refresh
- /store/customers/me

Note this is my url:
dev: http://localhost:3000
prod: https://demo-umber-five-41.vercel.app/
