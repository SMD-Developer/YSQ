// models/home_model.ts

export interface OpenCashItem {
  id: number;
  unique_id: string;
  sales_man_id: number;
  cash: number;
  type: string;
  created_at: string;
  sales_man: any;
  updated_at: string | null;
}

export interface OpenCashData {
  success: boolean;
  data: OpenCashItem[];
  message: string;
}
