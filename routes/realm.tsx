const ProductSchema = {
  name: 'Product',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    code: 'string',
    product_code: 'string',
    product_cost: 'int',
    product_price: 'int',
    images: 'string[]',
    in_stock: 'int',
    assign_quantity: 'int',
    sale_unit_name: 'string',
    product_unit_name: 'string',
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
    latitude: 'mixed',
    longitude: 'mixed',
    credit_limit: 'mixed',
    channelDetails: 'mixed',
    areaDetails: 'mixed',
    assigned_date: 'mixed',
  },
};
const AddOutletSchema = {
  name: 'AddOutlet',
  properties: {
    name: 'mixed',
    email: 'mixed',
    country: 'mixed',
    phone: 'mixed',
    city: 'mixed?',
    address: 'mixed',
    latitude: 'mixed',
    longitude: 'mixed',
    credit_limit: 'mixed',
    user_id: 'mixed',
    salesman_id: 'mixed',
    ware_id: 'mixed',
    distributor_id: 'mixed',
    chanel_id: 'mixed',
    area_id: 'mixed',
    postal_code: 'mixed?',
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
    customer_id: 'string',
    date: 'string',
    discount: 'int',
    grand_total: 'int',
    is_sale_created: 'string',
    note: 'string',
    paid_amount: 'int',
    payment_status: 'int',
    payment_type: 'string',
    received_amount: 'int',
    sale_items: 'string', // You can store sale_items as a JSON string
    shipping: 'string',
    status: 'int',
    tax_amount: 'string',
    tax_rate: 'string',
    warehouse_id: 'int',
    image: 'string',
    salesman_id: 'int',
  },
};
const MileageSchema = {
  name: 'Mileage',
  properties: {
    sale_man_id: 'string',
    type: 'string',
    mileage: 'string',
    vehicle_image: 'string?', // Optional field
    mileage_image: 'string?', // Optional field
  },
};
const SaveSaleReturnSchema = {
  name: 'SaveSaleReturn', // Renamed to SaveSaleReturn
  primaryKey: 'id', // Use a unique, randomly generated UUID as the primary key
  properties: {
    id: 'string', // The random UUID
    sale_id: 'mixed', // Sale ID (not unique)
    customer_id: 'mixed',
    date: 'mixed',
    discount: 'mixed',
    grand_total: 'mixed',
    is_sale_created: 'mixed',
    note: 'mixed',
    paid_amount: 'mixed',
    payment_status: 'mixed',
    payment_type: 'mixed',
    received_amount: 'mixed',
    sale_items: 'string', // You can store sale_items as a JSON string
    shipping: 'mixed',
    status: 'mixed',
    tax_amount: 'mixed',
    tax_rate: 'mixed',
    warehouse_id: 'mixed',
    image: 'mixed',
    salesman_id: 'mixed',
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
    uploaded_date: 'string',
  },
};
const AreaSchema = {
  name: 'Area',
  properties: {
    id: 'mixed',
    name: 'string',
  },
};

// Define schema for storing channel list
const ChannelSchema = {
  name: 'Channel',
  properties: {
    id: 'mixed',
    name: 'string',
  },
};

import Realm from 'realm';
const realmObject = new Realm({
  schema: [
    ProductSchema,
    AreaSchema,
    ChannelSchema,
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
    MileageSchema,
    AddOutletSchema
  ],
});
export {realmObject};
