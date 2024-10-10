import AsyncStorage from '@react-native-async-storage/async-storage';
import {format} from 'date-fns';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {LanguageModel} from '../screens/login/models/language_model';
import User from '../screens/login/models/user_model';

export const Const = {
  PADDING_HORIZONTAL: 20,
  languageData: null as LanguageModel | null,
  selectedOutlet: null as string | null,
  user: null as User | null,
  async getUserData() {
    this.user = await User.getUser();
  },

  // BASE_URL: 'https://ysqsandbox.smddeveloper.com/',
  BASE_URL: 'https://ysq.smddeveloper.com/',
  saveTokenAsyncStorage: async (value: string) => {
    await AsyncStorage.setItem('token', value);
  },
  getTokenAsyncStorage: async () => {
    return await AsyncStorage.getItem('token');
  },
  clearToken: async () => {
    await AsyncStorage.removeItem('token');
  },
  getTokenHeaderWithFOrmType: async () => {
    const token = await Const.getTokenAsyncStorage();
    //console.log('token', token);

    if (!token) {
      throw new Error('Token is missing');
    }
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // Pass the token here
    };
  },
  getTokenHeader: async () => {
    const token = await Const.getTokenAsyncStorage();
    //console.log('token', token);

    if (!token) {
      throw new Error('Token is missing');
    }
    return {
      Authorization: `Bearer ${token}`, // Pass the token here
    };
  },

  saveCountryAsyncStorage: async (value: string) => {
    await AsyncStorage.setItem('country', value);
  },
  getCountryAsyncStorage: async () => {
    return await AsyncStorage.getItem('country');
  },
  saveLaunguageAsyncStorage: async (value: string) => {
    await AsyncStorage.setItem('language', value);
  },
  getLaunguageAsyncStorage: async () => {
    return await AsyncStorage.getItem('language');
  },

  getFormatedDate: (date: string) => {
    try {
      return format(new Date(date), 'dd MMM yyyy HH:mm');
    } catch (e) {
      const [month, day, yearTime] = date.split('-'); // Split by '-'
      const [year, time] = yearTime.split(' '); // Split year and time
      const isoDateString = `${year}-${month}-${day}T00:00:00`; // Reorder to 'yyyy-MM-ddTHH:mm:ss'

      const dateObject = new Date(year, month, day);
      const formattedDate = format(dateObject, 'dd MMM yyyy');

      return formattedDate;
    }
  },
  getCurrentLocation: async (): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    return new Promise<{latitude: number; longitude: number}>(
      (resolve, reject) => {
        const requestLocationPermission = async () => {
          if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: 'Location Permission',
                message:
                  'We need to access your location to set the outlet location.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              },
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
              reject(new Error('Location permission denied'));
              return;
            }
          }

          Geolocation.getCurrentPosition(
            position => {
              const {latitude, longitude} = position.coords;
              resolve({latitude, longitude});
            },
            error => {
              reject(new Error(error.message));
            },
            {
              enableHighAccuracy: true,
              timeout: 20000,
              maximumAge: 1000,
            },
          );
        };

        requestLocationPermission();
      },
    );
  },
};
