const ProductSchema = {
  name: 'Product',
  primaryKey: 'product_code',
  properties: {
    name: 'string',
    code: 'string',
    product_code: 'string',
    product_cost: 'int',
    product_price: 'int',
    images: 'string[]',
    in_stock: 'int',
  },
};
const ProductEmbededSchema = {
  name: 'ProductSchema',
  embedded: true,
  properties: {
    name: 'string',
    code: 'string',
    product_code: 'string',
    product_cost: 'int',
    product_price: 'int',
    images: 'string[]',
    in_stock: 'int',
    mainProductId: 'int',
  },
};

const SaleItemSchema = {
  name: 'SaleItem',
  embedded: true,
  properties: {
    id: 'string', // Changed to string
    saleId: 'string', // Changed to string
    productId: 'ProductSchema[]', // Keep this as an array of ProductSchema (assuming ProductSchema is embedded or linked)
    productPrice: 'string', // Changed to string
    netUnitPrice: 'string', // Changed to string
    taxType: 'string', // Changed to string
    taxValue: 'string', // Changed to string
    taxAmount: 'string', // Changed to string
    discountType: 'string', // Changed to string
    discountValue: 'string', // Changed to string
    discountAmount: 'string', // Changed to string
    quantity: 'string', // Changed to string
    subTotal: 'string', // Changed to string
    createdAt: 'string', // Already string
    updatedAt: 'string', // Already string
  },
};
const SaleSchema = {
  name: 'Sale',
  primaryKey: 'id',
  properties: {
    id: 'string', // Changed to string
    type: 'string', // Already string
    outletId: 'string?', // Already string with nullable option
    date: 'string', // Already string
    isReturn: 'string', // Changed to string
    customerId: 'string', // Changed to string
    customerName: 'string', // Already string
    warehouseId: 'string', // Changed to string
    warehouseName: 'string', // Already string
    taxRate: 'string', // Changed to string
    taxAmount: 'string', // Changed to string
    discount: 'string', // Changed to string
    shipping: 'string', // Changed to string
    grandTotal: 'string', // Changed to string
    receivedAmount: 'string?', // Changed to string with nullable option
    paidAmount: 'string', // Changed to string
    dueAmount: 'string', // Changed to string
    paymentType: 'string', // Changed to string
    note: 'string?', // Already string with nullable option
    status: 'string', // Changed to string
    paymentStatus: 'string', // Changed to string
    referenceCode: 'string', // Already string
    barcodeUrl: 'string', // Already string
    createdAt: 'string', // Already string,
    saleItems: 'SaleItem[]',
  },
};

const OutletSchema = {
  name: 'Outlet',
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: 'string',
    email: 'string',
    phone: 'string',
    country: 'string',
    city: 'string',
    address: 'string',
    latitude: 'string',
    longitude: 'string',
    credit_limit: 'string',
  },
};

const ProductCategorySchema = {
  name: 'ProductCategory',
  primaryKey: 'id',
  properties: {
    id: 'int', // or 'string' depending on your API data type for id
    name: 'string',
  },
};

const PromotionSchema = {
  name: 'Promotion',
  primaryKey: 'id',
  properties: {
    id: 'int', // Primary key
    type: 'string?', // Optional field// Nested schema for attributess
    name: 'string', // Promotion name
    code: 'string', // Promotion code
    startDate: 'string', // Start date
    endDate: 'string', // End date
    howManyTimesCanUse: 'int', // Times promotion can be used
    discountType: 'int', // Discount type
    discount: 'int', // Discount amount
    howManyTimesUsed: 'int', // Times promotion has been used
    products: 'string[]', // Array of products
  },
};

const GiftSchema = {
  name: 'Gift',
  primaryKey: 'id',
  properties: {
    id: 'int', // Primary key
    title: 'string',
    quantity: 'int',
    description: 'string', // Fixed the spelling of 'description'
    image: 'string',
    createdAt: 'string?', // Nullable fields
    updatedAt: 'string?', // Nullable fields
    deletedAt: 'string?', // Nullable fields
  },
};

const SaveSaleSchema = {
  name: 'SaveSale',
  properties: {
    customer_id: 'int',
    date: 'string',
    discount: 'int',
    grand_total: 'int',
    is_sale_created: 'string',
    note: 'string',
    paid_amount: 'int',
    payment_status: 'int',
    payment_type: 'int',
    received_amount: 'int',
    sale_items: 'string', // You can store sale_items as a JSON string
    shipping: 'string',
    status: 'int',
    tax_amount: 'string',
    tax_rate: 'string',
    warehouse_id: 'int',
  },
};
const SaveSaleReturnSchema = {
  name: 'SaveSaleReturn', // Renamed to SaveSaleReturn
  primaryKey: 'id', // Use a unique, randomly generated UUID as the primary key
  properties: {
    id: 'string', // The random UUID
    sale_id: 'int', // Sale ID (not unique)
    customer_id: 'int',
    date: 'date',
    discount: 'int',
    grand_total: 'int',
    note: 'string',
    paid_amount: 'int',
    payment_type: 'int',
    received_amount: 'int',
    sale_reference: 'string',
    sale_return_items: 'string', // Store return items as a JSON string
    shipping: 'int',
    status: 'int',
    tax_amount: 'int',
    tax_rate: 'int',
    warehouse_id: 'int',
  },
};
const SaveGiftSchema = {
  name: 'SaveGift',
  primaryKey: 'id', // Use a unique identifier
  properties: {
    id: 'string', // Unique ID
    sales_man_id: 'int',
    outlet_id: 'int',
    gift_id: 'string',
    quantity: 'int',
    discription: 'string',
    location: 'string?',
    image: 'string?',
    uploaded_date: 'date',
  },
};

import Realm from 'realm';
const realmObject = new Realm({
  schema: [
    ProductSchema,
    OutletSchema,
    ProductCategorySchema,
    PromotionSchema,
    GiftSchema,
    SaleSchema,
    SaleItemSchema,
    ProductEmbededSchema,
    SaveSaleSchema,
    SaveSaleReturnSchema,
    SaveGiftSchema,
  ],
});
export {realmObject};
