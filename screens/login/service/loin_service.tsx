import axios from 'axios';
import {Const} from '../../../constants/const_value';
import {LanguageModel} from '../models/language_model';
import User from '../models/user_model';
import NetInfo from '@react-native-community/netinfo';

class LoginService {
  static getUserData = async () => {

    const networkState = await NetInfo.fetch();
    if (!networkState.isConnected) {
      return;
    }

    console.log('Network is available');

    const user = await User.getUser();
    const token = await Const.getTokenHeader();
    const response = await axios.get(
      `${Const.BASE_URL}api/m1/get-profile/${user?.id}`,
      {
        headers: token,
      },
    );

    if (response.data.data) {
      const userResponse = response.data.data;
      const newUser = new User(userResponse);
      await newUser.save();
    }
  };
  static login = async (email: string, password: string, language: string) => {
    try {
      const response = await axios.post(`${Const.BASE_URL}api/m1/login`, {
        email,
        password,
        language,
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
  static updateLanguage = async (language: string) => {
    //console.log('update language', language);
    //console.log('body',  {
    //   language: language,
    // });
    try {
      const response = await axios.post(
        `${Const.BASE_URL}api/m1/change_language`,
        {
          language: language,
        },
      );
      //console.log('update language', response);
      //console.log('language data',response.data.data.language_data);
      Const.languageData = new LanguageModel(response.data.data.language_data);
      //console.log('language', Const.languageData);

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
}

export default LoginService;
