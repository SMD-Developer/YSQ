// services/productService.ts
import axios from 'axios';
import {Const} from '../../../constants/const_value';
import User from '../../login/models/user_model';

class SaleHistoryService {
  static async getSalesHisyoty(outletId?: string, page?: number) {
    const user = await User.getUser();
    console.log(user?.id);
    try {
      const token = await Const.getTokenHeader();
      const response = await axios.get(
        `${Const.BASE_URL}api/m1/sales/salesman/` + user?.id,
        {
          headers: token,
          params: {
            page: page ?? 1,
          },
        },
      );
      var returnData = response.data.data;
      return {response:returnData, last_page: response.data.meta.last_page};
    } catch (error) {
      console.log('Error caught', error); // Log full error object
      //console.log('Error caught'); // Log full error object
      if (axios.isAxiosError(error)) {
        //console.log('This is an Axios error:', error.response?.data.message);
        throw new Error(
          error.response?.data?.message || 'Fetch sales returns failed',
        );
      } else {
        //console.log('Unexpected error:', error);
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  }
  static async getGiftHisyoty(outletId?: string, page?: number) {
    const user = await User.getUser();
    try {
      console.log('getting gifts', 'gittts');
      const token = await Const.getTokenHeader();
      const response = await axios.get(
        `${Const.BASE_URL}api/m1/submit-gift-history/` + user?.id,
        {
          headers: token,
          params: {
            page: page ?? 1,
          },
        },
      );
      console.log('response', response.data);
      return {
        response: response.data.data.data,
        last_page: response.data.last_page,
      };
    } catch (error) {
      //console.log('Error caught'); // Log full error object
      if (axios.isAxiosError(error)) {
        //console.log('This is an Axios error:', error.response?.data.message);
        throw new Error(
          error.response?.data?.message || 'Fetch sales returns failed',
        );
      } else {
        //console.log('Unexpected error:', error);
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  }
  static async getSalesReturnHisyoty(page?: number) {
    try {
      const token = await Const.getTokenHeader();
      const response = await axios.get(`${Const.BASE_URL}api/m1/sales-return`, {
        headers: token,
        params: {
          "salesman_id": Const.user?.id
        },
      });
      //console.log('response', response.data);
      return {
        response: response.data.data,
        last_page: 1,
      };
    } catch (error) {
      //console.log('Error caught'); // Log full error object
      if (axios.isAxiosError(error)) {
        //console.log('This is an Axios error:', error.response?.data.message);
        throw new Error(
          error.response?.data?.message || 'Fetch sales returns failed',
        );
      } else {
        //console.log('Unexpected error:', error);
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  }
}

export default SaleHistoryService;
