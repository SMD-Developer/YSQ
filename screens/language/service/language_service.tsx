import axios from 'axios';
import {Const} from '../../../constants/const_value';

export const LanguageService = {
  getLanguages: async () => {
    try {
      const response = await axios.get(`${Const.BASE_URL}api/m1/get-languages`);
      return response.data;
    } catch (error) {
      console.error('Error fetching languages:', error.response);
      console.error('Error fetching languages:', error);
      throw error;
    }
  },
};
