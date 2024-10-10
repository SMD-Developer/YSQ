export interface PromotionAttributes {
  name: string;
  code: string;
  start_date: string;
  end_date: string;
  how_many_time_can_use: number;
  discount_type: number;
  discount: number;
  how_many_time_used: number;
  products: any[]; // Adjust based on your product structure
}
export interface Promotion {
  id: number;
  attributes: PromotionAttributes;
}
