export interface ProductUnit {
  id: number;
  name: string;
  short_name?: string;
  is_default?: number;
  base_unit?: number;
  created_at: string;
  updated_at: string;
}

export interface Stock {
  id: number;
  warehouse_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  alert: number;
}

export interface Warehouse {
  total_quantity: number;
  name: string;
}

export interface Product {
  id: string; // or number, depending on how you're using IDs
  name: string;
  code: string;
  product_code: string;
  main_product_id: number;
  quantity: number;
  product_category_id: number;
  brand_id: number;
  product_cost: number;
  product_price: number;
  product_unit: string;
  sale_unit: string;
  purchase_unit: string;
  stock_alert: string;
  quantity_limit: number | null;
  order_tax: number;
  tax_type: string;
  notes: string | null;
  images: any;
  product_category_name: string;
  brand_name: string;
  barcode_image_url: string;
  barcode_symbol: number;
  created_at: string;
  product_unit_name: ProductUnit;
  purchase_unit_name: ProductUnit;
  sale_unit_name: ProductUnit;
  stock: Stock;
  warehouse: Warehouse[];
  barcode_url: string;
  in_stock: number;
  assign_quantity: number;
}
