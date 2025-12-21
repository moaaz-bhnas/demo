// Store Settings
export interface StoreSettings {
  id: string;
  metadata: {
    tags_boxes?: {
      box1?: { title: string; tagIds: string[] };
      box2?: { title: string; tagIds: string[] };
      box3?: { title: string; tagIds: string[] };
    };
    slider_images?: { url: string; link: string }[];
    secondary_slider_images?: { url: string; link: string }[];
    flash_sale_tag_id?: string;
    flash_sale_end_time?: string;
    high_rated_tag_id?: string;
    best_seller_tag_id?: string;
    new_arrival_tag_id?: string;
    recommended_tag_id?: string;
    all_you_want_tag_id?: string;
    make_up_category_id?: string;
    makeup_best_seller_tag_id?: string;
    sheglam_brand_id?: string;
  };
}

// Product Tag
export interface ProductTag {
  id: string;
  value: string;
  metadata?: {
    thumbnail?: string;
  } | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Brand
export interface Brand {
  id: string;
  name: string;
  description: string;
  image: string;
  tag_id?: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  products?: Product[];
}

// Category
export interface Category {
  id: string;
  name: string;
  description: string;
  handle: string;
  mpath?: string;
  is_active?: boolean;
  is_internal?: boolean;
  rank: number;
  metadata?: {
    thumbnail?: string;
    best_offers?: string;
    best_sellers?: string;
    category_slider_images?: { url: string; link: string }[];
    category_slider_images_count?: number;
  } | null;
  parent_category_id: string | null;
  parent_category?: Category | null;
  category_children?: Category[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Product Option Value
export interface ProductOptionValue {
  id: string;
  value: string;
  metadata: Record<string, unknown> | null;
  option_id: string;
  option?: ProductOption;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Product Option
export interface ProductOption {
  id: string;
  title: string;
  metadata: Record<string, unknown> | null;
  product_id: string;
  values: ProductOptionValue[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Product Image
export interface ProductImage {
  id: string;
  url: string;
  metadata: Record<string, unknown> | null;
  rank: number;
  product_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Calculated Price
export interface CalculatedPrice {
  id: string;
  is_calculated_price_price_list: boolean;
  is_calculated_price_tax_inclusive: boolean;
  calculated_amount: number;
  raw_calculated_amount: { value: string; precision: number };
  is_original_price_price_list: boolean;
  is_original_price_tax_inclusive: boolean;
  original_amount: number;
  raw_original_amount: { value: string; precision: number };
  currency_code: string;
  calculated_price: {
    id: string;
    price_list_id: string | null;
    price_list_type: string | null;
    min_quantity: number | null;
    max_quantity: number | null;
  };
  original_price: {
    id: string;
    price_list_id: string | null;
    price_list_type: string | null;
    min_quantity: number | null;
    max_quantity: number | null;
  };
}

// Product Variant
export interface ProductVariant {
  id: string;
  title: string;
  sku: string | null;
  barcode: string | null;
  ean: string | null;
  upc: string | null;
  allow_backorder: boolean;
  manage_inventory: boolean;
  hs_code: string | null;
  origin_country: string | null;
  mid_code: string | null;
  material: string | null;
  weight: string | null;
  length: string | null;
  height: string | null;
  width: string | null;
  metadata?: {
    images?: { url: string }[];
    thumbnail?: string;
  } | null;
  variant_rank: number;
  product_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  options: ProductOptionValue[];
  calculated_price: CalculatedPrice;
  inventory_quantity?: number;
}

// Review
export interface Review {
  id: string;
  rating: number;
  title: string;
  description: string;
  image?: string | null;
  approved_at: string | null;
  response: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  customer?: {
    id: string;
    first_name?: string;
    last_name?: string;
  };
}

// Collection
export interface Collection {
  id: string;
  title: string;
  handle: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Sales
export interface ProductSales {
  id: string;
  sales: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Product
export interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  handle: string;
  is_giftcard: boolean;
  discountable: boolean;
  thumbnail: string | null;
  collection_id: string | null;
  type_id: string | null;
  weight: string | null;
  length: string | null;
  height: string | null;
  width: string | null;
  hs_code: string | null;
  origin_country: string | null;
  mid_code: string | null;
  material: string | null;
  metadata?: {
    how_to_use?: string;
  } | null;
  created_at: string;
  updated_at: string;
  type: unknown | null;
  collection?: Collection | null;
  options: ProductOption[];
  tags: ProductTag[];
  images: ProductImage[];
  variants: ProductVariant[];
  categories?: Category[];
  brand?: Brand | null;
  reviews?: Review[];
  sales?: ProductSales | null;
}

// Cart Item
export interface CartItem {
  id: string;
  title: string;
  subtitle: string;
  thumbnail: string | null;
  quantity: number;
  unit_price: number;
  total: number;
  subtotal: number;
  variant_id: string;
  product_id: string;
  adjustments?: { amount: number; code: string }[];
}

// Address
export interface Address {
  id?: string;
  customer_id?: string | null;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string | null;
  company?: string | null;
  postal_code?: string | null;
  city: string;
  country_code: string;
  province?: string | null;
  phone: string;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

// Shipping Method Detail
export interface ShippingMethodDetail {
  id: string;
  version: number;
  order_id: string;
  return_id: string | null;
  exchange_id: string | null;
  claim_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  shipping_method_id: string;
}

// Shipping Method
export interface ShippingMethod {
  id: string;
  name: string;
  description: string | null;
  is_tax_inclusive: boolean;
  is_custom_amount: boolean;
  shipping_option_id: string;
  data: Record<string, unknown>;
  metadata: Record<string, unknown> | null;
  raw_amount: {
    value: string;
    precision: number;
  };
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  tax_lines: unknown[];
  adjustments: unknown[];
  amount: number;
  order_id: string;
  detail: ShippingMethodDetail;
  subtotal: number;
  total: number;
  original_subtotal: number;
  original_total: number;
  discount_total: number;
  discount_subtotal: number;
  discount_tax_total: number;
  tax_total: number;
  original_tax_total: number;
  raw_subtotal: {
    value: string;
    precision: number;
  };
  raw_total: {
    value: string;
    precision: number;
  };
  raw_original_subtotal: {
    value: string;
    precision: number;
  };
  raw_original_total: {
    value: string;
    precision: number;
  };
  raw_discount_total: {
    value: string;
    precision: number;
  };
  raw_discount_subtotal: {
    value: string;
    precision: number;
  };
  raw_discount_tax_total: {
    value: string;
    precision: number;
  };
  raw_tax_total: {
    value: string;
    precision: number;
  };
  raw_original_tax_total: {
    value: string;
    precision: number;
  };
}

// Shipping Option
export interface ShippingOption {
  id: string;
  name: string;
  price_type: string;
  calculated_price: {
    calculated_amount: number;
    currency_code: string;
  };
  amount: number;
  is_tax_inclusive: boolean;
  insufficient_inventory: boolean;
}

// Promotion
export interface Promotion {
  id: string;
  code: string;
  is_automatic: boolean;
  type: string;
  status: string;
  application_method: {
    type: string;
    value: number;
  };
}

// Cart
export interface Cart {
  id: string;
  currency_code: string;
  email: string | null;
  region_id: string;
  total: number;
  subtotal: number;
  discount_total?: number;
  item_total?: number;
  shipping_total?: number;
  items: CartItem[];
  shipping_methods: ShippingMethod[];
  shipping_address: Address | null;
  billing_address: Address | null;
  promotions: Promotion[];
  customer_id?: string;
}

// Payment Provider
export interface PaymentProvider {
  id: string;
  is_enabled: boolean;
}

// Payment Session
export interface PaymentSession {
  id: string;
  currency_code: string;
  provider_id: string;
  status: string;
  amount: number;
  data?: {
    cartId?: string;
    checkoutUrl?: string;
    invoiceId?: string;
    invoiceKey?: string;
    returnUrl?: string;
  };
}

// Payment Collection
export interface PaymentCollection {
  id: string;
  currency_code: string;
  amount: number;
  status?: string;
  payment_sessions: PaymentSession[];
}

// Order
export interface Order {
  id: string;
  status: string;
  display_id: number;
  currency_code: string;
  email: string;
  total: number;
  subtotal: number;
  discount_total: number;
  item_total: number;
  shipping_total: number;
  items: CartItem[];
  shipping_address: Address;
  billing_address: Address;
  shipping_methods: ShippingMethod[];
  payment_collections: PaymentCollection[];
}

// API Responses
export interface SettingsResponse {
  id: string;
  metadata: StoreSettings["metadata"];
}

export interface ProductTagsResponse {
  product_tags: ProductTag[];
  count: number;
  offset: number;
  limit: number;
}

export interface ProductsResponse {
  products: Product[];
  count?: number;
  offset?: number;
  limit?: number;
}

export interface ProductResponse {
  product: Product;
}

export interface CategoriesResponse {
  product_categories: Category[];
  count: number;
  offset: number;
  limit: number;
}

export interface CategoryResponse {
  product_category: Category;
}

export interface BrandsResponse {
  brands: Brand[];
}

export interface BrandResponse {
  brand: Brand;
}

export interface FreeShippingThresholdResponse {
  threshold: string | null;
}

export interface SliderImagesResponse {
  images: { url: string; link: string }[];
  count: number;
}

export interface CartResponse {
  cart: Cart;
}

export interface ShippingOptionsResponse {
  shipping_options: ShippingOption[];
}

export interface PaymentProvidersResponse {
  payment_providers: PaymentProvider[];
  count: number;
}

export interface PaymentCollectionResponse {
  payment_collection: PaymentCollection;
}

export interface OrderResponse {
  type: string;
  order: Order;
}

export interface TogetherResponse {
  products: Product[];
}

export interface PromotionsResponse {
  promotions: Promotion[];
}

// Customer
export interface Customer {
  id: string;
  email: string;
  company_name: string | null;
  first_name: string;
  last_name: string;
  phone: string | null;
  metadata: Record<string, unknown> | null;
  has_account: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  addresses?: CustomerAddress[];
}

// Customer Address
export interface CustomerAddress {
  id: string;
  address_name: string | null;
  is_default_shipping: boolean;
  is_default_billing: boolean;
  company: string | null;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string | null;
  city: string;
  country_code: string;
  province: string | null;
  postal_code: string | null;
  phone: string | null;
  metadata: Record<string, unknown> | null;
  customer_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Wishlist Item
export interface WishlistItem {
  id: string;
  product_variant_id: string;
  wishlist_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  product_variant: {
    id: string;
    title: string;
    product_id: string;
    metadata?: {
      thumbnail?: string;
      images?: { url: string }[];
    } | null;
    prices?: {
      id: string;
      currency_code: string;
      amount: number;
    }[];
    product?: {
      id: string;
      title: string;
      handle: string;
      thumbnail: string | null;
    };
  };
}

// Wishlist
export interface Wishlist {
  id: string;
  customer_id: string;
  sales_channel_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  items: WishlistItem[];
}

// Order Item (for orders list)
export interface OrderItem {
  id: string;
  title: string;
  subtitle: string;
  thumbnail: string | null;
  variant_id: string;
  product_id: string;
  product_title: string;
  product_handle: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  total: number;
  original_total: number;
  discount_total: number;
  adjustments?: { code: string; amount: number }[];
  variant?: {
    id: string;
    title: string;
    product?: {
      id: string;
      title: string;
      handle: string;
    };
  };
}

// Customer Order
export interface CustomerOrder {
  id: string;
  status: string;
  display_id: number;
  currency_code: string;
  email?: string;
  total: number;
  subtotal?: number;
  discount_total?: number;
  shipping_total?: number;
  item_total?: number;
  payment_status: string;
  fulfillment_status: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  shipping_address?: Address;
  billing_address?: Address;
  shipping_methods?: ShippingMethod[];
  payment_collections?: PaymentCollection[];
  fulfillments?: unknown[];
  cart?: {
    id: string;
  };
}

// Auth Response
export interface AuthResponse {
  token: string;
}

// Customer Response
export interface CustomerResponse {
  customer: Customer;
}

// Wishlist Response
export interface WishlistResponse {
  wishlist: Wishlist;
}

// Orders Response
export interface OrdersResponse {
  orders: CustomerOrder[];
  count: number;
  offset: number;
  limit: number;
}

// Single Order Response
export interface SingleOrderResponse {
  order: CustomerOrder;
}

// Addresses Response
export interface AddressesResponse {
  addresses: CustomerAddress[];
  count: number;
  offset: number;
  limit: number;
}

// Return Reason
export interface ReturnReason {
  id: string;
  value: string;
  label: string;
  created_at: string;
  updated_at: string;
}

// Return Item
export interface ReturnItem {
  id: string;
  quantity: number;
  received_quantity: number;
  damaged_quantity: number;
  item_id: string;
  return_id: string;
}

// Return
export interface Return {
  id: string;
  display_id: number;
  order_id: string;
  created_at: string;
  canceled_at: string | null;
  received_at: string | null;
  items: ReturnItem[];
}

// Return Reasons Response
export interface ReturnReasonsResponse {
  return_reasons: ReturnReason[];
  count: number;
  offset: number;
  limit: number;
}

// Return Response
export interface ReturnResponse {
  return: Return;
}

// Create Return Request
export interface CreateReturnRequest {
  order_id: string;
  items: {
    id: string;
    quantity: number;
    reason_id?: string;
    note?: string;
  }[];
  return_shipping: {
    option_id: string;
    price?: number;
  };
  note?: string;
  location_id?: string;
}
