import axios from 'axios';
import {Const} from '../../../constants/const_value';
import {realmObject} from '../../../routes/realm';
import NetInfo from '@react-native-community/netinfo';
import User from '../../login/models/user_model';

class HomeService {
  static getData = async () => {
    try {
      const user = await User.getUser();
      var getTokenHeader = await Const.getTokenHeaderWithFOrmType();
      //console.log('getTokenHeader', getTokenHeader);
      const response = await axios.get(`${Const.BASE_URL}api/m1/dashboard`, {
        headers: getTokenHeader,
        params: {user_id: user?.id},
      });
      return response.data;
    } catch (error) {
      //console.log('Error caught'); // Log full error object
      if (axios.isAxiosError(error)) {
        //console.log('This is an Axios error:', error.response?.data.message);
        throw new Error(error.response?.data?.message || 'Login failed');
      } else {
        //console.log('Unexpected error:', error);
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  };
  static getPromotions = async () => {
    try {
      // Check network availability
      const networkState = await NetInfo.fetch();

      if (networkState.isConnected) {
        console.log('Network is available');
        const getTokenHeader = await Const.getTokenHeader();
        const response = await axios.get(
          `${Const.BASE_URL}api/m1/coupon-codes`,
          {
            headers: getTokenHeader,
          },
        );
        if (response.data) {
          // Map API response to match Realm schema
          const promotions = response.data.data.map((item: any) => ({
            id: item.id,
            type: item.type,
            name: item.attributes.name,
            code: item.attributes.code,
            startDate: item.attributes.start_date, // Convert to Date object
            endDate: item.attributes.end_date, // Convert to Date object
            howManyTimesCanUse: item.attributes.how_many_time_can_use,
            discountType: item.attributes.discount_type,
            discount: item.attributes.discount,
            howManyTimesUsed: item.attributes.how_many_time_used,
            products: item.attributes.products,
          }));
          // Store promotions in Realm
          realmObject.write(() => {
            realmObject.delete(realmObject.objects('Promotion'));
            promotions.forEach((item: any) => {
              realmObject.create('Promotion', {
                id: item.id,
                type: item.type,
                name: item.name,
                code: item.code,
                startDate: item.startDate, // Convert to Date object
                endDate: item.endDate, // Convert to Date object
                howManyTimesCanUse: item.howManyTimesCanUse,
                discountType: item.discountType,
                discount: item.discount,
                howManyTimesUsed: item.howManyTimesUsed,
                products: item.products,
              });
            });
          });
          var dataResponse = promotions.map(promotion => ({
            type: promotion.type,
            id: promotion.id,
            attributes: {
              name: promotion.name,
              code: promotion.code,
              start_date: promotion.startDate, // Convert back to string for API-like format
              end_date: promotion.endDate, // Convert back to string
              how_many_time_can_use: promotion.howManyTimesCanUse,
              discount_type: promotion.discountType,
              discount: promotion.discount,
              how_many_time_used: promotion.howManyTimesUsed,
              products: promotion.products,
            },
            links: [], // Assuming links are not used in your case
          }));
          return dataResponse;
        } else {
          throw new Error('Failed to fetch promotions');
        }
      } else {
        // No network, fetch from Realm
        console.log('Network is not available for promotions');
        const offlinePromotions = realmObject.objects('Promotion');
        if (offlinePromotions.length > 0) {
          return offlinePromotions.map(promotion => ({
            type: promotion.type,
            id: promotion.id,
            attributes: {
              name: promotion.name,
              code: promotion.code,
              start_date: promotion.startDate, // Convert back to string for API-like format
              end_date: promotion.endDate, // Convert back to string
              how_many_time_can_use: promotion.howManyTimesCanUse,
              discount_type: promotion.discountType,
              discount: promotion.discount,
              how_many_time_used: promotion.howManyTimesUsed,
              products: promotion.products,
            },
            links: [], // Assuming links are not used in your case
          }));
        } else {
          throw new Error('No network and no cached promotions available');
        }
      }
    } catch (error) {
      console.log('Error caught'); // Log full error object
      console.log('Error:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Fetch promotions failed',
        );
      } else {
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  };
  static getOpenCash = async (salesManId: number, screenType: number) => {
    try {
      const getTokenHeader = await Const.getTokenHeaderWithFOrmType();
      //console.log('getTokenHeader', getTokenHeader);
      //console.log(
      //   'url',
      //   `${Const.BASE_URL}api/m1/${
      //     isOpening ? 'opening-cash-list' : 'closing-cash-list'
      //   }`,
      // );
      const response = await axios.get(
        `${Const.BASE_URL}api/m1/${
          screenType === 0
            ? 'opening-closing-cash-list'
            : screenType === 1
            ? 'opening-cash-list'
            : 'closing-cash-list'
        }`,
        {
          params: {sales_man_id: salesManId},
          headers: getTokenHeader,
        },
      );
      return response.data;
    } catch (error) {
      //console.log('Error caught'); // Log full error object
      if (axios.isAxiosError(error)) {
        //console.log('This is an Axios error:', error.response?.data.message);
        throw new Error(
          error.response?.data?.message ||
            'Failed to retrieve opening cash list',
        );
      } else {
        //console.log('Unexpected error:', error);
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  };
}

export default HomeService;
