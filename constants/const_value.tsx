import AsyncStorage from '@react-native-async-storage/async-storage';
import {format} from 'date-fns';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {LanguageModel} from '../screens/login/models/language_model';
import User from '../screens/login/models/user_model';
import {da} from 'date-fns/locale/da';
import moment from 'moment';

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
    if (date.includes('T')) {
      return format(new Date(date), 'dd MMM yyyy HH:mm');
    } else {
      let momentObj = moment(date, 'DD-MM-YYYY hh:mm:ss');

      return moment(momentObj).format('DD MMM yyyy hh:mm');
    }
  },
 getCurrentLocationName:async () => {
   if (Platform.OS === 'android') {
     return await Const.requestLocationPermission();
   } else {
     return await Const.getLocation();
   }
 },

  requestLocationPermission: async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Wait for location retrieval and address resolution
        return await Const.getLocation();
      } else {
        console.log('Location permission denied');
        return 'Permission denied';
      }
    } catch (err) {
      console.warn(err);
      return 'Error in requesting location permission';
    }
  },

  getLocation: async () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Wait for the address to be retrieved
            console.log(position.coords)
            const address = await Const.getAddressFromCoordinates(
              latitude.toString(),
              longitude.toString()
            );
            resolve(address);  // Return the resolved address
          } catch (error) {
            reject('Error in getting address');
          }
        },
        (error) => {
          console.log(error.code, error.message);
          reject('Error in getting location');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  },

  getAddressFromCoordinates: async (latitude:string, longitude:string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyD6lpgvCGHSvAInVE7wbZ2-OrwJPyVn0OA`
      );
      const data = await response.json();
      console.log(data)
      if (data.results && data.results.length > 0) {
        // Return the formatted address string
        return data.results[0].formatted_address;
      } else {
        return 'No address found';
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Error fetching address';
    }
  },

  getFormatedDate2: (date: string) => {
console.log(date);
      let momentObj = moment(date, 'YYYY-MM-DD hh:mm:ss');

      return moment(momentObj).format('DD MMM yyyy hh:mm');

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
