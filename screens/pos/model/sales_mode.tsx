import {Product} from './product_model';

interface UnitName {
  id: number;
  name: string;
  is_default: number;
  created_at: string;
  updated_at: string;
}

// Model for Sale Items
export interface SaleItem {
  id: number;
  sale_id: number;
  product_id: Product[];
  product_price: number;
  net_unit_price: number;
  tax_type: number;
  tax_value: number;
  tax_amount: number;
  discount_type: number;
  discount_value: number;
  discount_amount: number;
  sale_unit: UnitName;
  quantity: number;
  sub_total: number;
  created_at: string;
  updated_at: string;
}

// Main Sales Model
export interface Sale {
  type: string;
  id: number;
  attributes: SaleAttributes;
  links: SaleLinks;
}

interface SaleAttributes {
  date: string;
  is_return: number;
  customer_id: number;
  customer_name: string;
  warehouse_id: number;
  warehouse_name: string;
  tax_rate: number;
  tax_amount: number;
  discount: number;
  shipping: number;
  grand_total: number;
  received_amount: number | null;
  paid_amount: number;
  due_amount: number;
  payment_type: number;
  note: string | null;
  status: number;
  payment_status: number;
  reference_code: string;
  sale_items: SaleItem[];
  sale_return_items: SaleItem[];
  created_at: string;
  barcode_url: string;
  uploaded_image: string;
}

interface SaleLinks {
  self: string;
}
