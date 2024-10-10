import {AddOutletModel} from '../../outlet/modle/add_outlet_model';

export interface GiftDetails {
  id: number;
  title: string;
  quantity: number;
  description: string; // Note: Corrected spelling of "description"
  image: string;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface GiftTransaction {
  id: number;
  sales_man_id: number;
  unique_id: string;
  gift_id: number;
  outlet_id: number;
  outlets: AddOutletModel;
  quantity: number;
  description: string; // Note: Corrected spelling of "description"
  image: string;
  gitf_details: GiftDetails; // Nested object for gift details
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  location: string;
  uploaded_date: string; // Date in string format
}
